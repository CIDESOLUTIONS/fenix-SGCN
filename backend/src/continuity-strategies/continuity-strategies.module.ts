import { Module } from '@nestjs/common';
import { ContinuityStrategiesService } from './continuity-strategies.service';
import { ContinuityStrategiesController } from './continuity-strategies.controller';

@Module({
  controllers: [ContinuityStrategiesController],
  providers: [ContinuityStrategiesService],
})
export class ContinuityStrategiesModule {}
