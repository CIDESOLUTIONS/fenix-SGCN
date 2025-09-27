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
  Query,
} from '@nestjs/common';

import { ContinuousImprovementService } from './continuous-improvement.service';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('continuous-improvement')

export class ContinuousImprovementController {
  constructor(
    private readonly continuousImprovementService: ContinuousImprovementService,
  ) {}

  // ========== Hallazgos (Findings) ==========

  @Post('findings')
  createFinding(
    @Body() createDto: any,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuousImprovementService.createFinding(
      createDto,
      tenantId,
      req.user.id, // ✅ Correcto: req.user.id (no userId)
    );
  }

  @Get('findings')
  findAll(@TenantId() tenantId: string, @Query() filters?: any) {
    return this.continuousImprovementService.findAll(tenantId, filters);
  }

  @Get('findings/:id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuousImprovementService.findOne(id, tenantId);
  }

  @Patch('findings/:id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: any,
    @Request() req: any,
  ) {
    return this.continuousImprovementService.update(id, tenantId, updateDto, req.user.userId);
  }

  @Delete('findings/:id')
  remove(@Param('id') id: string, @TenantId() tenantId: string, @Request() req: any) {
    return this.continuousImprovementService.remove(id, tenantId, req.user.userId);
  }

  // ========== Acciones Correctivas (CAPA) ==========

  @Post('findings/:findingId/corrective-actions')
  createCorrectiveAction(
    @Param('findingId') findingId: string,
    @TenantId() tenantId: string,
    @Body() createDto: any,
    @Request() req: any,
  ) {
    return this.continuousImprovementService.createCorrectiveAction(
      findingId,
      tenantId,
      createDto,
      req.user.userId,
    );
  }

  @Patch('corrective-actions/:actionId/status')
  updateActionStatus(
    @Param('actionId') actionId: string,
    @TenantId() tenantId: string,
    @Body() body: { status: string; notes: string },
    @Request() req: any,
  ) {
    return this.continuousImprovementService.updateActionStatus(
      actionId,
      tenantId,
      body.status,
      body.notes,
      req.user.userId,
    );
  }

  // ========== Root Cause Analysis ==========

  @Post('findings/:findingId/root-cause-analysis')
  performRootCauseAnalysis(
    @Param('findingId') findingId: string,
    @TenantId() tenantId: string,
    @Body() rcaData: any,
  ) {
    return this.continuousImprovementService.performRootCauseAnalysis(
      findingId,
      tenantId,
      rcaData,
    );
  }

  // ========== Management Review ==========

  @Get('management-review/dashboard')
  getManagementReviewDashboard(@TenantId() tenantId: string, @Query('period') period?: string) {
    return this.continuousImprovementService.getManagementReviewDashboard(tenantId, period);
  }

  @Get('management-review/report')
  generateManagementReviewReport(@TenantId() tenantId: string) {
    return this.continuousImprovementService.generateManagementReviewReport(tenantId);
  }

  // ========== KPIs ==========

  @Get('kpis')
  getKPIs(@TenantId() tenantId: string) {
    return this.continuousImprovementService.getKPIs(tenantId);
  }

  // ========== Tendencias ==========

  @Get('trends')
  getImprovementTrends(@TenantId() tenantId: string, @Query('months') months?: string) {
    return this.continuousImprovementService.getImprovementTrends(
      tenantId,
      months ? parseInt(months) : 12,
    );
  }

  // ========== Integración con Ejercicios ==========

  @Post('exercises/:exerciseId/convert-gap')
  convertGapToFinding(
    @Param('exerciseId') exerciseId: string,
    @TenantId() tenantId: string,
    @Body() gap: any,
    @Request() req: any,
  ) {
    return this.continuousImprovementService.convertGapToFinding(
      exerciseId,
      gap,
      tenantId,
      req.user.userId,
    );
  }
}
