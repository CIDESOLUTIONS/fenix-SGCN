import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    // Contar procesos críticos (RTO < 24 horas)
    const procesosCriticos = await this.prisma.businessProcess.count({
      where: {
        tenantId,
        rto: { lt: 24 },
      },
    });

    // Contar riesgos altos/críticos
    const riesgosAltosCriticos = await this.prisma.riskAssessment.count({
      where: {
        tenantId,
        level: { in: ['HIGH', 'CRITICAL'] },
      },
    });

    // Contar planes desarrollados
    const planesDesarrollados = await this.prisma.continuityPlan.count({
      where: { tenantId },
    });

    // Obtener última prueba
    const ultimaPrueba = await this.prisma.testExercise.findFirst({
      where: { tenantId },
      orderBy: { executedAt: 'desc' },
      select: { executedAt: true },
    });

    // Obtener info de suscripción
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        tenant: { id: tenantId },
        status: 'ACTIVE',
      },
      select: {
        plan: true,
        endDate: true,
      },
    });

    // Calcular días restantes
    const diasRestantes = subscription?.endDate
      ? Math.ceil(
          (new Date(subscription.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      procesosCriticos,
      riesgosAltosCriticos,
      planesDesarrollados,
      ultimaPrueba: ultimaPrueba?.executedAt
        ? new Date(ultimaPrueba.executedAt).toLocaleDateString('es-ES')
        : 'Sin datos',
      planActivo: subscription
        ? `Plan ${subscription.plan} - ${diasRestantes} días restantes`
        : 'Sin plan activo',
    };
  }

  async getCharts(tenantId: string) {
    // Procesos por RTO y área
    const procesosPorArea = await this.prisma.businessProcess.groupBy({
      by: ['department'],
      where: { tenantId },
      _count: { id: true },
      _avg: { rto: true },
    });

    // Matriz de riesgos
    const riesgos = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      select: {
        probability: true,
        impact: true,
        level: true,
      },
    });

    return {
      procesosPorArea: procesosPorArea.map((p) => ({
        area: p.department || 'Sin área',
        count: p._count.id,
        avgRto: Math.round(p._avg.rto || 0),
      })),
      matrizRiesgos: riesgos.map((r) => ({
        probability: r.probability,
        impact: r.impact,
        level: r.level,
      })),
    };
  }
}
