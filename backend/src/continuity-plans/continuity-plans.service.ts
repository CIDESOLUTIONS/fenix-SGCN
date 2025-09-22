import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContinuityPlansService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.continuityPlan.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.continuityPlan.findMany({ where: { tenantId }, include: { process: true } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.continuityPlan.findFirst({ where: { id, tenantId }, include: { process: true } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.continuityPlan.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.continuityPlan.deleteMany({ where: { id, tenantId } }); }
}
