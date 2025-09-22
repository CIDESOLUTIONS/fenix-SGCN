import { Injectable } from '@nestjs/common';
import { CreateBiaAssessmentDto } from './dto/create-bia-assessment.dto';
import { UpdateBiaAssessmentDto } from './dto/update-bia-assessment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BiaAssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateBiaAssessmentDto, tenantId: string) {
    return this.prisma.biaAssessment.create({ data: { ...createDto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.biaAssessment.findMany({
      where: { tenantId },
      include: { process: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.biaAssessment.findFirst({
      where: { id, tenantId },
      include: { process: true },
    });
  }

  async update(id: string, tenantId: string, updateDto: UpdateBiaAssessmentDto) {
    return this.prisma.biaAssessment.updateMany({
      where: { id, tenantId },
      data: updateDto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.biaAssessment.deleteMany({ where: { id, tenantId } });
  }
}
