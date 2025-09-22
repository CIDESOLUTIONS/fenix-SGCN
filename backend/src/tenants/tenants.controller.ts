import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('subscription')
  async getSubscription(@TenantId() tenantId: string) {
    return this.tenantsService.getSubscriptionInfo(tenantId);
  }

  @Get('export')
  async exportData(@TenantId() tenantId: string) {
    return this.tenantsService.exportTenantData(tenantId);
  }

  @Post('backup')
  async createBackup(@TenantId() tenantId: string) {
    const backupPath = await this.tenantsService.createBackup(tenantId);
    return { success: true, backupPath };
  }

  @Post('subscription/update')
  async updateSubscription(
    @TenantId() tenantId: string,
    @Body() body: { plan: string; months?: number },
  ) {
    return this.tenantsService.updateSubscription(
      tenantId,
      body.plan,
      body.months || 1,
    );
  }
}
