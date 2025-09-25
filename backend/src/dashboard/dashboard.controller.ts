import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    // Por ahora usamos un tenantId fijo o del header
    const tenantId = req.headers['x-tenant-id'] || 'default-tenant';
    return this.dashboardService.getStats(tenantId);
  }

  @Get('charts')
  async getCharts(@Request() req: any) {
    const tenantId = req.headers['x-tenant-id'] || 'default-tenant';
    return this.dashboardService.getCharts(tenantId);
  }
}
