import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService, WorkflowTaskType } from '../workflow-engine/workflow-engine.service';
import { CreateBiaCampaignDto } from './dto/create-bia-campaign.dto';
import { UpdateBiaCampaignDto } from './dto/update-bia-campaign.dto';

@Injectable()
export class BiaCampaignsService {
  private readonly logger = new Logger(BiaCampaignsService.name);

  constructor(
    private prisma: PrismaService,
    private workflowEngine: WorkflowEngineService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateBiaCampaignDto) {
    // Crear campaña
    const campaign = await this.prisma.biaCampaign.create({
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

    this.logger.log(`BIA campaign created: ${campaign.id} - ${campaign.name}`);
    return campaign;
  }

  async launch(campaignId: string, tenantId: string, userId: string) {
    const campaign = await this.findOne(campaignId, tenantId);

    if (campaign.status !== 'DRAFT') {
      throw new Error('Solo se pueden lanzar campañas en estado DRAFT');
    }

    // Crear workflow para cada proceso
    const workflows: any[] = [];

    for (const processId of campaign.targetProcesses) {
      const process = await this.prisma.businessProcess.findFirst({
        where: { id: processId, tenantId },
      });

      if (process) {
        const workflow = await this.workflowEngine.startWorkflow({
          name: `BIA: ${campaign.name} - ${process.name}`,
          entityType: 'bia-assessment',
          entityId: processId,
          tenantId,
          steps: [
            {
              id: 'complete',
              type: WorkflowTaskType.APPROVAL,
              name: 'Completar BIA',
              assignedTo: [process.responsiblePerson || userId],
              dueDate: campaign.deadline,
              metadata: { 
                campaignId: campaign.id,
                processId,
              },
            },
          ],
          createdBy: userId,
        });

        workflows.push(workflow);
      }
    }

    // Actualizar estado de campaña
    await this.prisma.biaCampaign.update({
      where: { id: campaignId },
      data: { status: 'ACTIVE' },
    });

    this.logger.log(`Campaign ${campaignId} launched with ${workflows.length} workflows`);

    return {
      message: 'Campaña lanzada exitosamente',
      workflowsCreated: workflows.length,
      campaign,
    };
  }

  async findAll(tenantId: string) {
    return this.prisma.biaCampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const campaign = await this.prisma.biaCampaign.findFirst({
      where: { id, tenantId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, tenantId: string, dto: UpdateBiaCampaignDto) {
    await this.findOne(id, tenantId);

    return this.prisma.biaCampaign.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.biaCampaign.delete({
      where: { id },
    });
  }

  async updateProgress(campaignId: string, tenantId: string) {
    const campaign = await this.findOne(campaignId, tenantId);
    
    const completedCount = await this.prisma.biaAssessment.count({
      where: {
        tenantId,
        processId: { in: campaign.targetProcesses },
        status: { in: ['SUBMITTED', 'APPROVED'] },
      },
    });

    return this.prisma.biaCampaign.update({
      where: { id: campaignId },
      data: { completedCount },
    });
  }
}
