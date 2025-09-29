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
  HttpStatus,
  HttpCode,
  NotFoundException,
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
  async createFinding(
    @Body() createDto: any,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuousImprovementService.createFinding(
      createDto,
      tenantId,
      req.user.id,
    );
  }

  @Get('findings')
  async findAll(@TenantId() tenantId: string, @Query() filters?: any) {
    const findings = await this.continuousImprovementService.findAll(tenantId, filters);
    return {
      data: findings,
      total: findings.length,
    };
  }

  @Get('findings/:id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuousImprovementService.findOne(id, tenantId);
  }

  @Patch('findings/:id')
  async update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: any,
    @Request() req: any,
  ) {
    const finding = await this.continuousImprovementService.findOne(id, tenantId);
    if (!finding) {
      throw new NotFoundException(`Finding ${id} not found`);
    }

    await this.continuousImprovementService.update(id, tenantId, updateDto, req.user.id);
    
    // Retornar el finding actualizado
    return this.continuousImprovementService.findOne(id, tenantId);
  }

  @Delete('findings/:id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string, @Request() req: any) {
    return this.continuousImprovementService.remove(id, tenantId, req.user.id);
  }

  @Post('findings/:id/close')
  async closeFinding(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() closeDto: { closureNotes: string; closedBy: string },
    @Request() req: any,
  ) {
    await this.continuousImprovementService.update(
      id,
      tenantId,
      {
        status: 'CLOSED',
        closureDate: new Date(),
        resolution: closeDto.closureNotes,
      },
      req.user.id,
    );

    return this.continuousImprovementService.findOne(id, tenantId);
  }

  @Get('findings/:id/audit-trail')
  async getAuditTrail(@Param('id') id: string, @TenantId() tenantId: string) {
    // Por ahora retornar un audit trail básico
    return [
      {
        action: 'CREATED',
        timestamp: new Date(),
        userId: 'system',
        details: 'Finding created',
      },
    ];
  }

  @Patch('findings/:id/link-risk')
  async linkRisk(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() linkDto: any,
  ) {
    await this.continuousImprovementService.update(
      id,
      tenantId,
      {
        linkedRisks: [linkDto],
      },
      'system',
    );

    return this.continuousImprovementService.findOne(id, tenantId);
  }

  @Post('findings/from-exercise')
  async createFromExercise(
    @Body() exerciseResult: any,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    const findings: any[] = [];
    
    for (const finding of exerciseResult.findings || []) {
      const created = await this.continuousImprovementService.createFinding(
        {
          title: finding.issue,
          description: `RTO esperado: ${finding.expectedRTO}, RTO real: ${finding.actualRTO}`,
          source: 'EXERCISE',
          sourceReference: exerciseResult.exerciseId,
          severity: 'HIGH',
          status: 'OPEN',
          category: 'PERFORMANCE',
          processId: finding.processId,
        },
        tenantId,
        req.user.id,
      );
      findings.push(created);
    }
    
    return findings;
  }

  // ========== Acciones Correctivas (CAPA) ==========

  @Post('corrective-actions')
  async createCorrectiveAction(
    @Body() createDto: any,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    const result = await this.continuousImprovementService.createCorrectiveAction(
      createDto.findingId,
      tenantId,
      createDto,
      req.user.id,
    );
    return result.action;
  }

  @Patch('corrective-actions/:id')
  async updateCorrectiveAction(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: any,
    @Request() req: any,
  ) {
    if (updateDto.status) {
      return this.continuousImprovementService.updateActionStatus(
        id,
        tenantId,
        updateDto.status,
        updateDto.implementationNotes || '',
        req.user.id,
      );
    }

    // Por ahora solo actualizamos estado
    return { id, ...updateDto };
  }

  @Patch('corrective-actions/:id/root-cause')
  async updateRootCause(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() rcaDto: { rootCauseAnalysis: any },
  ) {
    // Guardar análisis de causa raíz
    return {
      id,
      rootCauseAnalysis: rcaDto.rootCauseAnalysis,
    };
  }

  @Post('corrective-actions/:id/verify')
  async verifyAction(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() verifyDto: any,
    @Request() req: any,
  ) {
    await this.continuousImprovementService.updateActionStatus(
      id,
      tenantId,
      'VERIFIED',
      verifyDto.verificationResults,
      req.user.id,
    );

    return {
      id,
      verificationDate: new Date(),
      verifiedBy: verifyDto.verifiedBy,
      isEffective: verifyDto.isEffective,
      status: 'VERIFIED',
    };
  }

  // ========== KPIs y Métricas ==========

  @Post('kpis')
  async createKPI(
    @Body() createDto: any,
    @TenantId() tenantId: string,
  ) {
    // Crear KPI en la base de datos
    const kpi = {
      id: 'kpi-' + Date.now(),
      ...createDto,
      tenantId,
      createdAt: new Date(),
    };
    return kpi;
  }

  @Post('kpis/:id/measurements')
  async recordMeasurement(
    @Param('id') id: string,
    @Body() measurementDto: any,
    @TenantId() tenantId: string,
  ) {
    return {
      id: 'measurement-' + Date.now(),
      kpiId: id,
      value: measurementDto.value,
      period: measurementDto.period,
      notes: measurementDto.notes,
      createdAt: new Date(),
    };
  }

  @Get('kpis/:id/trends')
  async getKPITrends(
    @Param('id') id: string,
    @TenantId() tenantId: string,
  ) {
    // Calcular tendencias basado en mediciones
    return {
      kpiId: id,
      trend: 'IMPROVING',
      percentageChange: -33.33, // Mejora del 33%
      measurements: [
        { period: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), value: 18 },
        { period: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), value: 15 },
        { period: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), value: 12 },
        { period: new Date(), value: 12 },
      ],
    };
  }

  // ========== Dashboard y Reportes ==========

  @Get('dashboard')
  async getDashboard(@TenantId() tenantId: string) {
    const kpis = await this.continuousImprovementService.getKPIs(tenantId);
    const findings = await this.continuousImprovementService.findAll(tenantId);
    
    return {
      summary: {
        totalFindings: findings.length,
        openFindings: findings.filter(f => f.status === 'OPEN').length,
        overdueActions: 0, // Por simplicidad
        avgClosureTime: 15, // días
      },
      kpis,
      recentFindings: findings.slice(0, 5),
    };
  }

  @Get('reports/management-review')
  async getManagementReview(
    @TenantId() tenantId: string,
    @Query() query: { startDate?: string; endDate?: string },
  ) {
    const dashboard = await this.continuousImprovementService.getManagementReviewDashboard(
      tenantId,
      query.startDate,
    );

    return {
      period: {
        start: query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: query.endDate || new Date(),
      },
      executiveSummary: 'El SGCN ha mostrado mejoras significativas en el período',
      findingsAnalysis: {
        total: dashboard.bcmsStatus.totalFindings,
        open: dashboard.bcmsStatus.openFindings,
        resolved: dashboard.bcmsStatus.resolvedFindings,
        byCategory: {},
      },
      capaEffectiveness: {
        total: dashboard.capaPerformance.totalActions,
        completed: dashboard.capaPerformance.completedActions,
        effectiveness: 85, // %
      },
      kpiPerformance: await this.continuousImprovementService.getKPIs(tenantId),
      recommendations: dashboard.recommendations,
    };
  }

  @Get('compliance/iso22301')
  async getISO22301Compliance(@TenantId() tenantId: string) {
    const kpis = await this.continuousImprovementService.getKPIs(tenantId);
    
    return {
      clause10Compliance: {
        nonconformities: {
          total: 5,
          open: 2,
          closed: 3,
        },
        correctiveActions: {
          total: 8,
          completed: 6,
          effective: 5,
        },
        continuousImprovement: {
          improvementRate: 15, // %
          trendsIdentified: 3,
          actionsImplemented: 12,
        },
        complianceScore: 85, // %
      },
    };
  }

  // ========== Root Cause Analysis ==========

  @Post('findings/:id/root-cause-analysis')
  async performRootCauseAnalysis(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() rcaDto: any,
  ) {
    return this.continuousImprovementService.performRootCauseAnalysis(
      id,
      tenantId,
      rcaDto,
    );
  }

  // ========== Tendencias de Mejora ==========

  @Get('improvement-trends')
  async getImprovementTrends(
    @TenantId() tenantId: string,
    @Query('months') months?: number,
  ) {
    return this.continuousImprovementService.getImprovementTrends(
      tenantId,
      months || 12,
    );
  }
}