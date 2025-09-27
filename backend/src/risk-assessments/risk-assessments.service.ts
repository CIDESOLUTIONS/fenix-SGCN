import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService, WorkflowTaskType } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';

@Injectable()
export class RiskAssessmentsService {
  private readonly logger = new Logger(RiskAssessmentsService.name);

  constructor(
    private prisma: PrismaService,
    private dgraphService: DgraphService,
    private workflowEngine: WorkflowEngineService,
    private analyticsEngine: AnalyticsEngineService,
  ) {}

  /**
   * Crear evaluación de riesgo con sincronización a Dgraph
   */
  async create(dto: any, tenantId: string, userId: string) {
    // Calcular score inherente
    const scoreBefore = this.calculateRiskScore(
      dto.probabilityBefore,
      dto.impactBefore,
      dto.category,
    );

    // Crear en PostgreSQL
    const risk = await this.prisma.riskAssessment.create({
      data: {
        ...dto,
        tenantId,
        scoreBefore,
        scoreAfter: dto.probabilityAfter && dto.impactAfter 
          ? this.calculateRiskScore(dto.probabilityAfter, dto.impactAfter, dto.category)
          : null,
      },
      include: { process: true },
    });

    // Sincronizar a Dgraph
    await this.dgraphService.upsertNode(
      'Risk',
      {
        id: risk.id,
        name: risk.name,
        impact: this.getImpactLevel(dto.impactBefore),
        likelihood: this.getLikelihoodLevel(dto.probabilityBefore),
        category: risk.category,
        nodeType: 'Risk',
      },
      tenantId,
    );

    // Crear relación con proceso si existe
    if (risk.processId) {
      await this.dgraphService.createRelationship(
        risk.id,
        risk.processId,
        'affects',
        tenantId,
      );
    }

    this.logger.log(`Risk assessment created: ${risk.id} by ${userId}`);
    return risk;
  }

