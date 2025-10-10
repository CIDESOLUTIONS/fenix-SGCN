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
      select: {
        id: true,
        riskId: true,
        name: true,
        category: true,
        cause: true,           // AGREGADO
        event: true,           // AGREGADO
        consequence: true,     // AGREGADO
        probabilityBefore: true,
        impactBefore: true,
        scoreBefore: true,
        probabilityAfter: true,
        impactAfter: true,
        scoreAfter: true,
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

  /**
   * Análisis de Puntos Únicos de Fallo (SPOF)
   */
  async analyzeSPOF(tenantId: string) {
    this.logger.log(`Analyzing SPOF for tenant: ${tenantId}`);

    // Obtener análisis de Dgraph
    const spofAnalysis = await this.dgraphService.analyzeSPOF(tenantId);

    // Obtener riesgos relacionados con activos críticos
    const risks = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      include: { process: true },
    });

    // Correlacionar riesgos con SPOF
    const spofWithRisks = spofAnalysis.criticalAssets.map((asset: any) => {
      const relatedRisks = risks.filter(r => 
        r.process && asset.requiredBy?.some((dep: any) => dep.name?.includes(r.process!.name))
      );

      return {
        ...asset,
        riskCount: relatedRisks.length,
        highestRisk: relatedRisks.length > 0 
          ? Math.max(...relatedRisks.map(r => Number(r.scoreBefore)))
          : 0,
        relatedRisks: relatedRisks.map(r => ({
          id: r.id,
          riskId: r.riskId,
          name: r.name,
          score: Number(r.scoreBefore),
        })),
      };
    });

    // Ordenar por criticidad
    spofWithRisks.sort((a, b) => (b.highestRisk || 0) - (a.highestRisk || 0));

    return {
      summary: {
        totalSPOFs: spofWithRisks.length,
        criticalSPOFs: spofWithRisks.filter(s => s.highestRisk >= 15).length,
        highRiskSPOFs: spofWithRisks.filter(s => s.highestRisk >= 9 && s.highestRisk < 15).length,
        spofRiskLevel: spofAnalysis.spofRisk,
      },
      criticalAssets: spofWithRisks,
      recommendations: this.generateSPOFRecommendations(spofWithRisks),
    };
  }

  /**
   * Calcular cascada de impacto de un riesgo
   */
  async calculateImpactCascade(riskId: string, tenantId: string) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
      include: { process: true },
    });

    if (!risk) {
      throw new NotFoundException('Riesgo no encontrado');
    }

    // Si el riesgo está vinculado a un proceso, analizar su impacto
    if (risk.process) {
      const impact = await this.dgraphService.getDownstreamDependencies(
        risk.process.id,
        tenantId,
      );

      const affectedProcesses = impact.impactedProcesses || [];

      return {
        risk: {
          id: risk.id,
          riskId: risk.riskId,
          name: risk.name,
          score: risk.scoreBefore,
        },
        sourceProcess: {
          id: risk.process.id,
          name: risk.process.name,
        },
        cascade: {
          totalAffected: affectedProcesses.length,
          criticalProcesses: affectedProcesses.filter(p => p.criticality === 'CRITICAL').length,
          affectedProcesses: affectedProcesses.map(p => ({
            id: p.id,
            name: p.name,
            criticality: p.criticality,
            nodeType: p.nodeType,
          })),
        },
        impactLevel: this.calculateCascadeImpactLevel(affectedProcesses),
      };
    }

    return {
      risk: {
        id: risk.id,
        riskId: risk.riskId,
        name: risk.name,
        score: risk.scoreBefore,
      },
      cascade: {
        totalAffected: 0,
        criticalProcesses: 0,
        affectedProcesses: [],
      },
      impactLevel: 'LOW',
      message: 'Riesgo no vinculado a proceso. No se puede calcular cascada.',
    };
  }

  /**
   * Generar recomendaciones para mitigar SPOF
   */
  private generateSPOFRecommendations(spofs: any[]): string[] {
    const recommendations: string[] = [];

    const criticalSPOFs = spofs.filter(s => s.highestRisk >= 15);
    if (criticalSPOFs.length > 0) {
      recommendations.push(
        `CRÍTICO: ${criticalSPOFs.length} activos críticos identificados como SPOF con riesgo alto. Priorizar redundancia inmediata.`
      );
    }

    const highDependency = spofs.filter(s => s.requiredByCount >= 5);
    if (highDependency.length > 0) {
      recommendations.push(
        `${highDependency.length} activos con alta dependencia (5+ procesos). Implementar controles de disponibilidad.`
      );
    }

    if (spofs.length > 10) {
      recommendations.push(
        'Arquitectura con múltiples SPOF detectada. Revisar diseño de procesos para distribuir dependencias.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('No se detectaron SPOF críticos. Mantener monitoreo continuo.');
    }

    return recommendations;
  }

  /**
   * Calcular nivel de impacto de cascada
   */
  private calculateCascadeImpactLevel(affectedProcesses: any[]): string {
    const criticalCount = affectedProcesses.filter(p => p.criticality === 'CRITICAL').length;
    const totalCount = affectedProcesses.length;

    if (criticalCount >= 3 || totalCount >= 10) return 'CRITICAL';
    if (criticalCount >= 1 || totalCount >= 5) return 'HIGH';
    if (totalCount >= 2) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Solicitar aprobación de riesgo crítico
   */
  async requestApproval(riskId: string, tenantId: string, requestedBy: string) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
    });

    if (!risk) {
      throw new NotFoundException('Riesgo no encontrado');
    }

    // Crear workflow de aprobación
    const workflow = await this.workflowEngine.createWorkflow({
      name: `Aprobación Riesgo: ${risk.riskId}`,
      entityType: 'RISK_ASSESSMENT',
      entityId: riskId,
      steps: [
        {
          id: 'review',
          name: 'Revisión Técnica',
          type: WorkflowTaskType.REVIEW,
          assignedTo: null, // Asignar al revisor técnico
          status: 'PENDING',
        },
        {
          id: 'approval',
          name: 'Aprobación Gerencial',
          type: WorkflowTaskType.APPROVAL,
          assignedTo: null, // Asignar al gerente
          status: 'PENDING',
        },
      ],
    }, tenantId);

    // Actualizar estado del riesgo
    await this.prisma.riskAssessment.update({
      where: { id: riskId },
      data: {
        // TODO: Agregar campo status al schema
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Approval requested for risk ${riskId} by ${requestedBy}`);

    return {
      message: 'Solicitud de aprobación creada',
      workflow,
      risk: {
        id: risk.id,
        riskId: risk.riskId,
        name: risk.name,
      },
    };
  }

  /**
   * Aprobar o rechazar riesgo
   */
  async approveOrReject(
    riskId: string,
    tenantId: string,
    action: 'APPROVE' | 'REJECT',
    comments: string,
    userId: string,
  ) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
    });

    if (!risk) {
      throw new NotFoundException('Riesgo no encontrado');
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await this.prisma.riskAssessment.update({
      where: { id: riskId },
      data: {
        // TODO: Agregar campo status al schema
        updatedAt: new Date(),
      },
    });

    // TODO: Implementar logEvent cuando esté disponible
    this.logger.log(`Risk ${riskId} ${action.toLowerCase()}ed by ${userId}`);

    return {
      message: `Riesgo ${action === 'APPROVE' ? 'aprobado' : 'rechazado'}`,
      risk: {
        id: risk.id,
        riskId: risk.riskId,
        name: risk.name,
      },
    };
  }

  /**
   * Vinculación con procesos BIA
   */
  async linkToProcess(riskId: string, processId: string, tenantId: string, userId: string) {
    const risk = await this.prisma.riskAssessment.findFirst({
      where: { id: riskId, tenantId },
    });

    if (!risk) {
      throw new NotFoundException('Riesgo no encontrado');
    }

    const process = await this.prisma.businessProcess.findFirst({
      where: { id: processId, tenantId },
    });

    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }

    // Actualizar en PostgreSQL
    await this.prisma.riskAssessment.update({
      where: { id: riskId },
      data: {
        processId,
      },
    });

    // Crear relación en Dgraph
    await this.dgraphService.createRelationship(
      riskId,
      processId,
      'affects',
      tenantId,
    );

    this.logger.log(`Risk ${riskId} linked to process ${processId} by ${userId}`);

    return {
      message: 'Riesgo vinculado al proceso exitosamente',
      risk: {
        id: risk.id,
        riskId: risk.riskId,
        name: risk.name,
      },
      process: {
        id: process.id,
        name: process.name,
      },
    };
  }

  /**
   * Obtener riesgos por proceso
   */
  async getRisksByProcess(processId: string, tenantId: string) {
    const risks = await this.prisma.riskAssessment.findMany({
      where: {
        processId,
        tenantId,
      },
      orderBy: { scoreBefore: 'desc' },
    });

    return {
      processId,
      totalRisks: risks.length,
      criticalRisks: risks.filter(r => Number(r.scoreBefore) >= 15).length,
      highRisks: risks.filter(r => Number(r.scoreBefore) >= 9 && Number(r.scoreBefore) < 15).length,
      risks,
    };
  }
}
