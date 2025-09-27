import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BiDashboardService {
  constructor(private prisma: PrismaService) {}

  // ========== MÉTODOS PRINCIPALES ==========

  async getMainDashboard(tenantId: string, filters?: any) {
    const totalProcesses = await this.prisma.businessProcess.count({
      where: { tenantId },
    });

    const totalRisks = await this.prisma.riskAssessment.count({
      where: { tenantId },
    });

    const totalFindings = await this.prisma.finding.count({
      where: { tenantId },
    });

    const totalExercises = await this.prisma.testExercise.count({
      where: { tenantId },
    });

    let filteredProcesses: any[] = [];
    if (filters?.criticalityLevel || filters?.department) {
      filteredProcesses = await this.prisma.businessProcess.findMany({
        where: {
          tenantId,
          ...(filters.criticalityLevel && {
            criticalityLevel: filters.criticalityLevel,
          }),
          ...(filters.department && { department: filters.department }),
        },
      });
    }

    return {
      summary: {
        totalProcesses,
        totalRisks,
        totalFindings,
        totalExercises,
      },
      ...(filteredProcesses.length > 0 && { filteredProcesses }),
    };
  }

  // Alias para compatibilidad con controlador antiguo
  async getCISODashboard(tenantId: string) {
    return this.getMainDashboard(tenantId);
  }

  async getKPIs(tenantId: string) {
    const totalProcesses = await this.prisma.businessProcess.count({
      where: { tenantId },
    });

    const processesWithBIA = await this.prisma.biaAssessment.count({
      where: { tenantId },
    });

    const biaCoverage = totalProcesses > 0 
      ? (processesWithBIA / totalProcesses) * 100 
      : 0;

    const totalRisks = await this.prisma.riskAssessment.count({
      where: { tenantId },
    });

    const treatedRisks = await this.prisma.riskAssessment.count({
      where: {
        tenantId,
        probabilityAfter: { not: null },
      },
    });

    const riskTreatmentRate = totalRisks > 0 
      ? (treatedRisks / totalRisks) * 100 
      : 0;

    const totalPlans = await this.prisma.continuityPlan.count({
      where: { tenantId },
    });

    const totalExercises = await this.prisma.testExercise.count({
      where: { tenantId },
    });

    const testSuccessRate = totalPlans > 0 && totalExercises > 0
      ? (totalExercises / totalPlans) * 100 
      : 0;

    return {
      biaCoverage: Math.round(biaCoverage * 10) / 10,
      riskTreatmentRate: Math.round(riskTreatmentRate * 10) / 10,
      testSuccessRate: Math.round(testSuccessRate * 10) / 10,
      totalActiveActions: await this.prisma.correctiveAction.count({
        where: { tenantId, status: 'OPEN' },
      }),
    };
  }

  // Alias para compatibilidad
  async getSGCNKPIs(tenantId: string) {
    return this.getKPIs(tenantId);
  }

  async getCharts(tenantId: string) {
    const risks = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      select: {
        probabilityBefore: true,
        impactBefore: true,
      },
    });

    const biaData = await this.prisma.biaAssessment.findMany({
      where: { tenantId },
      select: {
        rto: true,
        rpo: true,
      },
    });

    return {
      riskHeatmap: this.generateHeatmap(risks),
      biaCoverageChart: {
        total: await this.prisma.businessProcess.count({ where: { tenantId } }),
        covered: biaData.length,
      },
    };
  }

  // Métodos específicos para charts
  async getRiskHeatmap(tenantId: string) {
    const risks = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      select: {
        probabilityBefore: true,
        impactBefore: true,
      },
    });
    return this.generateHeatmap(risks);
  }

  async getPlanStatusChart(tenantId: string) {
    const total = await this.prisma.continuityPlan.count({ where: { tenantId } });
    const biaData = await this.prisma.biaAssessment.findMany({
      where: { tenantId },
    });
    return {
      total,
      covered: biaData.length,
    };
  }

  // ========== BÚSQUEDA GLOBAL ==========

  async globalSearch(query: string, tenantId: string) {
    const [processes, risks, plans] = await Promise.all([
      this.prisma.businessProcess.findMany({
        where: {
          tenantId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.riskAssessment.findMany({
        where: {
          tenantId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.continuityPlan.findMany({
        where: {
          tenantId,
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
      }),
    ]);

    return {
      processes,
      risks,
      plans,
    };
  }

  // ========== EJERCICIOS ==========

  async getExercises(tenantId: string, filters?: any) {
    const where: any = { tenantId };

    if (filters?.startDate && filters?.endDate) {
      where.scheduledDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return this.prisma.testExercise.findMany({ where });
  }

  // ========== DASHBOARDS ESPECÍFICOS POR ROL ==========

  async getProcessOwnerDashboard(tenantId: string, userId: string) {
    // Obtener procesos donde el usuario es responsable
    const ownedProcesses = await this.prisma.businessProcess.findMany({
      where: {
        tenantId,
        // Buscar por responsable en matriz RACI
        OR: [
          { raciResponsibleEmail: userId },
          { raciAccountableEmail: userId },
        ],
      },
      include: {
        biaAssessments: true,
        riskAssessments: true,
      },
    });

    return {
      ownedProcesses,
      totalProcesses: ownedProcesses.length,
      processesWithBIA: ownedProcesses.filter(p => p.biaAssessments.length > 0).length,
      highRisks: ownedProcesses.filter(p => 
        p.riskAssessments.some(r => r.scoreBefore && r.scoreBefore.toNumber() > 15)
      ).length,
    };
  }

  // ========== WIDGETS ==========

  async getWidgetData(widgetId: string, tenantId: string, params?: any) {
    switch (widgetId) {
      case 'risk-summary':
        return this.getRiskHeatmap(tenantId);
      case 'bia-coverage':
        return this.getPlanStatusChart(tenantId);
      case 'kpis':
        return this.getKPIs(tenantId);
      default:
        return { message: 'Widget no encontrado' };
    }
  }

  // ========== CREACIÓN DE DASHBOARDS ==========

  async createDashboard(dashboardData: any) {
    // Implementación básica - crear dashboard personalizado
    return {
      id: `dashboard_${Date.now()}`,
      name: dashboardData.name || 'Nuevo Dashboard',
      widgets: dashboardData.widgets || [],
      createdAt: new Date(),
    };
  }

  // ========== EXPORTACIÓN ==========

  async exportPDF(tenantId: string) {
    return {
      pdfUrl: `/exports/dashboard-${tenantId}-${Date.now()}.pdf`,
      generatedAt: new Date(),
    };
  }

  async exportExcel(tenantId: string) {
    return {
      excelUrl: `/exports/dashboard-${tenantId}-${Date.now()}.xlsx`,
      generatedAt: new Date(),
    };
  }

  async exportView(viewConfig: any, tenantId: string) {
    return {
      downloadUrl: `/exports/view-${tenantId}-${Date.now()}.${viewConfig.format || 'pdf'}`,
      generatedAt: new Date(),
    };
  }

  // ========== MÉTODOS AUXILIARES ==========

  private generateHeatmap(risks: any[]) {
    const matrix = Array(5).fill(0).map(() => Array(5).fill(0));
    
    risks.forEach((risk) => {
      const likelihood = Math.min(risk.probabilityBefore || 1, 5) - 1;
      const impact = Math.min(risk.impactBefore || 1, 5) - 1;
      matrix[likelihood][impact]++;
    });

    return matrix;
  }
}
