import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RiskAssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, tenantId: string) {
    return this.prisma.riskAssessment.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.riskAssessment.findMany({
      where: { tenantId },
      include: { process: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.riskAssessment.findFirst({ where: { id, tenantId }, include: { process: true } });
  }

  async update(id: string, tenantId: string, dto: any) {
    return this.prisma.riskAssessment.updateMany({ where: { id, tenantId }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.riskAssessment.deleteMany({ where: { id, tenantId } });
  }
}
