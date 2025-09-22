import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Exportar todos los datos de un tenant en formato JSON
   */
  async exportTenantData(tenantId: string) {
    this.logger.log(`Exportando datos del tenant: ${tenantId}`);

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            position: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        businessProcesses: true,
        biaAssessments: true,
        riskAssessments: true,
        continuityStrategies: true,
        continuityPlans: true,
        testExercises: true,
        complianceFrameworks: true,
        correctiveActions: true,
        documents: true,
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1000,
        },
      },
    });

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        subscriptionPlan: tenant.subscriptionPlan,
        createdAt: tenant.createdAt,
      },
      data: {
        users: tenant.users,
        businessProcesses: tenant.businessProcesses,
        biaAssessments: tenant.biaAssessments,
        riskAssessments: tenant.riskAssessments,
        continuityStrategies: tenant.continuityStrategies,
        continuityPlans: tenant.continuityPlans,
        testExercises: tenant.testExercises,
        complianceFrameworks: tenant.complianceFrameworks,
        correctiveActions: tenant.correctiveActions,
        documents: tenant.documents,
        auditLogs: tenant.auditLogs,
      },
    };

    return exportData;
  }

  /**
   * Crear backup de un tenant antes de eliminarlo
   */
  async createBackup(tenantId: string): Promise<string> {
    this.logger.log(`Creando backup del tenant: ${tenantId}`);

    const exportData = await this.exportTenantData(tenantId);
    const fileName = `backup_${tenantId}_${Date.now()}.json`;
    const filePath = path.join('/tmp', fileName);

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        lastBackupAt: new Date(),
        backupUrl: filePath,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'BACKUP',
        entity: 'Tenant',
        entityId: tenantId,
        details: {
          fileName,
          backupUrl: filePath,
        },
      },
    });

    return filePath;
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleExpiredSubscriptions() {
    this.logger.log('Verificando suscripciones vencidas...');

    const now = new Date();

    const expiredTenants = await this.prisma.tenant.findMany({
      where: {
        subscriptionStatus: 'ACTIVE',
        OR: [
          { trialEndsAt: { lte: now }, subscriptionEndsAt: null },
          { subscriptionEndsAt: { lte: now } },
        ],
      },
    });

    for (const tenant of expiredTenants) {
      const endDate = tenant.subscriptionEndsAt || tenant.trialEndsAt;
      const gracePeriodEndsAt = new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          subscriptionStatus: 'EXPIRED',
          gracePeriodEndsAt,
          scheduledDeletionAt: gracePeriodEndsAt,
        },
      });

      await this.prisma.auditLog.create({
        data: {
          tenantId: tenant.id,
          action: 'SUBSCRIPTION_EXPIRED',
          entity: 'Tenant',
          entityId: tenant.id,
          details: { plan: tenant.subscriptionPlan, gracePeriodEndsAt },
        },
      });

      this.logger.warn(`Tenant ${tenant.name} marcado como EXPIRED`);
    }

    const tenantsToDelete = await this.prisma.tenant.findMany({
      where: {
        subscriptionStatus: 'EXPIRED',
        gracePeriodEndsAt: { lte: now },
      },
    });

    for (const tenant of tenantsToDelete) {
      try {
        const backupPath = await this.createBackup(tenant.id);
        
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { subscriptionStatus: 'DELETED' },
        });

        await this.prisma.auditLog.create({
          data: {
            tenantId: tenant.id,
            action: 'TENANT_DELETED',
            entity: 'Tenant',
            entityId: tenant.id,
            details: { reason: 'Grace period ended', backupPath },
          },
        });

        this.logger.warn(`Tenant ${tenant.name} ELIMINADO`);
      } catch (error) {
        this.logger.error(`Error eliminando tenant ${tenant.id}: ${error.message}`);
      }
    }
  }

  async updateSubscription(tenantId: string, plan: string, months: number = 1) {
    const now = new Date();
    const subscriptionEndsAt = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlan: plan as any,
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt,
        gracePeriodEndsAt: null,
        scheduledDeletionAt: null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'SUBSCRIPTION_UPDATED',
        entity: 'Tenant',
        entityId: tenantId,
        details: { newPlan: plan, months, endsAt: subscriptionEndsAt },
      },
    });

    return tenant;
  }

  async getSubscriptionInfo(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        subscriptionEndsAt: true,
        gracePeriodEndsAt: true,
        scheduledDeletionAt: true,
        lastBackupAt: true,
      },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const now = new Date();
    let daysRemaining = 0;

    if (tenant.subscriptionStatus === 'ACTIVE') {
      const endDate = tenant.subscriptionEndsAt || tenant.trialEndsAt;
      if (endDate) {
        daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    return {
      ...tenant,
      daysRemaining,
      isExpired: tenant.subscriptionStatus === 'EXPIRED',
      isDeleted: tenant.subscriptionStatus === 'DELETED',
    };
  }
}
