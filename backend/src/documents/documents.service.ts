import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.document.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.document.findMany({ where: { tenantId } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.document.findFirst({ where: { id, tenantId } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.document.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.document.deleteMany({ where: { id, tenantId } }); }
}
