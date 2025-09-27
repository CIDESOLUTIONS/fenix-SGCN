import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';

@Injectable()
export class TestExercisesService {
  private readonly logger = new Logger(TestExercisesService.name);

  constructor(
    private prisma: PrismaService,
    private dgraphService: DgraphService,
    private workflowEngine: WorkflowEngineService,
  ) {}

  /**
   * Crear ejercicio de prueba
   */
  async create(dto: any, tenantId: string, userId: string) {
    const exercise = await this.prisma.testExercise.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type as any,
        planId: dto.planId,
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : new Date(),
        objectives: dto.objectives as any,
        scenario: dto.scenario as any,
        participants: dto.participants || [],
      },
      include: { plan: true },
    });

    this.logger.log(`Exercise created: ${exercise.id} by ${userId}`);
    return exercise;
  }

  /**
   * Listar ejercicios
   */
  async findAll(tenantId: string) {
    return await this.prisma.testExercise.findMany({
      where: { tenantId },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  /**
   * Obtener ejercicio por ID
   */
  async findOne(id: string, tenantId: string) {
    const exercise = await this.prisma.testExercise.findFirst({
      where: { id, tenantId },
      include: {
        plan: {
          include: {
            process: true,
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    return exercise;
  }

  /**
   * Iniciar ejercicio
   */
  async startExercise(id: string, tenantId: string, userId: string) {
    const exercise = await this.prisma.testExercise.findFirst({
      where: { id, tenantId },
      include: { plan: true },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    const started = await this.prisma.testExercise.update({
      where: { id },
      data: {
        executedDate: new Date(),
        executedBy: userId,
        actualStartTime: new Date(),
        executionLog: {
          startedBy: userId,
          startedAt: new Date(),
          events: [],
        } as any,
      },
    });

    this.logger.log(`Exercise started: ${id} by ${userId}`);
    return started;
  }

  /**
   * Registrar evento durante ejercicio
   */
  async logEvent(
    id: string,
    tenantId: string,
    event: {
      timestamp: Date;
      type: string;
      description: string;
      participantId?: string;
      duration?: number;
    },
    userId: string,
  ) {
    const exercise = await this.prisma.testExercise.findFirst({
      where: { id, tenantId },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    const currentLog = (exercise.executionLog as any) || { events: [] };
    const updatedLog = {
      ...currentLog,
      events: [...(currentLog.events || []), event],
    };

    const updated = await this.prisma.testExercise.update({
      where: { id },
      data: {
        executionLog: updatedLog as any,
      },
    });

    this.logger.log(`Event logged for exercise ${id}: ${event.type}`);
    return updated;
  }

  /**
   * Finalizar ejercicio con scoring automático
   */
  async completeExercise(
    id: string,
    tenantId: string,
    results: {
      rtoAchieved?: number;
      rpoAchieved?: number;
      successRate?: number;
      observations?: string[];
      evidence?: Array<{ type: string; url: string; description: string }>;
    },
    userId: string,
  ) {
    const exercise = await this.prisma.testExercise.findFirst({
      where: { id, tenantId },
      include: {
        plan: {
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
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    // Calcular score automático
    const bia = exercise.plan?.process?.biaAssessments[0];
    let score = 'PASS';

    if (bia && results.rtoAchieved !== undefined) {
      if (results.rtoAchieved > (bia.rto || Infinity)) {
        score = 'FAIL';
      } else if (results.rtoAchieved > (bia.rto || 0) * 0.8) {
        score = 'PASS_WITH_OBSERVATIONS';
      }
    }

    if (results.successRate !== undefined && results.successRate < 70) {
      score = 'FAIL';
    }

    const completed = await this.prisma.testExercise.update({
      where: { id },
      data: {
        actualEndTime: new Date(),
        results: {
          ...results,
          score,
          completedBy: userId,
          completedAt: new Date(),
        } as any,
      },
    });

    // Generar hallazgos si hubo fallas
    if (score === 'FAIL' || score === 'PASS_WITH_OBSERVATIONS') {
      await this.generateFindings(exercise, results, score, tenantId, userId);
    }

    this.logger.log(`Exercise completed: ${id} with score ${score}`);
    return completed;
  }

  /**
   * Generar hallazgos automáticamente
   */
  private async generateFindings(
    exercise: any,
    results: any,
    score: string,
    tenantId: string,
    userId: string,
  ) {
    const findings: Array<{
      title: string;
      description: string;
      severity: string;
      category: string;
    }> = [];

    const bia = exercise.plan?.process?.biaAssessments[0];

    if (bia && results.rtoAchieved > bia.rto) {
      findings.push({
        title: 'RTO No Cumplido',
        description: `El ejercicio tomó ${results.rtoAchieved}h pero el RTO objetivo es ${bia.rto}h`,
        severity: 'HIGH',
        category: 'PERFORMANCE',
      });
    }

    if (results.successRate < 70) {
      findings.push({
        title: 'Tasa de Éxito Baja',
        description: `Solo se completaron ${results.successRate}% de las tareas exitosamente`,
        severity: 'MEDIUM',
        category: 'EXECUTION',
      });
    }

    if (results.observations && results.observations.length > 0) {
      findings.push({
        title: 'Observaciones Identificadas',
        description: results.observations.join('; '),
        severity: score === 'FAIL' ? 'HIGH' : 'MEDIUM',
        category: 'PROCESS',
      });
    }

    // Crear hallazgos en el módulo de mejora continua
    for (const finding of findings) {
      await this.prisma.finding.create({
        data: {
          tenantId,
          title: finding.title,
          description: finding.description,
          source: 'EXERCISE' as any,
          severity: finding.severity as any,
          category: finding.category,
          status: 'OPEN' as any,
          identifiedBy: userId,
        },
      });
    }

    this.logger.log(`Generated ${findings.length} findings for exercise ${exercise.id}`);
  }

  /**
   * Generar reporte post-ejercicio
   */
  async generateReport(id: string, tenantId: string) {
    const exercise = await this.prisma.testExercise.findFirst({
      where: { id, tenantId },
      include: {
        plan: {
          include: {
            process: {
              include: {
                biaAssessments: true,
              },
            },
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    const executionLog = exercise.executionLog as any;
    const results = exercise.results as any;

    const report = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseType: exercise.type,
      scheduledDate: exercise.scheduledDate,
      actualStartTime: exercise.actualStartTime,
      actualEndTime: exercise.actualEndTime,
      duration:
        exercise.actualStartTime && exercise.actualEndTime
          ? (exercise.actualEndTime.getTime() - exercise.actualStartTime.getTime()) / 1000 / 60 / 60
          : null,
      planDetails: {
        id: exercise.plan?.id,
        name: exercise.plan?.name,
        processName: exercise.plan?.process?.name,
      },
      objectives: exercise.objectives,
      scenario: exercise.scenario,
      participants: exercise.participants,
      execution: {
        events: executionLog?.events || [],
        totalEvents: executionLog?.events?.length || 0,
      },
      results: {
        score: results?.score,
        rtoTarget: exercise.plan?.process?.biaAssessments[0]?.rto,
        rtoAchieved: results?.rtoAchieved,
        rtoMet: results?.rtoAchieved <= (exercise.plan?.process?.biaAssessments[0]?.rto || Infinity),
        successRate: results?.successRate,
        observations: results?.observations || [],
        evidence: results?.evidence || [],
      },
      recommendations: this.generateRecommendations(exercise, results),
    };

    return report;
  }

  /**
   * Generar recomendaciones basadas en resultados
   */
  private generateRecommendations(exercise: any, results: any): string[] {
    const recommendations: string[] = [];
    const bia = exercise.plan?.process?.biaAssessments[0];

    if (results?.rtoAchieved > (bia?.rto || 0)) {
      recommendations.push(
        `Revisar y optimizar los pasos del plan para reducir el tiempo de recuperación de ${results.rtoAchieved}h a ${bia?.rto}h`
      );
    }

    if (results?.successRate < 70) {
      recommendations.push(
        'Realizar capacitación adicional para los participantes sobre los procedimientos del plan'
      );
    }

    if (results?.observations && results.observations.length > 3) {
      recommendations.push(
        'Actualizar el plan para abordar las múltiples observaciones identificadas durante el ejercicio'
      );
    }

    if (exercise.participants && exercise.participants.length < 3) {
      recommendations.push(
        'Incluir más participantes en futuros ejercicios para validar la coordinación del equipo'
      );
    }

    return recommendations;
  }

  /**
   * Obtener estadísticas de ejercicios
   */
  async getExerciseStatistics(tenantId: string) {
    const exercises = await this.prisma.testExercise.findMany({
      where: { tenantId },
      include: {
        plan: {
          include: {
            process: true,
          },
        },
      },
    });

    const total = exercises.length;
    const completed = exercises.filter((e) => e.actualEndTime !== null).length;
    const passed = exercises.filter(
      (e) => e.actualEndTime !== null && (e.results as any)?.score === 'PASS'
    ).length;
    const failed = exercises.filter(
      (e) => e.actualEndTime !== null && (e.results as any)?.score === 'FAIL'
    ).length;

    const avgSuccessRate =
      exercises
        .filter((e) => (e.results as any)?.successRate)
        .reduce((sum, e) => sum + ((e.results as any)?.successRate || 0), 0) /
      exercises.filter((e) => (e.results as any)?.successRate).length || 0;

    const byType = exercises.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      pending: total - completed,
      passed,
      failed,
      passRate: completed > 0 ? (passed / completed) * 100 : 0,
      avgSuccessRate: Math.round(avgSuccessRate * 100) / 100,
      byType,
      recentExercises: exercises.slice(0, 5).map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        isCompleted: e.actualEndTime !== null,
        scheduledDate: e.scheduledDate,
        score: (e.results as any)?.score,
      })),
    };
  }

  /**
   * Actualizar ejercicio
   */
  async update(id: string, tenantId: string, dto: any, userId: string) {
    const exercise = await this.prisma.testExercise.updateMany({
      where: { id, tenantId },
      data: {
        name: dto.name,
        type: dto.type as any,
        planId: dto.planId,
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
        objectives: dto.objectives as any,
        scenario: dto.scenario as any,
        participants: dto.participants,
      },
    });

    this.logger.log(`Exercise updated: ${id} by ${userId}`);
    return exercise;
  }

  /**
   * Eliminar ejercicio
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.testExercise.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`Exercise deleted: ${id} by ${userId}`);
    return { message: 'Ejercicio eliminado' };
  }
}
