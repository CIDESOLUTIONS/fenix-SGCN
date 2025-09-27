import { Controller, Post, Get, Body, Param , UseGuards } from '@nestjs/common';

import { WorkflowEngineService } from './workflow-engine.service';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('workflows')

export class WorkflowController {
  constructor(private workflowService: WorkflowEngineService) {}

  @Post('start')
  async startWorkflow(@Body() workflowData: any) {
    return this.workflowService.startWorkflow(workflowData);
  }

  @Post(':id/advance')
  async advanceWorkflow(
    @Param('id') workflowId: string,
    @Body() body: { completedBy: string },
  ) {
    // Firma correcta: (workflowId: string, completedBy: string)
    return this.workflowService.advanceWorkflow(
      workflowId,
      body.completedBy,
    );
  }

  @Post('approval')
  async createApprovalWorkflow(@Body() config: any) {
    // Firma correcta: (config: any)
    return this.workflowService.createApprovalWorkflow(config);
  }

  @Post('notify')
  async sendNotification(@Body() body: { recipientId: string; message: string; metadata?: any }) {
    // Firma correcta: (recipientId: string, message: string, metadata?: any)
    return this.workflowService.sendNotification(
      body.recipientId,
      body.message,
      body.metadata,
    );
  }

  @Post(':id/cancel')
  async cancelWorkflow(
    @Param('id') workflowId: string,
    @Body() body: { userId: string; reason: string },
  ) {
    // Firma correcta: (workflowId: string, userId: string, reason: string)
    // Ahora reason es obligatorio
    return this.workflowService.cancelWorkflow(workflowId, body.userId, body.reason || 'Sin razón especificada');
  }
}
