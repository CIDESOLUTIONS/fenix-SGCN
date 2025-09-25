import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkflowEngineService } from './workflow-engine.service';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(private workflowService: WorkflowEngineService) {}

  @Post('start')
  async startWorkflow(@Body() workflowData: any) {
    return this.workflowService.startWorkflow(workflowData);
  }

  @Post(':id/advance')
  async advanceWorkflow(
    @Param('id') workflowId: string,
    @Body() body: { approved: boolean; userId: string; comments?: string },
  ) {
    return this.workflowService.advanceWorkflow(
      workflowId,
      body.approved,
      body.userId,
      body.comments,
    );
  }

  @Post('approval')
  async createApprovalWorkflow(@Body() body: any) {
    return this.workflowService.createApprovalWorkflow(
      body.entityType,
      body.entityId,
      body.approvers,
      body.tenantId,
      body.createdBy,
    );
  }

  @Post('notify')
  async sendNotification(@Body() body: any) {
    return this.workflowService.sendNotification(
      body.recipients,
      body.subject,
      body.message,
      body.tenantId,
    );
  }

  @Post(':id/cancel')
  async cancelWorkflow(
    @Param('id') workflowId: string,
    @Body() body: { userId: string; reason?: string },
  ) {
    return this.workflowService.cancelWorkflow(workflowId, body.userId, body.reason);
  }
}
