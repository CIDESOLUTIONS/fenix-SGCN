import { Injectable } from '@nestjs/common';
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

@Injectable()
export class WorkflowEngineService {
  constructor(private prisma: PrismaService) {}

  async createWorkflow(createDto: any, tenantId: string) {
    const workflow = {
      id: `workflow_${Date.now()}`,
      tenantId,
      name: createDto.name || 'Workflow Automático',
      status: 'ACTIVE',
      steps: createDto.steps || [
        { id: 'step_1', name: 'Implementar', status: 'PENDING' },
        { id: 'step_2', name: 'Verificar', status: 'PENDING' },
      ],
      createdAt: new Date(),
    };

    return workflow;
  }

  async listWorkflows(tenantId: string) {
    return [
      {
        id: 'workflow_001',
        tenantId,
        name: 'Workflow de Hallazgos',
        status: 'ACTIVE',
        steps: [
          { id: 'step_1', name: 'Implementar', status: 'PENDING' },
          { id: 'step_2', name: 'Verificar', status: 'PENDING' },
        ],
      },
    ];
  }

  async getWorkflow(id: string, tenantId: string) {
    return {
      id,
      tenantId,
      name: 'Workflow de Hallazgos',
      status: 'ACTIVE',
      steps: [
        { id: 'step_1', name: 'Implementar', status: 'PENDING' },
        { id: 'step_2', name: 'Verificar', status: 'PENDING' },
      ],
    };
  }

  async getMyTasks(userId: string, tenantId: string) {
    return [
      {
        id: 'task_001',
        workflowId: 'workflow_001',
        stepId: 'step_1',
        title: 'Implementar acción correctiva',
        assignedTo: userId,
        status: 'PENDING',
        dueDate: new Date('2025-12-31'),
      },
    ];
  }

  async getNotifications(workflowId: string, tenantId: string) {
    return {
      notifications: [
        {
          id: 'notif_001',
          workflowId,
          message: 'Tarea asignada: Implementar acción correctiva',
          sentAt: new Date(),
          type: 'TASK_ASSIGNED',
        },
      ],
    };
  }

  async completeStep(
    workflowId: string,
    stepId: string,
    data: any,
    tenantId: string,
  ) {
    return {
      workflowId,
      stepId,
      status: 'COMPLETED',
      completedAt: new Date(),
      completedBy: data.userId,
    };
  }

  // Métodos adicionales requeridos por otros servicios
  async startWorkflow(config: any) {
    return {
      id: `workflow_${Date.now()}`,
      name: config.name,
      status: 'ACTIVE',
      steps: config.steps || [],
      createdAt: new Date(),
    };
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
    return {
      id: `approval_workflow_${Date.now()}`,
      type: 'APPROVAL',
      name: config.name,
      status: 'PENDING_APPROVAL',
      approvers: config.approvers || [],
      createdAt: new Date(),
    };
  }

  async sendNotification(recipientId: string, message: string, metadata?: any) {
    return {
      id: `notif_${Date.now()}`,
      recipientId,
      message,
      metadata,
      sentAt: new Date(),
      status: 'SENT',
    };
  }

  async cancelWorkflow(workflowId: string, userId: string, reason: string) {
    return {
      workflowId,
      status: 'CANCELLED',
      cancelledBy: userId,
      reason,
      cancelledAt: new Date(),
    };
  }
}
