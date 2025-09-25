import { Module } from '@nestjs/common';
import { ContinuityStrategiesService } from './continuity-strategies.service';
import { ContinuityStrategiesController } from './continuity-strategies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DgraphModule } from '../dgraph/dgraph.module';
import { WorkflowEngineModule } from '../workflow-engine/workflow-engine.module';
import { AnalyticsEngineModule } from '../analytics-engine/analytics-engine.module';

@Module({
  imports: [
    PrismaModule,
    DgraphModule,
    WorkflowEngineModule,
    AnalyticsEngineModule,
  ],
  controllers: [ContinuityStrategiesController],
  providers: [ContinuityStrategiesService],
  exports: [ContinuityStrategiesService],
})
export class ContinuityStrategiesModule {}