  /**
   * Listar evaluaciones de riesgo
   */
  async findAll(tenantId: string) {
    return await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            criticalityLevel: true,
          },
        },
      },
      orderBy: { scoreBefore: 'desc' },
    });
  }

  /**
   * Obtener riesgo con análisis de impacto
   */
  async findOne(id: string, tenantId: string) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id, tenantId },
      include: {
        process: {
          include: {
            biaAssessments: true,
          },
        },
      },
    });

    if (!risk) {
      throw new NotFoundException(`Risk ${id} not found`);
    }

    // Obtener qué procesos afecta este riesgo (desde Dgraph)
    const affectedProcesses = await this.dgraphService.getImpactAnalysis(
      id,
      tenantId,
      3,
    );

    return {
      ...risk,
      affectedProcesses,
    };
  }

  /**
   * Actualizar evaluación de riesgo
   */
  async update(id: string, tenantId: string, dto: any, userId: string) {
    const scoreAfter = dto.probabilityAfter && dto.impactAfter
      ? this.calculateRiskScore(dto.probabilityAfter, dto.impactAfter, dto.category)
      : undefined;

    const risk = await this.prisma.riskAssessment.updateMany({
      where: { id, tenantId },
      data: {
        ...dto,
        scoreAfter,
      },
    });

    // Actualizar en Dgraph
    if (dto.impactBefore || dto.probabilityBefore) {
      await this.dgraphService.upsertNode(
        'Risk',
        {
          id,
          name: dto.name,
          impact: dto.impactBefore ? this.getImpactLevel(dto.impactBefore) : undefined,
          likelihood: dto.probabilityBefore ? this.getLikelihoodLevel(dto.probabilityBefore) : undefined,
        },
        tenantId,
      );
    }

    this.logger.log(`Risk updated: ${id} by ${userId}`);
    return risk;
  }

  /**
   * Vincular riesgo a proceso adicional
   */
  async linkToProcess(riskId: string, processId: string, tenantId: string) {
    await this.dgraphService.createRelationship(
      riskId,
      processId,
      'affects',
      tenantId,
    );

    this.logger.log(`Risk ${riskId} linked to process ${processId}`);
    return { message: 'Riesgo vinculado al proceso' };
  }

  /**
   * Ejecutar simulación Montecarlo para un riesgo
   */
  async runMonteCarloSimulation(
    riskId: string,
    tenantId: string,
    params: {
      impactMin: number;
      impactMost: number;
      impactMax: number;
      probabilityMin: number;
      probabilityMax: number;
      iterations?: number;
    },
  ) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
    });

    if (!risk) {
      throw new NotFoundException(`Risk ${riskId} not found`);
    }

    // Ejecutar simulación
    const simulation = await this.analyticsEngine.runMonteCarloSimulation(
      riskId,
      params.iterations || 10000,
      params,
    );

    this.logger.log(`Monte Carlo simulation completed for risk ${riskId}`);
    return {
      risk: {
        id: risk.id,
        name: risk.name,
        category: risk.category,
      },
      simulation,
    };
  }

  /**
   * Obtener mapa de calor de riesgos
   */
  async getRiskHeatmap(tenantId: string) {
    const risks = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            criticalityLevel: true,
          },
        },
      },
    });

    // Agrupar por impacto y probabilidad
    const heatmap = {
      HIGH_HIGH: [],
      HIGH_MEDIUM: [],
      HIGH_LOW: [],
      MEDIUM_HIGH: [],
      MEDIUM_MEDIUM: [],
      MEDIUM_LOW: [],
      LOW_HIGH: [],
      LOW_MEDIUM: [],
      LOW_LOW: [],
    };

    risks.forEach(risk => {
      const impact = this.getImpactLevel(risk.impactBefore);
      const likelihood = this.getLikelihoodLevel(risk.probabilityBefore);
      const key = `${impact}_${likelihood}`;
      
      if (heatmap[key]) {
        heatmap[key].push({
          id: risk.id,
          name: risk.name,
          processName: risk.process?.name,
          category: risk.category,
          score: parseFloat(risk.scoreBefore.toString()),
        });
      }
    });

    return heatmap;
  }

  /**
   * Crear plan de tratamiento de riesgo (workflow)
   */
  async createTreatmentPlan(
    riskId: string,
    tenantId: string,
    treatment: {
      strategy: 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';
      actions: Array<{
        description: string;
        assignee: string;
        dueDate: string;
      }>;
      owner: string;
    },
    userId: string,
  ) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
    });

    if (!risk) {
      throw new NotFoundException(`Risk ${riskId} not found`);
    }

    // Crear workflow para acciones de mitigación
    if (treatment.strategy === 'MITIGATE' && treatment.actions.length > 0) {
      const steps = treatment.actions.map((action, index) => ({
        id: `action_${index}`,
        type: WorkflowTaskType.TASK,
        name: action.description,
        assignedTo: [action.assignee],
        dueDate: new Date(action.dueDate),
        metadata: {
          riskId,
          actionIndex: index,
        },
      }));

      const workflow = await this.workflowEngine.startWorkflow({
        name: `Tratamiento de Riesgo: ${risk.name}`,
        entityType: 'risk-treatment',
        entityId: riskId,
        tenantId,
        steps,
        createdBy: userId,
      });

      this.logger.log(`Treatment plan workflow created: ${workflow.id} for risk ${riskId}`);
      
      return {
        message: 'Plan de tratamiento creado',
        workflowId: workflow.id,
        strategy: treatment.strategy,
        actions: treatment.actions.length,
      };
    }

    return {
      message: 'Plan de tratamiento registrado',
      strategy: treatment.strategy,
    };
  }

  /**
   * Obtener riesgos críticos (análisis de grafo)
   */
  async getCriticalRisks(tenantId: string) {
    // Obtener riesgos de alto impacto desde Dgraph
    const query = `
      query criticalRisks($tenantId: string) {
        risks(func: type(Risk)) @filter(eq(tenantId, $tenantId) AND eq(impact, "HIGH")) {
          id
          name
          impact
          likelihood
          category
          affects {
            id
            name
            criticality
          }
        }
      }
    `;

    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    return {
      count: result.risks?.length || 0,
      risks: result.risks || [],
      recommendation: 'Priorizar tratamiento de riesgos que afectan procesos críticos',
    };
  }

  /**
   * Eliminar evaluación de riesgo
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.riskAssessment.deleteMany({
      where: { id, tenantId },
    });

    await this.dgraphService.deleteNode(id);

    this.logger.log(`Risk deleted: ${id} by ${userId}`);
    return { message: 'Riesgo eliminado' };
  }

  /**
   * Calcular puntuación de riesgo con ponderación
   */
  private calculateRiskScore(
    probability: number,
    impact: number,
    category?: string,
  ): number {
    // Ponderación base
    let baseScore = probability * impact;

    // Ponderación adicional por categoría
    const categoryWeights = {
      OPERATIONAL: 1.2,
      TECHNOLOGICAL: 1.3,
      NATURAL: 1.1,
      HUMAN: 1.0,
      EXTERNAL: 1.15,
    };

    const weight = category ? categoryWeights[category] || 1.0 : 1.0;
    
    return baseScore * weight;
  }

  /**
   * Convertir valor numérico a nivel de impacto
   */
  private getImpactLevel(value: number): string {
    if (value >= 4) return 'HIGH';
    if (value >= 2) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Convertir valor numérico a nivel de probabilidad
   */
  private getLikelihoodLevel(value: number): string {
    if (value >= 4) return 'HIGH';
    if (value >= 2) return 'MEDIUM';
    return 'LOW';
  }
}
