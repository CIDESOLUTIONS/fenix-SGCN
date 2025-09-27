import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';
import { ReportGeneratorService } from '../report-generator/report-generator.service';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    private prisma: PrismaService,
    private workflowEngine: WorkflowEngineService,
    private analyticsEngine: AnalyticsEngineService,
    private reportGenerator: ReportGeneratorService,
  ) {}

  /**
   * Crear ejercicio de continuidad
   */
  async create(dto: any, tenantId: string, userId: string) {
    const exercise = await this.prisma.exercise.create({
      data: {
        ...dto,
        tenantId,
        status: 'PLANNED',
        createdBy: userId,
      },
    });

    this.logger.log(`Exercise created: ${exercise.id} - ${exercise.name} by ${userId}`);
    return exercise;
  }

  /**
   * Listar ejercicios
   */
  async findAll(tenantId: string, filters?: any) {
    const where: any = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.planId) {
      where.planId = filters.planId;
    }

    return await this.prisma.exercise.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            process: {
              select: {
                id: true,
                name: true,
                criticalityLevel: true,
              },
            },
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
    const exercise = await this.prisma.exercise.findFirst({
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
   * Iniciar ejercicio (Modo Ejecución)
   */
  async startExercise(id: string, tenantId: string, userId: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, tenantId },
      // include: { plan: true },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${id} not found`);
    }

    if (exercise.status !== 'PLANNED') {
      throw new Error(`Exercise must be in PLANNED status to start`);
    }

    // Actualizar a IN_PROGRESS
    const updated = await this.prisma.exercise.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startTime: new Date(),
        scenario: {
          events: [
            {
              timestamp: new Date().toISOString(),
              type: 'EXERCISE_STARTED',
              user: userId,
              description: 'Ejercicio iniciado',
            },
          ],
        },
      },
    });

    this.logger.log(`Exercise started: ${id} by ${userId}`);

    return {
      exerciseId: id,
      name: exercise.name,
      status: 'IN_PROGRESS',
      startTime: updated.startTime,
      message: 'Ejercicio iniciado - Modo ejecución activo',
    };
  }

  /**
   * Registrar evento durante ejercicio
   */
  async logEvent(
    exerciseId: string,
    tenantId: string,
    eventData: {
      type: string;
      description: string;
      userId: string;
      metadata?: any;
    },
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    const currentLog = (exercise.executionLog as any) || { events: [] };
    const events = currentLog.events || [];

    events.push({
      timestamp: new Date().toISOString(),
      type: eventData.type,
      user: eventData.userId,
      description: eventData.description,
      metadata: eventData.metadata,
    });

    await this.prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        scenario: {
          events,
        },
      },
    });

    this.logger.log(`Event logged: ${eventData.type} in exercise ${exerciseId}`);

    return {
      message: 'Evento registrado',
      event: events[events.length - 1],
    };
  }

  /**
   * Inyectar evento no planificado (para pruebas de adaptabilidad)
   */
  async injectEvent(
    exerciseId: string,
    tenantId: string,
    injection: {
      title: string;
      description: string;
      severity: string;
      userId: string;
    },
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    if (exercise.status !== 'IN_PROGRESS') {
      throw new Error('Can only inject events during active exercises');
    }

    await this.logEvent(exerciseId, tenantId, {
      type: 'INJECTION',
      description: `🔴 INYECCIÓN: ${injection.title} - ${injection.description}`,
      userId: injection.userId,
      metadata: {
        severity: injection.severity,
        injectionTitle: injection.title,
      },
    });

    return {
      message: 'Evento inyectado al ejercicio',
      injection: {
        title: injection.title,
        severity: injection.severity,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Marcar tarea como completada durante ejercicio
   */
  async completeTask(
    exerciseId: string,
    tenantId: string,
    taskData: {
      taskId: string;
      completedBy: string;
      notes?: string;
      evidence?: string[];
    },
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    const currentLog = (exercise.executionLog as any) || { events: [], completedTasks: [] };
    const completedTasks = currentLog.completedTasks || [];

    const completedTask = {
      taskId: taskData.taskId,
      completedBy: taskData.completedBy,
      completedAt: new Date().toISOString(),
      notes: taskData.notes,
      evidence: taskData.evidence || [],
    };

    completedTasks.push(completedTask);

    // También registrar como evento
    const events = currentLog.events || [];
    events.push({
      timestamp: new Date().toISOString(),
      type: 'TASK_COMPLETED',
      user: taskData.completedBy,
      description: `Tarea completada: ${taskData.taskId}`,
      metadata: { taskId: taskData.taskId, notes: taskData.notes },
    });

    await this.prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        scenario: {
          events,
          completedTasks,
        },
      },
    });

    return {
      message: 'Tarea marcada como completada',
      task: completedTask,
    };
  }

  /**
   * Finalizar ejercicio y calcular resultados
   */
  async finishExercise(exerciseId: string, tenantId: string, userId: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
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
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    if (exercise.status !== 'IN_PROGRESS') {
      throw new Error('Exercise must be in IN_PROGRESS status to finish');
    }

    const actualEndTime = new Date();
    const actualStartTime = exercise.actualStartTime || new Date();
    const actualDuration = Math.round(
      (actualEndTime.getTime() - actualStartTime.getTime()) / (1000 * 60 * 60),
    ); // horas

    // Obtener RTO objetivo
    const bia = exercise.plan?.process?.biaAssessments?.[0];
    const targetRto = bia?.rto || 24;

    // Calcular score
    const score = this.calculateExerciseScore(
      actualDuration,
      targetRto,
    );

    // Determinar resultado
    let result: 'SUCCESS' | 'SUCCESS_WITH_OBSERVATIONS' | 'PARTIAL_SUCCESS' | 'FAILED';
    if (actualDuration <= targetRto) {
      result = 'SUCCESS';
    } else if (actualDuration <= targetRto * 1.2) {
      result = 'SUCCESS_WITH_OBSERVATIONS';
    } else {
      result = 'FAILED';
    }

    // Actualizar ejercicio
    const updated = await this.prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        status: 'COMPLETED',
        actualEndTime,
        actualDuration,
        result: result as any,
        score,
      },
    });

    this.logger.log(`Exercise finished: ${exerciseId} - Result: ${result}, Score: ${score}`);

    return {
      exerciseId,
      result,
      score,
      actualDuration,
      targetRto,
      meetsRto: actualDuration <= targetRto,
      summary: {
        startTime: actualStartTime,
        endTime: actualEndTime,
        duration: `${actualDuration}h`,
        target: `${targetRto}h`,
        performance: actualDuration <= targetRto ? 'Objetivo cumplido' : 'Objetivo no cumplido',
      },
    };
  }

  /**
   * Generar reporte post-ejercicio
   */
  async generateReport(exerciseId: string, tenantId: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
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
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    if (exercise.status !== 'COMPLETED') {
      throw new Error('Exercise must be completed to generate report');
    }

    const executionLog = (exercise.executionLog as any) || {};
    const events = executionLog.events || [];
    const completedTasks = executionLog.completedTasks || [];

    // Identificar brechas
    const gaps: Array<{
      category: string;
      description: string;
      recommendation: string;
      priority: string;
    }> = [];
    if (exercise.result === 'FAILED' || exercise.result === 'SUCCESS_WITH_OBSERVATIONS') {
      gaps.push({
        category: 'PERFORMANCE',
        description: `Tiempo real (${exercise.actualDuration}h) ${
          exercise.result === 'FAILED' ? 'excedió' : 'estuvo cerca de exceder'
        } RTO objetivo`,
        recommendation: 'Revisar y optimizar procedimientos críticos',
        priority: exercise.result === 'FAILED' ? 'HIGH' : 'MEDIUM',
      });
    }

    // Analizar eventos para identificar problemas
    const injections = events.filter((e) => e.type === 'INJECTION');
    if (injections.length > 0) {
      gaps.push({
        category: 'ADAPTABILITY',
        description: `Se inyectaron ${injections.length} eventos no planificados`,
        recommendation: 'Evaluar respuesta del equipo ante situaciones imprevistas',
        priority: 'MEDIUM',
      });
    }

    const reportData = {
      exercise: {
        id: exercise.id,
        name: exercise.name,
        type: exercise.type,
        date: exercise.scheduledDate,
      },
      objectives: exercise.objectives || [],
      scenario: exercise.scenario,
      participants: exercise.participants || [],
      timeline: {
        planned: {
          start: exercise.scheduledDate,
          duration: exercise.actualDuration || 0,
        },
        actual: {
          start: exercise.actualStartTime,
          end: exercise.actualEndTime,
          duration: exercise.actualDuration,
        },
      },
      performance: {
        targetRto: exercise.plan?.process?.biaAssessments?.[0]?.rto || 24,
        // actualDuration: exercise.actualDuration,
        score: exercise.score,
        result: exercise.result,
        meetsObjective: exercise.result === 'SUCCESS',
      },
      executionSummary: {
        totalEvents: events.length,
        completedTasks: completedTasks.length,
        injections: injections.length,
      },
      events,
      completedTasks,
      gaps,
      recommendations: gaps.map((g) => g.recommendation),
    };

    // Generar PDF
    const pdfUrl = await this.reportGenerator.generateExerciseReport(
      `Reporte Ejercicio ${exercise.name}`,
      reportData
    );

    return {
      reportData,
      pdfUrl,
    };
  }

  /**
   * Identificar brechas del ejercicio
   */
  async identifyGaps(exerciseId: string, tenantId: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id: exerciseId, tenantId },
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
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    const gaps: Array<{
      id: string;
      category: string;
      severity: string;
      title: string;
      description: string;
      impact: string;
      recommendation: string;
      estimatedEffort: string;
    }> = [];
    const bia = exercise.plan?.process?.biaAssessments?.[0];
    const targetRto = bia?.rto || 24;

    // Brecha 1: Performance vs RTO
    if (exercise.actualDuration && exercise.actualDuration > targetRto) {
      const delay = exercise.actualDuration - targetRto;
      gaps.push({
        id: `gap_rto_${exercise.id}`,
        category: 'PERFORMANCE',
        severity: delay > targetRto * 0.5 ? 'HIGH' : 'MEDIUM',
        title: 'RTO No Cumplido',
        description: `Recuperación tomó ${exercise.actualDuration}h, excediendo RTO de ${targetRto}h por ${delay}h`,
        impact: `Proceso sin servicio ${delay}h adicionales`,
        recommendation: 'Optimizar procedimientos críticos y considerar estrategia de redundancia',
        estimatedEffort: '30-60 días',
      });
    }

    // Brecha 2: Análisis de log de ejecución
    const executionLog = (exercise.executionLog as any) || {};
    const events = executionLog.events || [];
    const completedTasks = executionLog.completedTasks || [];

    const injections = events.filter((e) => e.type === 'INJECTION');
    if (injections.length > 0) {
      gaps.push({
        id: `gap_adaptability_${exercise.id}`,
        category: 'ADAPTABILITY',
        severity: 'MEDIUM',
        title: 'Respuesta a Eventos Imprevistos',
        description: `${injections.length} eventos no planificados inyectados durante el ejercicio`,
        impact: 'Capacidad de adaptación del equipo bajo estrés',
        recommendation: 'Entrenar al equipo en toma de decisiones bajo presión',
        estimatedEffort: '15-30 días',
      });
    }

    // Brecha 3: Tareas no completadas
    const planTasks = 10; // En producción, obtener del plan real
    const completionRate = (completedTasks.length / planTasks) * 100;

    if (completionRate < 100) {
      gaps.push({
        id: `gap_completion_${exercise.id}`,
        category: 'EXECUTION',
        severity: completionRate < 70 ? 'HIGH' : 'MEDIUM',
        title: 'Tareas Incompletas',
        description: `Solo ${completedTasks.length} de ${planTasks} tareas completadas (${completionRate.toFixed(0)}%)`,
        impact: 'Plan de continuidad parcialmente ejecutado',
        recommendation: 'Revisar asignación de responsabilidades y disponibilidad de recursos',
        estimatedEffort: '15-30 días',
      });
    }

    return {
      exerciseId,
      exerciseName: exercise.name,
      totalGaps: gaps.length,
      highSeverityGaps: gaps.filter((g) => g.severity === 'HIGH').length,
      gaps,
      nextSteps: 'Convertir brechas en acciones correctivas en Módulo de Mejora Continua',
    };
  }

  /**
   * Obtener calendario de ejercicios
   */
  async getCalendar(tenantId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    const exercises = await this.prisma.exercise.findMany({
      where: {
        tenantId,
        scheduledDate: {
          gte: new Date(`${targetYear}-01-01`),
          lte: new Date(`${targetYear}-12-31`),
        },
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            process: {
              select: {
                id: true,
                name: true,
                criticalityLevel: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    // Agrupar por mes
    const calendar = {};
    exercises.forEach((ex) => {
      const month = new Date(ex.scheduledDate).getMonth() + 1;
      if (!calendar[month]) {
        calendar[month] = [];
      }
      calendar[month].push({
        id: ex.id,
        name: ex.name,
        type: ex.type,
        date: ex.scheduledDate,
        status: ex.status,
        plan: ex.plan?.name,
        process: ex.plan?.process?.name,
        criticality: ex.plan?.process?.criticalityLevel,
      });
    });

    return {
      year: targetYear,
      totalExercises: exercises.length,
      byMonth: calendar,
      byStatus: {
        planned: exercises.filter((e) => e.status === 'PLANNED').length,
        inProgress: exercises.filter((e) => e.status === 'IN_PROGRESS').length,
        completed: exercises.filter((e) => e.status === 'COMPLETED').length,
        cancelled: exercises.filter((e) => e.status === 'CANCELLED').length,
      },
    };
  }

  /**
   * Actualizar ejercicio
   */
  async update(id: string, tenantId: string, dto: any, userId: string) {
    await this.prisma.exercise.updateMany({
      where: { id, tenantId },
      data: dto,
    });

    this.logger.log(`Exercise updated: ${id} by ${userId}`);
    return { message: 'Ejercicio actualizado' };
  }

  /**
   * Eliminar ejercicio
   */
  async remove(id: string, tenantId: string, userId: string) {
    await this.prisma.exercise.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`Exercise deleted: ${id} by ${userId}`);
    return { message: 'Ejercicio eliminado' };
  }

  /**
   * Calcular score del ejercicio
   */
  private calculateExerciseScore(
    actualDuration: number,
    targetRto: number,
  ): number {
    let score = 100;

    // Factor 1: Performance vs RTO (peso 50%)
    const rtoRatio = actualDuration / targetRto;
    if (rtoRatio <= 1) {
      score -= 0; // Perfecto
    } else if (rtoRatio <= 1.2) {
      score -= 15; // Aceptable
    } else if (rtoRatio <= 1.5) {
      score -= 30; // Deficiente
    } else {
      score -= 50; // Fallo crítico
    }

    // Factor 2: Tareas completadas (peso 30%)
    const log: any = {};
    const completedTasks = log.completedTasks?.length || 0;
    const totalTasks = 10; // En producción, obtener del plan

    const completionRate = completedTasks / totalTasks;
    if (completionRate >= 1) {
      score -= 0;
    } else if (completionRate >= 0.8) {
      score -= 10;
    } else if (completionRate >= 0.6) {
      score -= 20;
    } else {
      score -= 30;
    }

    // Factor 3: Eventos e inyecciones (peso 20%)
    const events = log.events || [];
    const injections = events.filter((e) => e.type === 'INJECTION').length;

    if (injections > 0) {
      score -= injections * 5; // -5 puntos por cada inyección (indica problemas)
    }

    return Math.max(0, Math.min(100, score));
  }
}
