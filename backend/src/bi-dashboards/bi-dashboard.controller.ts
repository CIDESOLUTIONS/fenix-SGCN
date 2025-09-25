import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BIDashboardService } from './bi-dashboard.service';

@Controller('dashboards')
@UseGuards(JwtAuthGuard)
export class BIDashboardController {
  constructor(private biService: BIDashboardService) {}

  @Post()
  async createDashboard(@Body() dashboardData: any) {
    return this.biService.createDashboard(dashboardData);
  }

  @Get('kpis')
  async getKPIs(@Query('tenantId') tenantId: string) {
    return this.biService.getSGCNKPIs(tenantId);
  }

  @Get('ciso')
  async getCISODashboard(@Query('tenantId') tenantId: string) {
    return this.biService.getCISODashboard(tenantId);
  }

  @Get('process-owner')
  async getProcessOwnerDashboard(
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
  ) {
    return this.biService.getProcessOwnerDashboard(tenantId, userId);
  }

  @Get('widgets/:id/data')
  async getWidgetData(
    @Param('id') widgetId: string,
    @Query('tenantId') tenantId: string,
    @Query() params: any,
  ) {
    return this.biService.getWidgetData(widgetId, tenantId, params);
  }

  @Get('risk-heatmap')
  async getRiskHeatmap(@Query('tenantId') tenantId: string) {
    return this.biService.getRiskHeatmap(tenantId);
  }

  @Get('plan-status')
  async getPlanStatus(@Query('tenantId') tenantId: string) {
    return this.biService.getPlanStatusChart(tenantId);
  }
}
