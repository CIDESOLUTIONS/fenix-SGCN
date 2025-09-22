import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContinuityStrategiesService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.continuityStrategy.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.continuityStrategy.findMany({ where: { tenantId }, include: { process: true } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.continuityStrategy.findFirst({ where: { id, tenantId }, include: { process: true } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.continuityStrategy.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.continuityStrategy.deleteMany({ where: { id, tenantId } }); }
}
