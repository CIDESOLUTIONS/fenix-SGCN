import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';
import { CreateBiaAssessmentDto } from './dto/create-bia-assessment.dto';
import { UpdateBiaAssessmentDto } from './dto/update-bia-assessment.dto';

@Injectable()
export class BiaAssessmentsService {
  private readonly logger = new Logger(BiaAssessmentsService.name);

  constructor(
    private prisma: PrismaService,
    private dgraphService: DgraphService,
    private workflowEngine: WorkflowEngineService,
    private analyticsEngine: AnalyticsEngineService,
  ) {}

  /**
   * Crear BIA con sincronización a Dgraph
   */
  async create(createDto: CreateBiaAssessmentDto, tenantId: string, userId: string) {
    // Calcular priority score
    const priorityScore = this.calculatePriorityScore(
      createDto.rto,
      createDto.financialImpact24h,
      createDto.operationalImpact,
    );

    // Crear en PostgreSQL
    const bia = await this.prisma.biaAssessment.create({
      data: {
        ...createDto,
        tenantId,
        priorityScore,
      },
      include: { process: true },
    });

    // Actualizar proceso en Dgraph con RTO/RPO
    await this.dgraphService.upsertNode(
      'BusinessProcess',
      {
        id: bia.processId,
        rto: bia.rto,
        rpo: bia.rpo,
        criticality: bia.process?.criticalityLevel,
      },
      tenantId,
    );

    // Sincronizar dependencias a Dgraph
    if (createDto.dependencyMap && createDto.dependencyMap.dependencies) {
      await this.syncDependenciesToGraph(
        bia.processId,
        createDto.dependencyMap.dependencies,
        tenantId,
      );
    }

    this.logger.log(`BIA created: ${bia.id} for process ${bia.processId} by ${userId}`);
    return bia;
  }

