import { Module } from '@nestjs/common';
import { BiaCampaignsService } from './bia-campaigns.service';
import { BiaCampaignsController } from './bia-campaigns.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BiaCampaignsController],
  providers: [BiaCampaignsService],
  exports: [BiaCampaignsService],
})
export class BiaCampaignsModule {}
