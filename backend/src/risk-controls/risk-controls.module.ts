import { Module } from '@nestjs/common';
import { RiskControlsService } from './risk-controls.service';
import { RiskControlsController } from './risk-controls.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RiskControlsController],
  providers: [RiskControlsService],
  exports: [RiskControlsService],
})
export class RiskControlsModule {}
