import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export enum WorkflowStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum WorkflowTaskType {
  APPROVAL = 'APPROVAL',
  NOTIFICATION = 'NOTIFICATION',
  REVIEW = 'REVIEW',
  REMINDER = 'REMINDER',
  ESCALATION = 'ESCALATION',
  CUSTOM = 'CUSTOM',
}

export interface WorkflowStep {
  id: string;
  type: WorkflowTaskType;
  name: string;
  assignedTo?: string[];
  dueDate?: Date;
  metadata?: Record<string, any>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  entityType: string;
  entityId: string;
  tenantId: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: WorkflowStatus;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    @InjectQueue('workflow-tasks') private workflowQueue: Queue,
  ) {}

  /**
   * Iniciar un nuevo flujo de trabajo
   */
  async startWorkflow(definition: Omit<WorkflowDefinition, 'id' | 'currentStepIndex' | 'status' | 'createdAt'>): Promise<WorkflowDefinition> {
    const workflow: WorkflowDefinition = {
      ...definition,
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentStepIndex: 0,
      status: WorkflowStatus.PENDING,
      createdAt: new Date(),
    };

    // Encolar la primera tarea
    await this.enqueueCurrentStep(workflow);

    this.logger.log(`Workflow started: ${workflow.id} (${workflow.name})`);
    return workflow;
  }

  /**
   * Encolar el paso actual del workflow
   */
  private async enqueueCurrentStep(workflow: WorkflowDefinition) {
    const currentStep = workflow.steps[workflow.currentStepIndex];
    
    if (!currentStep) {
      this.logger.warn(`No current step found for workflow ${workflow.id}`);
      return;
    }

    await this.workflowQueue.add(
      currentStep.type,
      {
        workflowId: workflow.id,
        step: currentStep,
        tenantId: workflow.tenantId,
        entityType: workflow.entityType,
        entityId: workflow.entityId,
      },
      {
        delay: 0,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    this.logger.log(`Task enqueued: ${currentStep.name} (${currentStep.type})`);
  }

  /**
   * Avanzar al siguiente paso del workflow
   */
  async advanceWorkflow(workflowId: string, approved: boolean, userId: string, comments?: string): Promise<WorkflowDefinition> {
    // En producción, esto debería recuperar el workflow de la BD
    // Por ahora, simulamos el flujo lógico
    
    const workflow = await this.getWorkflow(workflowId);

    if (!approved) {
      workflow.status = WorkflowStatus.REJECTED;
      workflow.completedAt = new Date();
      this.logger.log(`Workflow rejected: ${workflowId} by ${userId}`);
      return workflow;
    }

    workflow.currentStepIndex++;

    if (workflow.currentStepIndex >= workflow.steps.length) {
      workflow.status = WorkflowStatus.COMPLETED;
      workflow.completedAt = new Date();
      this.logger.log(`Workflow completed: ${workflowId}`);
    } else {
      workflow.status = WorkflowStatus.IN_PROGRESS;
      await this.enqueueCurrentStep(workflow);
    }

    return workflow;
  }

  /**
   * Obtener un workflow por ID
   * TODO: Implementar persistencia en PostgreSQL
   */
  async getWorkflow(workflowId: string): Promise<WorkflowDefinition> {
    // Placeholder: En producción recuperar de la BD
    throw new Error('Not implemented: Retrieve from database');
  }

  /**
   * Programar tarea recurrente
   */
  async scheduleRecurringTask(
    name: string,
    cronExpression: string,
    taskData: any,
    tenantId: string,
  ) {
    await this.workflowQueue.add(
      WorkflowTaskType.REMINDER,
      {
        name,
        tenantId,
        ...taskData,
      },
      {
        repeat: {
          cron: cronExpression,
        },
      },
    );

    this.logger.log(`Recurring task scheduled: ${name} (${cronExpression})`);
  }

  /**
   * Enviar notificación
   */
  async sendNotification(
    recipients: string[],
    subject: string,
    message: string,
    tenantId: string,
  ) {
    await this.workflowQueue.add(
      WorkflowTaskType.NOTIFICATION,
      {
        recipients,
        subject,
        message,
        tenantId,
      },
    );

    this.logger.log(`Notification queued: ${subject} to ${recipients.length} recipients`);
  }

  /**
   * Crear flujo de aprobación simple
   */
  async createApprovalWorkflow(
    entityType: string,
    entityId: string,
    approvers: string[],
    tenantId: string,
    createdBy: string,
  ): Promise<WorkflowDefinition> {
    const steps: WorkflowStep[] = approvers.map((approver, index) => ({
      id: `step_${index}`,
      type: WorkflowTaskType.APPROVAL,
      name: `Aprobación nivel ${index + 1}`,
      assignedTo: [approver],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    }));

    return this.startWorkflow({
      name: `Aprobación de ${entityType}`,
      entityType,
      entityId,
      tenantId,
      steps,
      createdBy,
    });
  }

  /**
   * Cancelar un workflow
   */
  async cancelWorkflow(workflowId: string, userId: string, reason?: string): Promise<void> {
    const workflow = await this.getWorkflow(workflowId);
    workflow.status = WorkflowStatus.CANCELLED;
    workflow.completedAt = new Date();

    this.logger.log(`Workflow cancelled: ${workflowId} by ${userId} - Reason: ${reason}`);
  }
}
