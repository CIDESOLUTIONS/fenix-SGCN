import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService, WorkflowTaskType } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';
import { ReportGeneratorService } from '../report-generator/report-generator.service';
import { ActionStatus } from '@prisma/client';

@Injectable()
export class ContinuousImprovementService {
  private readonly logger = new Logger(ContinuousImprovementService.name);

  constructor(
    private prisma: PrismaService,
    private workflowEngine: WorkflowEngineService,
    private analyticsEngine: AnalyticsEngineService,
    private reportGenerator: ReportGeneratorService,
  ) {}

  /**
   * Crear hallazgo/finding
   */
  async createFinding(dto: any, tenantId: string, userId: string) {
    const finding = await this.prisma.finding.create({
      data: {
        ...dto,
        tenantId,
        status: 'OPEN',
        identifiedBy: userId,
      },
    });

    this.logger.log(`Finding created: ${finding.id} - ${finding.title} by ${userId}`);
    return finding;
  }

  /**
   * Listar hallazgos con filtros
   */
  async findAll(tenantId: string, filters?: any) {
    const where: any = { tenantId };

    if (filters?.source) {
      where.source = filters.source;
    }

    if (filters?.severity) {
      where.severity = filters.severity;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    return await this.prisma.finding.findMany({
      where,
      include: {
        correctiveActions: true,
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Obtener hallazgo por ID
   */
  async findOne(id: string, tenantId: string) {
    const finding = await this.prisma.finding.findFirst({
      where: { id, tenantId },
      include: {
        correctiveActions: true,
      },
    });

    if (!finding) {
      throw new NotFoundException(`Finding ${id} not found`);
    }

    return finding;
  }

  /**
   * Crear acción correctiva (CAPA)
   */
  async createCorrectiveAction(
    findingId: string,
    tenantId: string,
    dto: any,
    userId: string,
  ) {
    const finding = await this.prisma.finding.findFirst({
      where: { id: findingId, tenantId },
    });

    if (!finding) {
      throw new NotFoundException(`Finding ${findingId} not found`);
    }

    const action = await this.prisma.correctiveAction.create({
      data: {
        ...dto,
        findingId,
        tenantId,
        status: 'PLANNED',
        createdBy: userId,
      },
    });

    // Crear workflow de seguimiento
    const workflow = await this.workflowEngine.startWorkflow({
      name: `CAPA: ${action.title}`,
      entityType: 'corrective-action',
      entityId: action.id,
      tenantId,
      steps: [
        {
          id: 'implement_action',
          type: WorkflowTaskType.TASK,
          name: 'Implementar Acción Correctiva',
          assignedTo: [action.assignedTo || userId],
          dueDate: action.targetDate || undefined,
          metadata: { actionId: action.id, findingId },
        },
        {
          id: 'verify_effectiveness',
          type: WorkflowTaskType.APPROVAL,
          name: 'Verificar Eficacia',
          assignedTo: [userId],
          dueDate: new Date(
            (action.targetDate ? new Date(action.targetDate).getTime() : Date.now()) + 30 * 24 * 60 * 60 * 1000,
          ), // +30 días
          metadata: { actionId: action.id, findingId },
        },
      ],
      createdBy: userId,
    });

    this.logger.log(`Corrective action created: ${action.id} - Workflow: ${workflow.id}`);

    return {
      action,
      workflowId: workflow.id,
    };
  }

  /**
   * Actualizar estado de acción correctiva
   */
  async updateActionStatus(
    actionId: string,
    tenantId: string,
    status: string,
    notes: string,
    userId: string,
  ) {
    const action = await this.prisma.correctiveAction.findFirst({
      where: { id: actionId, tenantId },
    });

    if (!action) {
      throw new NotFoundException(`Action ${actionId} not found`);
    }

    const updated = await this.prisma.correctiveAction.update({
      where: { id: actionId },
      data: {
        status: status as ActionStatus,
        verification: notes,
        completedDate: status === ActionStatus.COMPLETED ? new Date() : null,
      },
    });

    // Si se completa, actualizar hallazgo si todas las acciones están completas
    if (status === 'COMPLETED') {
      const allActions = await this.prisma.correctiveAction.findMany({
        where: { findingId: action.findingId, tenantId },
      });

      const allCompleted = allActions.every(
        (a) => a.status === 'COMPLETED' || a.id === actionId,
      );

      if (allCompleted && action.findingId) {
        await this.prisma.finding.update({
          where: { id: action.findingId },
          data: { status: 'RESOLVED' },
        });

        this.logger.log(`Finding ${action.findingId} resolved - all actions completed`);
      }
    }

    this.logger.log(`Action ${actionId} updated to ${status} by ${userId}`);
    return updated;
  }

  /**
   * Análisis de causa raíz (Root Cause Analysis)
   */
  async performRootCauseAnalysis(findingId: string, tenantId: string, rcaData: any) {
    const finding = await this.prisma.finding.findFirst({
      where: { id: findingId, tenantId },
    });

    if (!finding) {
      throw new NotFoundException(`Finding ${findingId} not found`);
    }

    await this.prisma.finding.update({
      where: { id: findingId },
      data: {
        resolution: JSON.stringify({
          method: rcaData.method || '5 Whys',
          analysis: rcaData.analysis,
          rootCause: rcaData.rootCause,
          contributingFactors: rcaData.contributingFactors || [],
          performedBy: rcaData.performedBy,
          performedDate: new Date(),
        }),
      },
    });

    this.logger.log(`RCA performed for finding ${findingId}`);

    return {
      message: 'Análisis de causa raíz completado',
      rootCause: rcaData.rootCause,
    };
  }

  /**
   * Dashboard de revisión por la dirección (Management Review)
   */
  async getManagementReviewDashboard(tenantId: string, period?: string) {
    // Periodo por defecto: últimos 12 meses
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    // 1. Estado del SGCN
    const bcmsStatus = {
      totalFindings: await this.prisma.finding.count({ where: { tenantId } }),
      openFindings: await this.prisma.finding.count({
        where: { tenantId, status: 'OPEN' },
      }),
      resolvedFindings: await this.prisma.finding.count({
        where: { tenantId, status: 'RESOLVED' },
      }),
      highSeverityFindings: await this.prisma.finding.count({
        where: { tenantId, severity: 'CRITICAL' }, // Usar CRITICAL en lugar de HIGH
      }),
    };

    // 2. Desempeño de acciones correctivas
    const capaPerformance = {
      totalActions: await this.prisma.correctiveAction.count({ where: { tenantId } }),
      completedActions: await this.prisma.correctiveAction.count({
        where: { tenantId, status: 'COMPLETED' as any },
      }),
      overdueActions: await this.prisma.correctiveAction.count({
        where: {
          tenantId,
          status: { not: 'COMPLETED' as any },
          targetDate: { lt: new Date() },
        },
      }),
      avgClosureTime: await this.calculateAvgClosureTime(tenantId),
    };

    // 3. Resultados de ejercicios
    const exerciseResults = {
      totalExercises: await this.prisma.exercise.count({
        where: { tenantId, createdAt: { gte: startDate } },
      }),
      successfulExercises: await this.prisma.exercise.count({
        where: { tenantId, result: 'SUCCESS', createdAt: { gte: startDate } },
      }),
      avgScore: await this.calculateAvgExerciseScore(tenantId, startDate),
    };

    // 4. Cobertura del programa
    const programCoverage = await this.analyticsEngine.getBiaCoverage(tenantId);

    // 5. Cambios en el contexto (nuevos riesgos, procesos)
    const contextChanges = {
      newRisks: await this.prisma.riskAssessment.count({
        where: { tenantId, createdAt: { gte: startDate } },
      }),
      newProcesses: await this.prisma.businessProcess.count({
        where: { tenantId, createdAt: { gte: startDate } },
      }),
    };

    return {
      period: {
        start: startDate,
        end: new Date(),
      },
      bcmsStatus,
      capaPerformance,
      exerciseResults,
      programCoverage,
      contextChanges,
      recommendations: this.generateManagementRecommendations({
        bcmsStatus,
        capaPerformance,
        exerciseResults,
        programCoverage,
      }),
    };
  }

  /**
   * KPIs del SGCN
   */
  async getKPIs(tenantId: string) {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const kpis = {
      // KPI 1: Tasa de resolución de hallazgos
      findingResolutionRate: await this.calculateFindingResolutionRate(tenantId),

      // KPI 2: Tiempo medio de cierre de acciones correctivas
      avgActionClosureTime: await this.calculateAvgClosureTime(tenantId),

      // KPI 3: Tasa de éxito de ejercicios
      exerciseSuccessRate: await this.calculateExerciseSuccessRate(tenantId),

      // KPI 4: Cobertura de BIA
      biaCoverage: await this.analyticsEngine.getBiaCoverage(tenantId),

      // KPI 5: Planes actualizados en los últimos 6 meses
      planUpdateRate: await this.calculatePlanUpdateRate(tenantId),

      // KPI 6: Hallazgos por fuente
      findingsBySource: await this.getFindingsBySource(tenantId),

      // KPI 7: Tendencia de mejora (mes a mes)
      improvementTrend: await this.calculateImprovementTrend(tenantId),
    };

    return kpis;
  }

  /**
   * Generar reporte de revisión por la dirección
   */
  async generateManagementReviewReport(tenantId: string) {
    const dashboard = await this.getManagementReviewDashboard(tenantId);
    const kpis = await this.getKPIs(tenantId);

    const reportData = {
      title: 'Revisión por la Dirección - SGCN',
      date: new Date(),
      period: dashboard.period,
      sections: [
        {
          title: '1. Resumen Ejecutivo',
          content: this.generateExecutiveSummary(dashboard),
        },
        {
          title: '2. Desempeño del SGCN',
          content: dashboard.bcmsStatus,
        },
        {
          title: '3. Resultados de Ejercicios',
          content: dashboard.exerciseResults,
        },
        {
          title: '4. Acciones Correctivas',
          content: dashboard.capaPerformance,
        },
        {
          title: '5. Cobertura del Programa',
          content: dashboard.programCoverage,
        },
        {
          title: '6. KPIs',
          content: kpis,
        },
        {
          title: '7. Cambios en el Contexto',
          content: dashboard.contextChanges,
        },
        {
          title: '8. Recomendaciones',
          content: dashboard.recommendations,
        },
      ],
    };

    const pdfBuffer = await this.reportGenerator.generateManagementReviewReport(reportData);

    return {
      reportData,
      pdfUrl: `/continuous-improvement/management-review-report.pdf`,
      pdfBuffer,
    };
  }

  /**
   * Convertir brecha de ejercicio en hallazgo
   */
  async convertGapToFinding(
    exerciseId: string,
    gap: any,
    tenantId: string,
    userId: string,
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
      include: { plan: true },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    const finding = await this.createFinding(
      {
        title: gap.title,
        description: gap.description,
        source: 'EXERCISE',
        sourceReference: exerciseId,
        category: gap.category,
        severity: gap.severity,
        affectedArea: exercise.plan?.name || 'Unknown',
        impact: gap.impact,
        recommendation: gap.recommendation,
      },
      tenantId,
      userId,
    );

    this.logger.log(`Gap from exercise ${exerciseId} converted to finding ${finding.id}`);

    return finding;
  }

  /**
   * Tendencias de mejora
   */
  async getImprovementTrends(tenantId: string, months: number = 12) {
    const trends: Array<{
      month: string;
      newFindings: number;
      resolvedFindings: number;
      completedActions: number;
      exercisesPerformed: number;
    }> = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthData = {
        month: monthStart.toISOString().substring(0, 7), // YYYY-MM
        newFindings: await this.prisma.finding.count({
          where: {
            tenantId,
            createdAt: { gte: monthStart, lte: monthEnd },
          },
        }),
        resolvedFindings: await this.prisma.finding.count({
          where: {
            tenantId,
            status: 'RESOLVED',
            updatedAt: { gte: monthStart, lte: monthEnd },
          },
        }),
        completedActions: await this.prisma.correctiveAction.count({
          where: {
            tenantId,
            status: 'COMPLETED',
            completedDate: { gte: monthStart, lte: monthEnd },
          },
        }),
        exercisesPerformed: await this.prisma.exercise.count({
          where: {
            tenantId,
            status: 'COMPLETED',
            actualEndTime: { gte: monthStart, lte: monthEnd },
          },
        }),
      };

      trends.push(monthData);
    }

    return trends;
  }

  /**
   * Actualizar hallazgo
   */
  async update(id: string, tenantId: string, dto: any, userId: string) {
    await this.prisma.finding.updateMany({
      where: { id, tenantId },
      data: dto,
    });

    this.logger.log(`Finding updated: ${id} by ${userId}`);
    return { message: 'Hallazgo actualizado' };
  }

  /**
   * Eliminar hallazgo
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.finding.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`Finding deleted: ${id} by ${userId}`);
    return { message: 'Hallazgo eliminado' };
  }

  // ========== Métodos Auxiliares ==========

  private async calculateAvgClosureTime(tenantId: string): Promise<number> {
    const completedActions = await this.prisma.correctiveAction.findMany({
      where: { tenantId, status: 'COMPLETED', completedDate: { not: null } },
    });

    if (completedActions.length === 0) return 0;

    const totalDays = completedActions.reduce((sum, action) => {
      const created = new Date(action.createdAt).getTime();
      const completed = new Date(action.completedDate!).getTime();
      const days = (completed - created) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return Math.round(totalDays / completedActions.length);
  }

  private async calculateAvgExerciseScore(
    tenantId: string,
    startDate: Date,
  ): Promise<number> {
    const exercises = await this.prisma.exercise.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        createdAt: { gte: startDate },
        score: { not: null },
      },
    });

    if (exercises.length === 0) return 0;

    const totalScore = exercises.reduce((sum, ex) => sum + (Number(ex.score) || 0), 0);
    return Math.round(totalScore / exercises.length);
  }

  private async calculateFindingResolutionRate(tenantId: string): Promise<number> {
    const total = await this.prisma.finding.count({ where: { tenantId } });
    if (total === 0) return 0;

    const resolved = await this.prisma.finding.count({
      where: { tenantId, status: 'RESOLVED' },
    });

    return Math.round((resolved / total) * 100);
  }

  private async calculateExerciseSuccessRate(tenantId: string): Promise<number> {
    const total = await this.prisma.exercise.count({
      where: { tenantId, status: 'COMPLETED' },
    });
    if (total === 0) return 0;

    const successful = await this.prisma.exercise.count({
      where: { tenantId, result: 'SUCCESS' },
    });

    return Math.round((successful / total) * 100);
  }

  private async calculatePlanUpdateRate(tenantId: string): Promise<number> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const total = await this.prisma.continuityPlan.count({ where: { tenantId } });
    if (total === 0) return 0;

    const updated = await this.prisma.continuityPlan.count({
      where: { tenantId, updatedAt: { gte: sixMonthsAgo } },
    });

    return Math.round((updated / total) * 100);
  }

  private async getFindingsBySource(tenantId: string) {
    const findings = await this.prisma.finding.findMany({
      where: { tenantId },
      select: { source: true },
    });

    const bySource = findings.reduce((acc, f) => {
      acc[f.source] = (acc[f.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return bySource;
  }

  private async calculateImprovementTrend(tenantId: string) {
    const last3Months: { month: string; resolvedFindings: number }[] = [];
    const now = new Date();

    for (let i = 2; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const resolved = await this.prisma.finding.count({
        where: {
          tenantId,
          status: 'RESOLVED',
          updatedAt: { gte: monthStart, lte: monthEnd },
        },
      });

      last3Months.push({
        month: monthStart.toISOString().substring(0, 7),
        resolvedFindings: resolved,
      });
    }

    // Calcular tendencia (positiva si aumenta la resolución)
    const trend =
      last3Months.length >= 2
        ? last3Months[2].resolvedFindings - last3Months[0].resolvedFindings
        : 0;

    return {
      trend: trend > 0 ? 'IMPROVING' : trend < 0 ? 'DECLINING' : 'STABLE',
      data: last3Months,
    };
  }

  private generateManagementRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (data.capaPerformance.overdueActions > 0) {
      recommendations.push(
        `Priorizar el cierre de ${data.capaPerformance.overdueActions} acciones correctivas vencidas`,
      );
    }

    if (data.exerciseResults.avgScore < 80) {
      recommendations.push(
        `Mejorar preparación de ejercicios - Score promedio actual: ${data.exerciseResults.avgScore}`,
      );
    }

    if (data.programCoverage.coveragePercentage < 100) {
      recommendations.push(
        `Completar BIA para ${100 - data.programCoverage.coveragePercentage}% de procesos faltantes`,
      );
    }

    if (data.bcmsStatus.highSeverityFindings > 0) {
      recommendations.push(
        `Atender ${data.bcmsStatus.highSeverityFindings} hallazgos de severidad alta`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('El SGCN está funcionando adecuadamente. Mantener el curso actual.');
    }

    return recommendations;
  }

  private generateExecutiveSummary(dashboard: any): string {
    return `
Durante el período evaluado, el Sistema de Gestión de Continuidad de Negocio ha demostrado 
${dashboard.bcmsStatus.resolvedFindings > dashboard.bcmsStatus.openFindings ? 'un desempeño positivo' : 'áreas de mejora'}.

Hallazgos: ${dashboard.bcmsStatus.totalFindings} totales, ${dashboard.bcmsStatus.resolvedFindings} resueltos, 
${dashboard.bcmsStatus.openFindings} abiertos.

Ejercicios: ${dashboard.exerciseResults.totalExercises} ejecutados con una tasa de éxito de 
${((dashboard.exerciseResults.successfulExercises / dashboard.exerciseResults.totalExercises) * 100).toFixed(0)}%.

Acciones Correctivas: ${dashboard.capaPerformance.completedActions} de ${dashboard.capaPerformance.totalActions} completadas.
    `.trim();
  }
}
