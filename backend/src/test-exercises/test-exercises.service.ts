import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestExercisesService {
  constructor(private prisma: PrismaService) {}
  async create(dto: any, tenantId: string) { return this.prisma.testExercise.create({ data: { ...dto, tenantId } }); }
  async findAll(tenantId: string) { return this.prisma.testExercise.findMany({ where: { tenantId } }); }
  async findOne(id: string, tenantId: string) { return this.prisma.testExercise.findFirst({ where: { id, tenantId } }); }
  async update(id: string, tenantId: string, dto: any) { return this.prisma.testExercise.updateMany({ where: { id, tenantId }, data: dto }); }
  async remove(id: string, tenantId: string) { return this.prisma.testExercise.deleteMany({ where: { id, tenantId } }); }
}
