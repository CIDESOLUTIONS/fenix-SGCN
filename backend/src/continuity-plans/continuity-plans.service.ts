import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { CreateContinuityPlanDto } from './dto/create-continuity-plan.dto';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';

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
    // Crear en PostgreSQL
    const plan = await this.prisma.continuityPlan.create({
      data: {
        ...dto,
        tenantId,
        status: dto.status || 'DRAFT',
      },
      include: { process: true },
    });

    // Sincronizar a Dgraph
    await this.dgraphService.upsertNode(
      'ContinuityPlan',
      {
        id: plan.id,
        name: plan.name,
        status: plan.status,
        nodeType: 'ContinuityPlan',
      },
      tenantId,
    );

    // Si tiene proceso asociado, crear relación
    if (plan.processId) {
      await this.dgraphService.createRelationship(
        plan.id,
        plan.processId,
        'protects',
        tenantId,
      );
    }

    this.logger.log(`Plan created: ${plan.id} by ${userId}`);
    return plan;
  }

  /**
   * Listar planes con análisis de dependencias
   */
  async findAll(tenantId: string) {
    const plans = await this.prisma.continuityPlan.findMany({
      where: { tenantId },
      include: {
        process: {
          include: {
            biaAssessments: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return plans;
  }

  /**
   * Obtener plan con mapa de dependencias
   */
  async findOne(id: string, tenantId: string) {
    const plan = await this.prisma.continuityPlan.findFirst({
      where: { id, tenantId },
      include: {
        process: {
          include: {
            biaAssessments: true,
            riskAssessments: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${id} not found`);
    }

    // Obtener mapa de dependencias desde Dgraph
    let dependencyMap = null;
    if (plan.processId) {
      dependencyMap = await this.dgraphService.getDependencies(
        plan.processId,
        tenantId,
        3,
      );
    }

    return {
      ...plan,
      dependencyMap,
    };
  }

  /**
   * Actualizar plan
   */
  async update(id: string, tenantId: string, dto: UpdateContinuityPlanDto, userId: string) {
    const plan = await this.prisma.continuityPlan.updateMany({
      where: { id, tenantId },
      data: dto,
    });

    // Sincronizar cambios a Dgraph
    if (dto.name || dto.status) {
      await this.dgraphService.upsertNode(
        'ContinuityPlan',
        {
          id,
          name: dto.name,
          status: dto.status,
        },
        tenantId,
      );
    }

    this.logger.log(`Plan updated: ${id} by ${userId}`);
    return plan;
  }

  /**
   * Enviar plan a revisión (workflow)
   */
  async submitForReview(id: string, tenantId: string, approvers: string[], userId: string) {
    // Actualizar estado
    await this.prisma.continuityPlan.updateMany({
      where: { id, tenantId },
      data: { status: 'REVIEW' },
    });

    // Crear workflow de aprobación
    const workflow = await this.workflowEngine.createApprovalWorkflow(
      'continuity-plan',
      id,
      approvers,
      tenantId,
      userId,
    );

    this.logger.log(`Plan ${id} submitted for review - Workflow: ${workflow.id}`);
    
    return {
      message: 'Plan enviado a revisión',
      workflowId: workflow.id,
      approvers,
    };
  }

  /**
   * Aprobar plan
   */
  async approvePlan(id: string, tenantId: string, userId: string, comments?: string) {
    const plan = await this.prisma.continuityPlan.updateMany({
      where: { id, tenantId },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    // Notificar al creador
    await this.workflowEngine.sendNotification(
      [userId], // En producción, obtener email del creador
      'Plan de Continuidad Aprobado',
      `El plan ${id} ha sido aprobado. ${comments || ''}`,
      tenantId,
    );

    this.logger.log(`Plan ${id} approved by ${userId}`);
    return plan;
  }

  /**
   * Activar plan durante un incidente
   */
  async activatePlan(id: string, tenantId: string, userId: string, reason: string) {
    const plan = await this.prisma.continuityPlan.findFirst({
      where: { id, tenantId },
      include: { process: true },
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${id} not found`);
    }

    if (plan.status !== 'APPROVED' && plan.status !== 'ACTIVE') {
      throw new Error('Solo se pueden activar planes aprobados');
    }

    // Actualizar estado
    await this.prisma.continuityPlan.updateMany({
      where: { id, tenantId },
      data: {
        status: 'ACTIVE',
        lastActivated: new Date(),
        executionLog: {
          activatedAt: new Date(),
          activatedBy: userId,
          reason,
        },
      },
    });

    // Notificar a participantes
    const participants = (plan.content as any)?.participants || [];
    if (participants.length > 0) {
      await this.workflowEngine.sendNotification(
        participants,
        `PLAN ACTIVADO: ${plan.name}`,
        `El plan de continuidad ha sido activado. Razón: ${reason}. Consulte las instrucciones en el sistema.`,
        tenantId,
      );
    }

    this.logger.warn(`Plan ${id} ACTIVATED by ${userId} - Reason: ${reason}`);
    
    return {
      message: 'Plan activado exitosamente',
      plan,
      notifiedParticipants: participants.length,
    };
  }

  /**
   * Obtener análisis de impacto del plan
   */
  async getImpactAnalysis(id: string, tenantId: string) {
    const plan = await this.prisma.continuityPlan.findFirst({
      where: { id, tenantId },
      include: { process: true },
    });

    if (!plan || !plan.processId) {
      return { message: 'No hay análisis disponible' };
    }

    // Análisis de impacto desde Dgraph
    const impactAnalysis = await this.dgraphService.getImpactAnalysis(
      plan.processId,
      tenantId,
      5,
    );

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        process: plan.process?.name,
      },
      impactAnalysis,
      summary: {
        totalAffectedNodes: this.countImpactedNodes(impactAnalysis),
        criticalProcessesAffected: this.countCriticalNodes(impactAnalysis),
      },
    };
  }

  private countImpactedNodes(data: any): number {
    if (!data || !data.node || data.node.length === 0) return 0;
    
    let count = 0;
    const traverse = (node: any) => {
      count++;
      if (node.requiredBy) {
        node.requiredBy.forEach(traverse);
      }
    };
    
    data.node.forEach(traverse);
    return count;
  }

  private countCriticalNodes(data: any): number {
    if (!data || !data.node || data.node.length === 0) return 0;
    
    let count = 0;
    const traverse = (node: any) => {
      if (node.criticality === 'CRITICAL') count++;
      if (node.requiredBy) {
        node.requiredBy.forEach(traverse);
      }
    };
    
    data.node.forEach(traverse);
    return count;
  }

  /**
   * Eliminar plan
   */
  async remove(id: string, tenantId: string, userId: string) {
    // Eliminar de PostgreSQL
    await this.prisma.continuityPlan.deleteMany({
      where: { id, tenantId },
    });

    // Eliminar de Dgraph
    await this.dgraphService.deleteNode(id);

    this.logger.log(`Plan deleted: ${id} by ${userId}`);
    return { message: 'Plan eliminado exitosamente' };
  }

  /**
   * Clonar plan
   */
  async clonePlan(id: string, tenantId: string, newName: string, userId: string) {
    const originalPlan = await this.prisma.continuityPlan.findFirst({
      where: { id, tenantId },
    });

    if (!originalPlan) {
      throw new NotFoundException(`Plan ${id} not found`);
    }

    const clonedPlan = await this.prisma.continuityPlan.create({
      data: {
        tenantId,
        processId: originalPlan.processId,
        name: newName,
        type: originalPlan.type,
        content: originalPlan.content,
        version: '1.0',
        status: 'DRAFT',
      },
    });

    this.logger.log(`Plan cloned: ${id} -> ${clonedPlan.id} by ${userId}`);
    return clonedPlan;
  }
}
