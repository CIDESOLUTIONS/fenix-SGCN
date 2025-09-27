import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { WorkflowEngineService } from './workflow-engine.service';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('workflows')

export class WorkflowEngineController {
  constructor(private readonly workflowService: WorkflowEngineService) {}

  @Post()
  async createWorkflow(@Body() createDto: any, @Request() req: any) {
    return this.workflowService.createWorkflow(createDto, req.user.tenantId);
  }

  @Get()
  async listWorkflows(@Request() req: any) {
    return this.workflowService.listWorkflows(req.user.tenantId);
  }

  @Get('my-tasks')
  async getMyTasks(@Request() req: any) {
    return this.workflowService.getMyTasks(req.user.userId, req.user.tenantId);
  }

  @Get(':id')
  async getWorkflow(@Param('id') id: string, @Request() req: any) {
    return this.workflowService.getWorkflow(id, req.user.tenantId);
  }

  @Get(':id/notifications')
  async getNotifications(@Param('id') id: string, @Request() req: any) {
    return this.workflowService.getNotifications(id, req.user.tenantId);
  }

  @Put(':id/steps/:stepId/complete')
  async completeStep(
    @Param('id') id: string,
    @Param('stepId') stepId: string,
    @Body() data: any,
    @Request() req: any,
  ) {
    return this.workflowService.completeStep(id, stepId, data, req.user.tenantId);
  }
}
