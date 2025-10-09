import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { RiskAssessmentsService } from './risk-assessments.service';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('risk-assessments')

export class RiskAssessmentsController {
  constructor(private readonly riskAssessmentsService: RiskAssessmentsService) {}

  @Post()
  create(
    @Body() createRiskAssessmentDto: CreateRiskAssessmentDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.create(
      createRiskAssessmentDto,
      tenantId,
      req.user.userId,
    );
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.findAll(tenantId);
  }

  @Get('heatmap')
  getRiskHeatmap(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.getRiskHeatmap(tenantId);
  }

  @Get('critical')
  getCriticalRisks(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.getCriticalRisks(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.riskAssessmentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateRiskAssessmentDto: UpdateRiskAssessmentDto,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.update(
      id,
      tenantId,
      updateRiskAssessmentDto,
      req.user.userId,
    );
  }

  @Post(':id/link-process')
  linkToProcess(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
    @Body() body: { processId: string },
  ) {
    return this.riskAssessmentsService.linkToProcess(
      riskId,
      body.processId,
      tenantId,
    );
  }

  @Post(':id/monte-carlo')
  runMonteCarloSimulation(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
    @Body()
    params: {
      impactMin: number;
      impactMost: number;
      impactMax: number;
      probabilityMin: number;
      probabilityMax: number;
      iterations?: number;
    },
  ) {
    return this.riskAssessmentsService.runMonteCarloSimulation(
      riskId,
      tenantId,
      params,
    );
  }

  @Post(':id/treatment-plan')
  createTreatmentPlan(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
    @Body()
    treatment: {
      strategy: 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';
      actions: Array<{
        description: string;
        assignee: string;
        dueDate: string;
      }>;
      owner: string;
    },
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.createTreatmentPlan(
      riskId,
      tenantId,
      treatment,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.remove(id, tenantId, req.user.userId);
  }
}
  @Get('spof-analysis')
  async getSPOFAnalysis(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.analyzeSPOF(tenantId);
  }

  @Get(':id/impact-cascade')
  async getImpactCascade(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
  ) {
    return this.riskAssessmentsService.calculateImpactCascade(riskId, tenantId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.remove(id, tenantId, req.user.userId);
  }
}
  @Post(':id/request-approval')
  async requestApproval(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.requestApproval(riskId, tenantId, req.user.userId);
  }

  @Post(':id/approve-reject')
  async approveOrReject(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
    @Body() body: { action: 'APPROVE' | 'REJECT'; comments: string },
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.approveOrReject(
      riskId,
      tenantId,
      body.action,
      body.comments,
      req.user.userId,
    );
  }

  @Post(':id/link-process')
  async linkToProcess(
    @Param('id') riskId: string,
    @Body() body: { processId: string },
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.riskAssessmentsService.linkToProcess(
      riskId,
      body.processId,
      tenantId,
      req.user.userId,
    );
  }

  @Get('process/:processId')
  async getRisksByProcess(
    @Param('processId') processId: string,
    @TenantId() tenantId: string,
  ) {
    return this.riskAssessmentsService.getRisksByProcess(processId, tenantId);
  }

  @Get('spof-analysis')
  async getSPOFAnalysis(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.analyzeSPOF(tenantId);
  }

  @Get(':id/impact-cascade')
  async getImpactCascade(
    @Param('id') riskId: string,
    @TenantId() tenantId: string,
  ) {
    return this.riskAssessmentsService.calculateImpactCascade(riskId, tenantId);
  }

  @Delete(':id')
  remove(
