import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBiaCampaignDto } from './dto/create-bia-campaign.dto';
import { UpdateBiaCampaignDto } from './dto/update-bia-campaign.dto';

@Injectable()
export class BiaCampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateBiaCampaignDto) {
    return this.prisma.bIACampaign.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || null,
        status: 'DRAFT',
        deadline: new Date(dto.deadline),
        targetProcesses: dto.targetProcesses,
        totalCount: dto.targetProcesses.length,
        completedCount: 0,
        createdBy: userId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.bIACampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const campaign = await this.prisma.bIACampaign.findFirst({
      where: { id, tenantId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, tenantId: string, dto: UpdateBiaCampaignDto) {
    await this.findOne(id, tenantId);

    return this.prisma.bIACampaign.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.bIACampaign.delete({
      where: { id },
    });
  }

  async updateProgress(campaignId: string, tenantId: string) {
    const campaign = await this.findOne(campaignId, tenantId);
    
    const completedCount = await this.prisma.bIAAssessment.count({
      where: {
        tenantId,
        processId: { in: campaign.targetProcesses },
        status: { in: ['SUBMITTED', 'APPROVED'] },
      },
    });

    return this.prisma.bIACampaign.update({
      where: { id: campaignId },
      data: { completedCount },
    });
  }
}
