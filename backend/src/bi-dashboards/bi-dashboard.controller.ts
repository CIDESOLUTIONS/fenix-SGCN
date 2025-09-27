import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';

import { BiDashboardService } from './bi-dashboard.service';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('bi-dashboard')

export class BIDashboardController {
  constructor(private biService: BiDashboardService) {}

  @Get('main')
  async getMainDashboard(
    @Request() req: any,
    @Query('criticalityLevel') criticalityLevel?: string,
    @Query('department') department?: string,
  ) {
    return this.biService.getCISODashboard(req.user.tenantId);
  }

  @Get('kpis')
  async getKPIs(@Request() req: any) {
    return this.biService.getSGCNKPIs(req.user.tenantId);
  }

  @Get('charts')
  async getCharts(@Request() req: any) {
    return {
      riskHeatmap: await this.biService.getRiskHeatmap(req.user.tenantId),
      biaCoverageChart: await this.biService.getPlanStatusChart(req.user.tenantId),
    };
  }

  @Get('global-search')
  async globalSearch(@Query('q') query: string, @Request() req: any) {
    return this.biService.globalSearch(query, req.user.tenantId);
  }

  @Get('exercises')
  async getExercises(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.biService.getExercises(req.user.tenantId, { startDate, endDate });
  }

  @Get('export/pdf')
  async exportPDF(@Request() req: any) {
    return {
      pdfUrl: `/exports/dashboard-${req.user.tenantId}-${Date.now()}.pdf`,
      generatedAt: new Date(),
    };
  }

  @Get('export/excel')
  async exportExcel(@Request() req: any) {
    return {
      excelUrl: `/exports/dashboard-${req.user.tenantId}-${Date.now()}.xlsx`,
      generatedAt: new Date(),
    };
  }

  @Post('export/view')
  async exportView(@Body() viewConfig: any, @Request() req: any) {
    return {
      downloadUrl: `/exports/view-${req.user.tenantId}-${Date.now()}.${viewConfig.format || 'pdf'}`,
      generatedAt: new Date(),
    };
  }

  // Endpoints originales
  @Post()
  async createDashboard(@Body() dashboardData: any) {
    return this.biService.createDashboard(dashboardData);
  }

  @Get('ciso')
  async getCISODashboard(@Request() req: any) {
    return this.biService.getCISODashboard(req.user.tenantId);
  }

  @Get('process-owner')
  async getProcessOwnerDashboard(@Request() req: any) {
    return this.biService.getProcessOwnerDashboard(req.user.tenantId, req.user.userId);
  }

  @Get('widgets/:id/data')
  async getWidgetData(
    @Param('id') widgetId: string,
    @Request() req: any,
    @Query() params: any,
  ) {
    return this.biService.getWidgetData(widgetId, req.user.tenantId, params);
  }

  @Get('risk-heatmap')
  async getRiskHeatmap(@Request() req: any) {
    return this.biService.getRiskHeatmap(req.user.tenantId);
  }

  @Get('plan-status')
  async getPlanStatus(@Request() req: any) {
    return this.biService.getPlanStatusChart(req.user.tenantId);
  }
}
