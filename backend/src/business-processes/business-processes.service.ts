import { Injectable } from '@nestjs/common';
import { CreateBusinessProcessDto } from './dto/create-business-process.dto';
import { UpdateBusinessProcessDto } from './dto/update-business-process.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessProcessesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessProcessDto: CreateBusinessProcessDto) {
    return this.prisma.businessProcess.create({
      data: createBusinessProcessDto,
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
    return this.prisma.businessProcess.updateMany({
      where: { id, tenantId },
      data: updateBusinessProcessDto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.businessProcess.deleteMany({
      where: { id, tenantId },
    });
  }
}
