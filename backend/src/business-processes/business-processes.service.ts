import { Injectable } from '@nestjs/common';
import { CreateBusinessProcessDto } from './dto/create-business-process.dto';
import { UpdateBusinessProcessDto } from './dto/update-business-process.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessProcessesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcular el score de priorización basado en los criterios
   */
  private calculatePriorityScore(criteria?: {
    strategic?: number;
    operational?: number;
    financial?: number;
    regulatory?: number;
  }): number | null {
    if (!criteria) return null;

    const { strategic = 0, operational = 0, financial = 0, regulatory = 0 } = criteria;

    // Pesos predefinidos (se pueden ajustar)
    const weights = {
      strategic: 0.30,    // 30%
      operational: 0.30,  // 30%
      financial: 0.25,    // 25%
      regulatory: 0.15,   // 15%
    };

    const score =
      strategic * weights.strategic +
      operational * weights.operational +
      financial * weights.financial +
      regulatory * weights.regulatory;

    return parseFloat(score.toFixed(2));
  }

  async create(createBusinessProcessDto: CreateBusinessProcessDto, tenantId: string) {
    // Calcular el priority score
    const priorityScore = this.calculatePriorityScore(
      createBusinessProcessDto.prioritizationCriteria as any
    );

    return this.prisma.businessProcess.create({
      data: {
        ...createBusinessProcessDto,
        priorityScore,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.businessProcess.findMany({
      where: { tenantId },
      include: {
        biaAssessments: true,
        riskAssessments: true,
        strategies: true,
        plans: true,
      },
      orderBy: [
        { priorityScore: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Obtener solo los procesos incluidos en análisis de continuidad
   */
  async findForContinuityAnalysis(tenantId: string) {
    return this.prisma.businessProcess.findMany({
      where: {
        tenantId,
        includeInContinuityAnalysis: true,
      },
      orderBy: [
        { priorityScore: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.businessProcess.findFirst({
      where: { id, tenantId },
      include: {
        biaAssessments: true,
        riskAssessments: true,
        strategies: true,
        plans: true,
      },
    });
  }

  async update(id: string, tenantId: string, updateBusinessProcessDto: UpdateBusinessProcessDto) {
    // Recalcular el priority score si se actualizan los criterios
    const priorityScore = updateBusinessProcessDto.prioritizationCriteria
      ? this.calculatePriorityScore(updateBusinessProcessDto.prioritizationCriteria as any)
      : undefined;

    return this.prisma.businessProcess.updateMany({
      where: { id, tenantId },
      data: {
        ...updateBusinessProcessDto,
        ...(priorityScore !== undefined && { priorityScore }),
      },
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.businessProcess.deleteMany({
      where: { id, tenantId },
    });
  }
}
