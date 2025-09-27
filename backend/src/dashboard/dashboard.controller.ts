import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    const { tenantId } = req.user;
    return this.dashboardService.getStats(tenantId);
  }

  @Get('charts')
  async getCharts(@Request() req) {
    const { tenantId } = req.user;
    return this.dashboardService.getCharts(tenantId);
  }
}
