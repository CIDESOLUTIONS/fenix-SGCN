import { Module } from '@nestjs/common';
import { ContinuityPlansService } from './continuity-plans.service';
import { ContinuityPlansController } from './continuity-plans.controller';

@Module({
  controllers: [ContinuityPlansController],
  providers: [ContinuityPlansService],
})
export class ContinuityPlansModule {}
