import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CorrectiveActionsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.correctiveAction.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.correctiveAction.findMany({ where: { tenantId } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.correctiveAction.findFirst({ where: { id, tenantId } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.correctiveAction.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.correctiveAction.deleteMany({ where: { id, tenantId } }); }
}
