import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum WorkflowTaskType {
  APPROVAL = 'APPROVAL',
  REVIEW = 'REVIEW',
  IMPLEMENTATION = 'IMPLEMENTATION',
  VERIFICATION = 'VERIFICATION',
  NOTIFICATION = 'NOTIFICATION',
  REMINDER = 'REMINDER',
  TASK = 'TASK',
}

interface WorkflowStep {
  id: string;
  type: WorkflowTaskType;
  name: string;
  assignedTo: string[];
  dueDate?: Date;
  metadata?: any;
}

interface WorkflowConfig {
  name: string;
  entityType: string;
  entityId: string;
  tenantId: string;
  steps: WorkflowStep[];
  createdBy: string;
}

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Iniciar workflow con tareas
   */
  async startWorkflow(config: WorkflowConfig) {
    const workflow = await this.prisma.workflow.create({
      data: {
        tenantId: config.tenantId,
        name: config.name,
        entityType: config.entityType,
        entityId: config.entityId,
        createdBy: config.createdBy,
        status: 'ACTIVE',
        tasks: {
          create: config.steps.map(step => ({
            stepId: step.id,
            name: step.name,
            type: step.type,
            assignedTo: step.assignedTo,
            dueDate: step.dueDate,
            metadata: step.metadata as any,
            status: 'PENDING',
          })),
        },
      },
      include: {
        tasks: true,
      },
    });

    this.logger.log(`Workflow started: ${workflow.id} - ${workflow.name}`);
    return workflow;
  }

  /**
   * Listar workflows activos
   */
  async listWorkflows(tenantId: string, status?: string) {
    return this.prisma.workflow.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        tasks: {
          where: { status: 'PENDING' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener workflow por ID
   */
  async getWorkflow(id: string, tenantId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, tenantId },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }

    return workflow;
  }

  /**
   * Obtener tareas asignadas a un usuario
   */
  async getMyTasks(userId: string, tenantId: string) {
    return this.prisma.workflowTask.findMany({
      where: {
        workflow: { tenantId },
        assignedTo: { has: userId },
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: {
        workflow: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Completar tarea de workflow
   */
  async completeTask(
    taskId: string,
    userId: string,
    tenantId: string,
    result?: any,
  ) {
    const task = await this.prisma.workflowTask.findFirst({
      where: {
        id: taskId,
        workflow: { tenantId },
      },
      include: { workflow: true },
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    // Actualizar tarea
    const updatedTask = await this.prisma.workflowTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completedBy: userId,
        metadata: (result ? { ...(task.metadata as object || {}), result } : task.metadata) as any,
      },
    });

    // Verificar si todas las tareas del workflow están completas
    const pendingTasks = await this.prisma.workflowTask.count({
      where: {
        workflowId: task.workflowId,
        status: { not: 'COMPLETED' },
      },
    });

    // Si no hay tareas pendientes, completar workflow
    if (pendingTasks === 0) {
      await this.prisma.workflow.update({
        where: { id: task.workflowId },
        data: { status: 'COMPLETED' },
      });
    }

    this.logger.log(`Task completed: ${taskId} by ${userId}`);
    return updatedTask;
  }

  /**
   * Cancelar workflow
   */
  async cancelWorkflow(workflowId: string, userId: string, reason: string) {
    const workflow = await this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: 'CANCELLED' },
    });

    // Cancelar todas las tareas pendientes
    await this.prisma.workflowTask.updateMany({
      where: {
        workflowId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Workflow cancelled: ${workflowId} by ${userId}. Reason: ${reason}`);
    return workflow;
  }

  /**
   * Métodos legacy para compatibilidad
   */
  async createWorkflow(createDto: any, tenantId: string) {
    return this.startWorkflow({
      name: createDto.name,
      entityType: createDto.entityType || 'generic',
      entityId: createDto.entityId || 'none',
      tenantId,
      steps: createDto.steps || [],
      createdBy: createDto.createdBy || 'system',
    });
  }

  async advanceWorkflow(workflowId: string, completedBy: string) {
    return {
      workflowId,
      status: 'ADVANCED',
      completedBy,
      advancedAt: new Date(),
    };
  }

  async createApprovalWorkflow(config: any) {
    return this.startWorkflow({
      ...config,
      steps: config.steps || [{
        id: 'approval_step',
        type: WorkflowTaskType.APPROVAL,
        name: 'Aprobar',
        assignedTo: config.approvers || [],
      }],
    });
  }

  async sendNotification(recipientId: string, message: string, metadata?: any) {
    // TODO: Integrar con servicio de notificaciones
    this.logger.log(`Notification sent to ${recipientId}: ${message}`);
    return {
      id: `notif_${Date.now()}`,
      recipientId,
      message,
      metadata,
      sentAt: new Date(),
      status: 'SENT',
    };
  }

  async completeStep(workflowId: string, stepId: string, data: any, tenantId: string) {
    const task = await this.prisma.workflowTask.findFirst({
      where: {
        workflowId,
        stepId,
        workflow: { tenantId },
      },
    });

    if (task) {
      return this.completeTask(task.id, data.userId, tenantId, data);
    }

    return null;
  }

  async getNotifications(workflowId: string, tenantId: string) {
    // Placeholder para sistema de notificaciones
    return {
      notifications: [],
    };
  }
}