  /**
   * Listar BIAs con análisis de cobertura
   */
  async findAll(tenantId: string) {
    const bias = await this.prisma.biaAssessment.findMany({
      where: { tenantId },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            criticalityLevel: true,
            department: true,
          },
        },
      },
      orderBy: { priorityScore: 'desc' },
    });

    // Calcular cobertura
    const coverage = await this.analyticsEngine.getBiaCoverage(tenantId);

    return {
      assessments: bias,
      coverage,
    };
  }

  /**
   * Obtener BIA con mapa de dependencias
   */
  async findOne(id: string, tenantId: string) {
    const bia = await this.prisma.biaAssessment.findFirst({
      where: { id, tenantId },
      include: {
        process: {
          include: {
            riskAssessments: true,
            plans: true,
          },
        },
      },
    });

    if (!bia) {
      throw new NotFoundException(`BIA ${id} not found`);
    }

    // Obtener mapa de dependencias actualizado desde Dgraph
    const dependencyMap = await this.dgraphService.getDependencies(
      bia.processId,
      tenantId,
      5, // profundidad
    );

    // Análisis de puntos únicos de fallo (SPOF)
    const spofAnalysis = await this.dgraphService.findSinglePointsOfFailure(tenantId);

    return {
      ...bia,
      dependencyMap,
      spofAnalysis: spofAnalysis.filter(
        (spof) => spof.affectsProcesses?.some((p) => p.id === bia.processId),
      ),
    };
  }

  /**
   * Actualizar BIA
   */
  async update(
    id: string,
    tenantId: string,
    updateDto: UpdateBiaAssessmentDto,
    userId: string,
  ) {
    // Recalcular priority score si cambió algún factor
    let priorityScore = undefined;
    if (updateDto.rto || updateDto.financialImpact24h || updateDto.operationalImpact) {
      const current = await this.prisma.biaAssessment.findFirst({
        where: { id, tenantId },
      });
      priorityScore = this.calculatePriorityScore(
        updateDto.rto ?? current?.rto,
        updateDto.financialImpact24h ?? current?.financialImpact24h,
        updateDto.operationalImpact ?? current?.operationalImpact,
      );
    }

    const bia = await this.prisma.biaAssessment.updateMany({
      where: { id, tenantId },
      data: {
        ...updateDto,
        priorityScore,
      },
    });

    // Actualizar en Dgraph si cambió RTO/RPO
    if (updateDto.rto || updateDto.rpo) {
      const current = await this.prisma.biaAssessment.findFirst({
        where: { id, tenantId },
      });
      if (current) {
        await this.dgraphService.upsertNode(
          'BusinessProcess',
          {
            id: current.processId,
            rto: updateDto.rto ?? current.rto,
            rpo: updateDto.rpo ?? current.rpo,
          },
          tenantId,
        );
      }
    }

    // Actualizar dependencias si cambió el mapa
    if (updateDto.dependencyMap && updateDto.dependencyMap.dependencies) {
      const current = await this.prisma.biaAssessment.findFirst({
        where: { id, tenantId },
      });
      if (current) {
        await this.syncDependenciesToGraph(
          current.processId,
          updateDto.dependencyMap.dependencies,
          tenantId,
        );
      }
    }

    this.logger.log(`BIA updated: ${id} by ${userId}`);
    return bia;
  }

  /**
   * Sugerir RTO/RPO basado en IA (benchmarks)
   */
  async suggestRtoRpo(processId: string, tenantId: string) {
    const process = await this.prisma.businessProcess.findFirst({
      where: { id: processId, tenantId },
    });

    if (!process) {
      throw new NotFoundException(`Process ${processId} not found`);
    }

    // Benchmarks basados en criticidad y departamento
    const benchmarks = {
      CRITICAL: {
        IT: { rto: 2, rpo: 1 },
        FINANCE: { rto: 4, rpo: 2 },
        OPERATIONS: { rto: 4, rpo: 4 },
        DEFAULT: { rto: 4, rpo: 2 },
      },
      HIGH: {
        IT: { rto: 4, rpo: 2 },
        FINANCE: { rto: 8, rpo: 4 },
        OPERATIONS: { rto: 8, rpo: 8 },
        DEFAULT: { rto: 8, rpo: 4 },
      },
      MEDIUM: {
        IT: { rto: 24, rpo: 12 },
        FINANCE: { rto: 24, rpo: 12 },
        OPERATIONS: { rto: 48, rpo: 24 },
        DEFAULT: { rto: 24, rpo: 12 },
      },
      LOW: {
        IT: { rto: 72, rpo: 48 },
        FINANCE: { rto: 72, rpo: 48 },
        OPERATIONS: { rto: 168, rpo: 72 },
        DEFAULT: { rto: 72, rpo: 48 },
      },
    };

    const criticality = process.criticalityLevel;
    const dept = process.department?.toUpperCase() || 'DEFAULT';
    
    const suggestion = benchmarks[criticality]?.[dept] || benchmarks[criticality]?.DEFAULT;

    return {
      processId,
      processName: process.name,
      criticality,
      department: process.department,
      suggestion,
      explanation: `Basado en procesos ${criticality} en ${dept}, se recomienda RTO: ${suggestion.rto}h, RPO: ${suggestion.rpo}h`,
    };
  }

  /**
   * Crear campaña de BIA con workflow
   */
  async createCampaign(
    name: string,
    processIds: string[],
    reviewers: string[],
    dueDate: string,
    tenantId: string,
    userId: string,
  ) {
    // Crear workflow para cada proceso
    const workflows = [];

    for (const processId of processIds) {
      const process = await this.prisma.businessProcess.findFirst({
        where: { id: processId, tenantId },
      });

      if (process) {
        const workflow = await this.workflowEngine.startWorkflow({
          name: `BIA: ${process.name}`,
          entityType: 'bia-assessment',
          entityId: processId,
          tenantId,
          steps: [
            {
              id: 'complete_bia',
              type: 'APPROVAL',
              name: 'Completar BIA',
              assignedTo: [process.responsiblePerson || userId],
              dueDate: new Date(dueDate),
              metadata: { processId, campaignName: name },
            },
            {
              id: 'review_bia',
              type: 'APPROVAL',
              name: 'Revisar BIA',
              assignedTo: reviewers,
              dueDate: new Date(
                new Date(dueDate).getTime() + 7 * 24 * 60 * 60 * 1000,
              ), // +7 días
              metadata: { processId, campaignName: name },
            },
          ],
          createdBy: userId,
        });

        workflows.push(workflow);
      }
    }

    this.logger.log(`BIA campaign created: ${name} with ${workflows.length} workflows`);

    return {
      message: 'Campaña de BIA creada',
      campaignName: name,
      processCount: processIds.length,
      workflowsCreated: workflows.length,
      workflows: workflows.map((w) => ({ id: w.id, processId: w.entityId })),
    };
  }

  /**
   * Obtener cobertura del BIA
   */
  async getCoverage(tenantId: string) {
    return await this.analyticsEngine.getBiaCoverage(tenantId);
  }

  /**
   * Eliminar BIA
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.biaAssessment.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`BIA deleted: ${id} by ${userId}`);
    return { message: 'BIA eliminado' };
  }

  /**
   * Sincronizar dependencias al grafo
   */
  private async syncDependenciesToGraph(
    processId: string,
    dependencies: any[],
    tenantId: string,
  ) {
    for (const dep of dependencies) {
      if (dep.type === 'APPLICATION' || dep.type === 'ASSET') {
        // Crear nodo si no existe
        await this.dgraphService.upsertNode(
          'Asset',
          {
            id: dep.id,
            name: dep.name,
            type: dep.type,
            nodeType: 'Asset',
          },
          tenantId,
        );

        // Crear relación
        await this.dgraphService.createRelationship(
          processId,
          dep.id,
          'dependsOn',
          tenantId,
        );
      } else if (dep.type === 'PROCESS') {
        // Relación entre procesos
        await this.dgraphService.createRelationship(
          processId,
          dep.id,
          'dependsOn',
          tenantId,
        );
      }
    }
  }

  /**
   * Calcular priority score
   */
  private calculatePriorityScore(
    rto?: number,
    financialImpact24h?: any,
    operationalImpact?: string,
  ): number {
    let score = 0;

    // Factor RTO (menor RTO = mayor prioridad)
    if (rto) {
      if (rto <= 4) score += 50;
      else if (rto <= 24) score += 30;
      else if (rto <= 72) score += 15;
      else score += 5;
    }

    // Factor financiero
    if (financialImpact24h) {
      const impact = parseFloat(financialImpact24h.toString());
      if (impact >= 100000) score += 30;
      else if (impact >= 50000) score += 20;
      else if (impact >= 10000) score += 10;
      else score += 5;
    }

    // Factor operacional
    if (operationalImpact) {
      const impactUpper = operationalImpact.toUpperCase();
      if (impactUpper.includes('CRITICAL') || impactUpper.includes('SEVERE'))
        score += 20;
      else if (impactUpper.includes('HIGH') || impactUpper.includes('MAJOR'))
        score += 15;
      else if (impactUpper.includes('MEDIUM') || impactUpper.includes('MODERATE'))
        score += 10;
      else score += 5;
    }

    return score;
  }
}
