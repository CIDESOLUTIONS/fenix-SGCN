import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';

@Injectable()
export class ContinuityStrategiesService {
  private readonly logger = new Logger(ContinuityStrategiesService.name);

  constructor(
    private prisma: PrismaService,
    private dgraphService: DgraphService,
    private workflowEngine: WorkflowEngineService,
    private analyticsEngine: AnalyticsEngineService,
  ) {}

  /**
   * Crear estrategia de continuidad
   */
  async create(dto: any, tenantId: string, userId: string) {
    // Calcular cost-effectiveness score
    const costEffectivenessScore = this.calculateCostEffectiveness(
      dto.cost,
      dto.effectiveness,
      dto.implementationTime,
    );

    const strategy = await this.prisma.continuityStrategy.create({
      data: {
        ...dto,
        tenantId,
        costEffectivenessScore,
      },
      include: { process: true },
    });

    this.logger.log(`Strategy created: ${strategy.id} for process ${strategy.processId} by ${userId}`);
    return strategy;
  }

  /**
   * Listar estrategias
   */
  async findAll(tenantId: string) {
    return await this.prisma.continuityStrategy.findMany({
      where: { tenantId },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            criticalityLevel: true,
            rto: true,
            rpo: true,
          },
        },
      },
      orderBy: { costEffectivenessScore: 'desc' },
    });
  }

  /**
   * Obtener estrategia por ID
   */
  async findOne(id: string, tenantId: string) {
    const strategy = await this.prisma.continuityStrategy.findFirst({
      where: { id, tenantId },
      include: {
        process: {
          include: {
            biaAssessments: true,
          },
        },
      },
    });

    if (!strategy) {
      throw new NotFoundException(`Strategy ${id} not found`);
    }

    return strategy;
  }

  /**
   * Actualizar estrategia
   */
  async update(id: string, tenantId: string, dto: any, userId: string) {
    // Recalcular score si cambió algún factor
    let costEffectivenessScore = undefined;
    if (dto.cost !== undefined || dto.effectiveness !== undefined || dto.implementationTime !== undefined) {
      const current = await this.prisma.continuityStrategy.findFirst({
        where: { id, tenantId },
      });
      costEffectivenessScore = this.calculateCostEffectiveness(
        dto.cost ?? current?.cost,
        dto.effectiveness ?? current?.effectiveness,
        dto.implementationTime ?? current?.implementationTime,
      );
    }

    const strategy = await this.prisma.continuityStrategy.updateMany({
      where: { id, tenantId },
      data: {
        ...dto,
        costEffectivenessScore,
      },
    });

    this.logger.log(`Strategy updated: ${id} by ${userId}`);
    return strategy;
  }

  /**
   * Recomendar estrategias basadas en RTO y dependencias
   */
  async recommendStrategies(processId: string, tenantId: string) {
    // Obtener proceso con BIA
    const process = await this.prisma.businessProcess.findFirst({
      where: { id: processId, tenantId },
      include: {
        biaAssessments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!process) {
      throw new NotFoundException(`Process ${processId} not found`);
    }

    const bia = process.biaAssessments[0];
    const rto = bia?.rto || process.rto || 24;

    // Obtener dependencias desde Dgraph
    const dependencies = await this.dgraphService.getDependencies(
      processId,
      tenantId,
      3,
    );

    // Generar recomendaciones
    const recommendations = [];

    // Estrategia 1: Redundancia
    if (rto <= 4) {
      recommendations.push({
        type: 'REDUNDANCY',
        name: 'Redundancia de Sistemas Críticos',
        description: 'Implementar sistemas redundantes para RTO <= 4h',
        estimatedCost: 50000,
        implementationTime: 60,
        effectiveness: 5,
        priority: 'HIGH',
        rationale: `RTO de ${rto}h requiere redundancia inmediata`,
      });
    }

    // Estrategia 2: Sitio Alterno
    if (rto <= 24 && process.criticalityLevel === 'CRITICAL') {
      recommendations.push({
        type: 'RECOVERY',
        name: 'Sitio de Recuperación Alterno',
        description: 'Establecer sitio de trabajo alterno',
        estimatedCost: 30000,
        implementationTime: 90,
        effectiveness: 4,
        priority: 'HIGH',
        rationale: 'Proceso crítico requiere capacidad de recuperación rápida',
      });
    }

    // Estrategia 3: Backup y Restore
    recommendations.push({
      type: 'RECOVERY',
      name: 'Solución de Backup Avanzada',
      description: 'Implementar backup incremental con restore rápido',
      estimatedCost: 15000,
      implementationTime: 30,
      effectiveness: 4,
      priority: rto <= 8 ? 'HIGH' : 'MEDIUM',
      rationale: 'Protección de datos esencial para cualquier RTO',
    });

    // Estrategia 4: Proveedor Secundario
    if (dependencies?.node?.[0]?.dependsOn?.length > 0) {
      const hasExternalDeps = dependencies.node[0].dependsOn.some(
        (dep) => dep.nodeType === 'Asset' && dep.type === 'SUPPLIER'
      );
      
      if (hasExternalDeps) {
        recommendations.push({
          type: 'MITIGATION',
          name: 'Proveedor Secundario',
          description: 'Contratar proveedor alternativo para servicios críticos',
          estimatedCost: 20000,
          implementationTime: 45,
          effectiveness: 4,
          priority: 'MEDIUM',
          rationale: 'Dependencias de proveedores externos identificadas',
        });
      }
    }

    // Estrategia 5: Procedimientos Manuales
    if (rto >= 24) {
      recommendations.push({
        type: 'MITIGATION',
        name: 'Procedimientos Manuales Temporales',
        description: 'Desarrollar procedimientos manuales para operación temporal',
        estimatedCost: 5000,
        implementationTime: 15,
        effectiveness: 3,
        priority: 'LOW',
        rationale: `RTO de ${rto}h permite procedimientos manuales temporales`,
      });
    }

    return {
      processId,
      processName: process.name,
      rto,
      criticality: process.criticalityLevel,
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
    };
  }

  /**
   * Análisis de brechas de recursos
   */
  async analyzeResourceGaps(strategyId: string, tenantId: string) {
    const strategy = await this.prisma.continuityStrategy.findFirst({
      where: { id: strategyId, tenantId },
      include: {
        process: true,
      },
    });

    if (!strategy) {
      throw new NotFoundException(`Strategy ${strategyId} not found`);
    }

    // Simular análisis de brechas (en producción, esto vendría de un inventario real)
    const gaps = [];

    if (strategy.type === 'REDUNDANCY') {
      gaps.push({
        category: 'INFRASTRUCTURE',
        item: 'Servidores de Respaldo',
        required: 3,
        available: 1,
        gap: 2,
        estimatedCost: 15000,
        priority: 'HIGH',
      });
      gaps.push({
        category: 'NETWORK',
        item: 'Conexión de Red Redundante',
        required: 1,
        available: 0,
        gap: 1,
        estimatedCost: 8000,
        priority: 'HIGH',
      });
    }

    if (strategy.type === 'RECOVERY') {
      gaps.push({
        category: 'FACILITY',
        item: 'Espacio en Sitio Alterno',
        required: '200 m²',
        available: '0 m²',
        gap: '200 m²',
        estimatedCost: 25000,
        priority: 'HIGH',
      });
      gaps.push({
        category: 'PERSONNEL',
        item: 'Personal Capacitado en Recuperación',
        required: 5,
        available: 2,
        gap: 3,
        estimatedCost: 10000,
        priority: 'MEDIUM',
      });
    }

    const totalGapCost = gaps.reduce((sum, gap) => sum + gap.estimatedCost, 0);

    return {
      strategyId,
      strategyName: strategy.scenario,
      processName: strategy.process?.name,
      gaps,
      summary: {
        totalGaps: gaps.length,
        totalEstimatedCost: totalGapCost,
        highPriorityGaps: gaps.filter((g) => g.priority === 'HIGH').length,
      },
    };
  }

  /**
   * Validar estrategia contra RTO
   */
  async validateStrategy(strategyId: string, tenantId: string) {
    const strategy = await this.prisma.continuityStrategy.findFirst({
      where: { id: strategyId, tenantId },
      include: {
        process: {
          include: {
            biaAssessments: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!strategy) {
      throw new NotFoundException(`Strategy ${strategyId} not found`);
    }

    const bia = strategy.process?.biaAssessments[0];
    const requiredRto = bia?.rto || strategy.process?.rto || 24;
    const strategyImplementationTime = strategy.implementationTime || 0;

    // Validaciones
    const validations = [];

    // 1. Tiempo de implementación vs RTO
    if (strategyImplementationTime > requiredRto) {
      validations.push({
        type: 'ERROR',
        message: `Estrategia tarda ${strategyImplementationTime}h en implementarse, pero RTO es ${requiredRto}h`,
        recommendation: 'Seleccionar estrategia más rápida o ajustar RTO',
      });
    } else {
      validations.push({
        type: 'SUCCESS',
        message: `Tiempo de implementación (${strategyImplementationTime}h) cumple con RTO (${requiredRto}h)`,
      });
    }

    // 2. Efectividad vs Criticidad
    if (strategy.process?.criticalityLevel === 'CRITICAL' && strategy.effectiveness < 4) {
      validations.push({
        type: 'WARNING',
        message: 'Proceso crítico requiere estrategia de mayor efectividad (≥4)',
        recommendation: 'Considerar estrategia de redundancia completa',
      });
    }

    // 3. Costo vs Impacto
    const financialImpact = bia?.financialImpact24h || 0;
    const strategyCost = strategy.cost || 0;
    if (strategyCost > financialImpact) {
      validations.push({
        type: 'WARNING',
        message: `Costo de estrategia ($${strategyCost}) excede impacto 24h ($${financialImpact})`,
        recommendation: 'Revisar justificación costo-beneficio',
      });
    }

    const isValid = !validations.some((v) => v.type === 'ERROR');

    return {
      strategyId,
      strategyName: strategy.scenario,
      processName: strategy.process?.name,
      requiredRto,
      isValid,
      validations,
      summary: {
        errors: validations.filter((v) => v.type === 'ERROR').length,
        warnings: validations.filter((v) => v.type === 'WARNING').length,
        successes: validations.filter((v) => v.type === 'SUCCESS').length,
      },
    };
  }

  /**
   * Comparar estrategias para un proceso
   */
  async compareStrategies(processId: string, strategyIds: string[], tenantId: string) {
    const strategies = await this.prisma.continuityStrategy.findMany({
      where: {
        id: { in: strategyIds },
        processId,
        tenantId,
      },
    });

    if (strategies.length === 0) {
      throw new NotFoundException('No strategies found for comparison');
    }

    const comparison = strategies.map((strategy) => ({
      id: strategy.id,
      name: strategy.scenario,
      type: strategy.type,
      cost: strategy.cost,
      implementationTime: strategy.implementationTime,
      effectiveness: strategy.effectiveness,
      costEffectivenessScore: strategy.costEffectivenessScore,
    }));

    // Identificar mejor opción por criterio
    const best = {
      leastExpensive: comparison.reduce((prev, curr) =>
        (curr.cost || 0) < (prev.cost || 0) ? curr : prev
      ),
      fastestImplementation: comparison.reduce((prev, curr) =>
        (curr.implementationTime || Infinity) < (prev.implementationTime || Infinity) ? curr : prev
      ),
      mostEffective: comparison.reduce((prev, curr) =>
        (curr.effectiveness || 0) > (prev.effectiveness || 0) ? curr : prev
      ),
      bestValue: comparison.reduce((prev, curr) =>
        (curr.costEffectivenessScore || 0) > (prev.costEffectivenessScore || 0) ? curr : prev
      ),
    };

    return {
      processId,
      strategies: comparison,
      bestOptions: best,
      recommendation: best.bestValue.id,
    };
  }

  /**
   * Enviar estrategia a aprobación
   */
  async submitForApproval(strategyId: string, tenantId: string, approvers: string[], userId: string) {
    const strategy = await this.prisma.continuityStrategy.findFirst({
      where: { id: strategyId, tenantId },
      include: { process: true },
    });

    if (!strategy) {
      throw new NotFoundException(`Strategy ${strategyId} not found`);
    }

    // Crear workflow de aprobación
    const workflow = await this.workflowEngine.createApprovalWorkflow(
      'continuity-strategy',
      strategyId,
      approvers,
      tenantId,
      userId,
    );

    this.logger.log(`Strategy ${strategyId} submitted for approval - Workflow: ${workflow.id}`);

    return {
      message: 'Estrategia enviada a aprobación',
      workflowId: workflow.id,
      strategyName: strategy.scenario,
      approvers,
    };
  }

  /**
   * Eliminar estrategia
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.continuityStrategy.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`Strategy deleted: ${id} by ${userId}`);
    return { message: 'Estrategia eliminada' };
  }

  /**
   * Calcular cost-effectiveness score
   */
  private calculateCostEffectiveness(
    cost?: number,
    effectiveness?: number,
    implementationTime?: number,
  ): number {
    if (!cost || !effectiveness || !implementationTime) return 0;

    // Score = (Efectividad / Costo) * Factor de Tiempo
    const costFactor = 100000 / cost; // Normalizar costo
    const timeFactor = implementationTime <= 30 ? 1.2 : implementationTime <= 60 ? 1.0 : 0.8;
    
    return (effectiveness * costFactor * timeFactor * 10);
  }
}
