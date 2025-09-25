import { Controller, Get, Post, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsEngineService } from './analytics-engine.service';
import { ReportGeneratorService, ReportFormat } from './report-generator.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsEngineService,
    private reportService: ReportGeneratorService,
  ) {}

  @Get('dependencies/:processId')
  async analyzeDependencies(
    @Param('processId') processId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.analyticsService.analyzeDependencies(processId, tenantId);
  }

  @Get('spof')
  async findSPOF(@Query('tenantId') tenantId: string) {
    return this.analyticsService.findSinglePointsOfFailure(tenantId);
  }

  @Get('bia-coverage')
  async getBIACoverage(@Query('tenantId') tenantId: string) {
    return this.analyticsService.analyzeBIACoverage(tenantId);
  }

  @Get('iso-compliance')
  async getISO22301Compliance(@Query('tenantId') tenantId: string) {
    return this.analyticsService.analyzeISO22301Compliance(tenantId);
  }

  @Post('monte-carlo')
  async runMonteCarloSimulation(@Body() body: any) {
    return this.analyticsService.runMonteCarloSimulation(
      body.riskId,
      body.iterations || 10000,
      body.params,
    );
  }

  @Post('reports/management-review')
  async generateManagementReview(
    @Body() body: any,
    @Res() res: Response,
  ) {
    const report = await this.reportService.generateManagementReviewReport(
      body.tenantId,
      body.data,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=management-review.pdf');
    res.send(report);
  }

  @Post('reports/bia')
  async generateBIAReport(
    @Body() body: any,
    @Res() res: Response,
  ) {
    const report = await this.reportService.generateBIAReport(
      body.tenantId,
      body.data,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bia-report.pdf');
    res.send(report);
  }

  @Post('reports/risk-assessment')
  async generateRiskReport(
    @Body() body: any,
    @Res() res: Response,
  ) {
    const report = await this.reportService.generateRiskAssessmentReport(
      body.tenantId,
      body.data,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=risk-assessment.pdf');
    res.send(report);
  }

  @Post('reports/test-exercise/:exerciseId')
  async generateTestExerciseReport(
    @Param('exerciseId') exerciseId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const report = await this.reportService.generateTestExerciseReport(
      body.tenantId,
      exerciseId,
      body.data,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=exercise-${exerciseId}.pdf`);
    res.send(report);
  }
}
