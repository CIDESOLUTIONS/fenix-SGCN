import { Module } from '@nestjs/common';
import { BiaCampaignsService } from './bia-campaigns.service';
import { BiaCampaignsController } from './bia-campaigns.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkflowEngineModule } from '../workflow-engine/workflow-engine.module';

@Module({
  imports: [PrismaModule, WorkflowEngineModule],
  controllers: [BiaCampaignsController],
  providers: [BiaCampaignsService],
  exports: [BiaCampaignsService],
})
export class BiaCampaignsModule {}
