import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceFrameworksService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.complianceFramework.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.complianceFramework.findMany({ where: { tenantId } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.complianceFramework.findFirst({ where: { id, tenantId } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.complianceFramework.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.complianceFramework.deleteMany({ where: { id, tenantId } }); }
}
