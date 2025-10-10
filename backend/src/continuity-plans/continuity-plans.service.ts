import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService, WorkflowTaskType } from '../workflow-engine/workflow-engine.service';
import { CreateContinuityPlanDto } from './dto/create-continuity-plan.dto';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';
import { PlanStatus } from '@prisma/client';

@Injectable()
export class ContinuityPlansService {
  private readonly logger = new Logger(ContinuityPlansService.name);

  constructor(
    private prisma: PrismaService,
    private dgraphService: DgraphService,
    private workflowEngine: WorkflowEngineService,
  ) {}

  /**
   * Crear plan de continuidad con sincronización al grafo
   */
  async create(dto: CreateContinuityPlanDto, tenantId: string, userId: string) {
    const plan = await this.prisma.continuityPlan.create({
      data: {
        tenantId,
        processId: dto.processId,
        name: dto.name,
        type: dto.type as any,
        content: dto.content as any,
        version: dto.version || '1.0',
        status: (dto.status as any) || PlanStatus.DRAFT,
        approvedBy: dto.approvedBy,
      },
      include: { process: true },
    });

    await this.dgraphService.upsertNode(
      'ContinuityPlan',
      { id: plan.id, name: plan.name, status: plan.status, nodeType: 'ContinuityPlan' },
      tenantId,
    );

    if (plan.processId) {
      await this.dgraphService.createRelationship(plan.id, plan.processId, 'protects', tenantId);
    }

    this.logger.log(`Plan created: ${plan.id} by ${userId}`);
    return plan;
  }

  async findAll(tenantId: string) {
    return this.prisma.continuityPlan.findMany({
      where: { tenantId },
      include: { process: { include: { biaAssessments: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const plan = await this.prisma.continuityPlan.findFirst({
      where: { id, tenantId },
      include: { process: { include: { biaAssessments: true, riskAssessments: true } } },
    });

    if (!plan) throw new NotFoundException(`Plan ${id} not found`);

    let dependencyMap = null;
    if (plan.processId) {
      dependencyMap = await this.dgraphService.getDependencies(plan.processId, tenantId, 3);
    }

    return { ...plan, dependencyMap };
  }

  async getImpactAnalysis(id: string, tenantId: string) {
    const plan = await this.findOne(id, tenantId);
    if (!plan.processId) return { message: 'No process linked' };
    return this.dgraphService.getImpactAnalysis(plan.processId, tenantId, 3);
  }

  async update(id: string, tenantId: string, dto: UpdateContinuityPlanDto, userId: string) {
    const plan = await this.prisma.continuityPlan.updateMany({
      where: { id, tenantId },
      data: {
        name: dto.name,
        type: dto.type as any,
        content: dto.content as any,
        version: dto.version,
        status: dto.status as any,
        approvedBy: dto.approvedBy,
      },
    });

    if (dto.name || dto.status) {
      await this.dgraphService.upsertNode(
        'ContinuityPlan',
        { id, name: dto.name, status: dto.status, nodeType: 'ContinuityPlan' },
        tenantId,
      );
    }

    if (dto.processId) {
      await this.dgraphService.createRelationship(id, dto.processId, 'protects', tenantId);
    }

    this.logger.log(`Plan updated: ${id} by ${userId}`);
    return plan;
  }

  async submitForReview(id: string, tenantId: string, approvers: string[], userId: string) {
    await this.prisma.continuityPlan.update({
      where: { id },
      data: { status: PlanStatus.REVIEW },
    });

    await this.workflowEngine.startWorkflow({
      name: 'Plan Review Workflow',
      entityType: 'continuity_plan',
      entityId: id,
      tenantId,
      createdBy: userId,
      steps: approvers.map((approverId, idx) => ({
        id: `approval-${idx}`,
        type: WorkflowTaskType.APPROVAL,
        name: 'Approve Plan',
        assignedTo: [approverId],
      })),
    });

    this.logger.log(`Plan ${id} submitted for review by ${userId}`);
    return { message: 'Plan submitted for review' };
  }

  async approvePlan(id: string, tenantId: string, userId: string, comments?: string) {
    const plan = await this.prisma.continuityPlan.update({
      where: { id },
      data: {
        status: PlanStatus.APPROVED,
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    this.logger.log(`Plan ${id} approved by ${userId}`);
    return plan;
  }

  async activatePlan(id: string, tenantId: string, userId: string, reason: string) {
    const plan = await this.prisma.continuityPlan.findFirst({ where: { id, tenantId } });
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);

    const activated = await this.prisma.continuityPlan.update({
      where: { id },
      data: {
        status: PlanStatus.ACTIVE,
        lastActivated: new Date(),
        executionLog: { activatedBy: userId, activatedAt: new Date(), reason, steps: [] },
      },
    });

    await this.workflowEngine.startWorkflow({
      name: 'Plan Activation Notification',
      entityType: 'continuity_plan',
      entityId: id,
      tenantId,
      createdBy: userId,
      steps: [{
        id: 'notify-team',
        type: WorkflowTaskType.NOTIFICATION,
        name: 'Notify Response Team',
        assignedTo: [userId], // Asignar al activador
        metadata: { planId: id, planName: plan.name, activatedBy: userId, reason },
      }],
    });

    this.logger.log(`Plan activated: ${id} by ${userId}`);
    return activated;
  }

  async clonePlan(id: string, tenantId: string, newName: string, userId: string) {
    const original = await this.prisma.continuityPlan.findFirst({ where: { id, tenantId } });
    if (!original) throw new NotFoundException(`Plan ${id} not found`);

    const cloned = await this.prisma.continuityPlan.create({
      data: {
        tenantId,
        processId: original.processId,
        name: newName,
        type: original.type,
        content: original.content as any,
        version: '1.0',
        status: PlanStatus.DRAFT,
      },
    });

    this.logger.log(`Plan cloned: ${id} -> ${cloned.id} by ${userId}`);
    return cloned;
  }

  async remove(id: string, tenantId: string) {
    await this.prisma.continuityPlan.deleteMany({ where: { id, tenantId } });
    await this.dgraphService.deleteNode(id);
    this.logger.log(`Plan deleted: ${id}`);
    return { deleted: true };
  }

  async getCoverageAnalysis(tenantId: string) {
    const processes = await this.prisma.businessProcess.findMany({
      where: { tenantId },
      include: { plans: true, biaAssessments: true },
    });

    const analysis = processes.map((proc) => ({
      processId: proc.id,
      processName: proc.name,
      criticality: proc.criticalityLevel,
      hasPlan: proc.plans.length > 0,
      planCount: proc.plans.length,
      hasActivePlan: proc.plans.some((p) => p.status === PlanStatus.ACTIVE),
      rto: proc.biaAssessments[0]?.rto,
      covered: proc.plans.length > 0,
    }));

    const totalProcesses = processes.length;
    const coveredProcesses = analysis.filter((a) => a.covered).length;
    const coverageRate = totalProcesses > 0 ? (coveredProcesses / totalProcesses) * 100 : 0;

    return {
      coverageRate: Math.round(coverageRate * 100) / 100,
      totalProcesses,
      coveredProcesses,
      uncoveredProcesses: totalProcesses - coveredProcesses,
      details: analysis,
    };
  }
}
