import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    // Contar procesos críticos
    const procesosCriticos = await this.prisma.businessProcess.count({
      where: {
        tenantId,
        criticalityLevel: { in: ['CRITICAL', 'HIGH'] },
      },
    });

    // Contar riesgos altos/críticos basado en scoreAfter o scoreBefore
    const riesgosAltosCriticos = await this.prisma.riskAssessment.count({
      where: {
        tenantId,
        OR: [
          { scoreAfter: { gte: 15 } },
          { scoreBefore: { gte: 15 } }
        ]
      },
    });

    // Contar planes desarrollados
    const planesDesarrollados = await this.prisma.continuityPlan.count({
      where: { tenantId },
    });

    // Obtener última prueba
    const ultimaPrueba = await this.prisma.testExercise.findFirst({
      where: { tenantId },
      orderBy: { executedDate: 'desc' },
      select: { executedDate: true },
    });

    // Obtener info de tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { 
        name: true,
        subscriptionPlan: true,
        subscriptionEndsAt: true,
      },
    });

    // Calcular días restantes de suscripción
    const diasRestantes = tenant?.subscriptionEndsAt
      ? Math.ceil(
          (new Date(tenant.subscriptionEndsAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      procesosCriticos,
      riesgosAltosCriticos,
      planesDesarrollados,
      ultimaPrueba: ultimaPrueba?.executedDate
        ? new Date(ultimaPrueba.executedDate).toLocaleDateString('es-ES')
        : 'Sin datos',
      planActivo: tenant
        ? `Plan ${tenant.subscriptionPlan} - ${Math.max(0, diasRestantes)} días restantes`
        : 'Sin plan activo',
    };
  }

  async getCharts(tenantId: string) {
    // Procesos por departamento
    const procesosPorArea = await this.prisma.businessProcess.groupBy({
      by: ['department'],
      where: { tenantId },
      _count: { id: true },
    });

    // Riesgos con probabilidad e impacto
    const riesgos = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      select: {
        probabilityAfter: true,
        impactAfter: true,
        scoreAfter: true,
      },
    });

    return {
      procesosPorArea: procesosPorArea.map((p) => ({
        area: p.department || 'Sin área',
        count: p._count.id,
        avgRto: 12,
      })),
      matrizRiesgos: riesgos.map((r) => ({
        probability: r.probabilityAfter || 3,
        impact: r.impactAfter || 3,
        level: r.scoreAfter ? (Number(r.scoreAfter) >= 15 ? 'HIGH' : 'MEDIUM') : 'LOW',
      })),
    };
  }
}
