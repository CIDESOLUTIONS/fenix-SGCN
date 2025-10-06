import { Injectable } from '@nestjs/common';
import { CreateBusinessProcessDto } from './dto/create-business-process.dto';
import { UpdateBusinessProcessDto } from './dto/update-business-process.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessProcessesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generar ID automático del proceso según formato:
   * P[Tipo][Criticidad][###]
   * - P: Fijo (Procesos)
   * - Tipo: M=Misional, E=Estratégico, S=Soporte
   * - Criticidad: C=Crítico, A=Alto, M=Medio, B=Bajo
   * - ###: Consecutivo de 3 dígitos
   */
  private async generateProcessId(tenantId: string, processType: string, criticalityLevel: string): Promise<string> {
    // Mapeo de tipos
    const typeMap: Record<string, string> = {
      'CORE': 'M',      // Misional (Core)
      'STRATEGIC': 'E', // Estratégico
      'SUPPORT': 'S',   // Soporte
    };

    // Mapeo de criticidad
    const criticalityMap: Record<string, string> = {
      'CRITICAL': 'C',
      'HIGH': 'A',
      'MEDIUM': 'M',
      'LOW': 'B',
    };

    const typeCode = typeMap[processType] || 'M';
    const criticalityCode = criticalityMap[criticalityLevel] || 'M';

    // Obtener el último consecutivo
    const lastProcess = await this.prisma.businessProcess.findFirst({
      where: { 
        tenantId,
        processId: {
          startsWith: `P${typeCode}${criticalityCode}`
        }
      },
      orderBy: { processId: 'desc' },
      select: { processId: true }
    });

    let consecutive = 1;
    if (lastProcess?.processId) {
      // Extraer los últimos 3 dígitos
      const lastNumber = parseInt(lastProcess.processId.slice(-3));
      consecutive = isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    // Formatear consecutivo con ceros a la izquierda
    const consecutiveStr = consecutive.toString().padStart(3, '0');

    return `P${typeCode}${criticalityCode}${consecutiveStr}`;
  }
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
    // Generar ID automático
    const processId = await this.generateProcessId(
      tenantId,
      createBusinessProcessDto.processType || 'CORE',
      createBusinessProcessDto.criticalityLevel || 'MEDIUM'
    );

    // Calcular el priority score
    const priorityScore = this.calculatePriorityScore(
      createBusinessProcessDto.prioritizationCriteria as any
    );

    return this.prisma.businessProcess.create({
      data: {
        ...createBusinessProcessDto,
        processId, // ID automático generado
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
