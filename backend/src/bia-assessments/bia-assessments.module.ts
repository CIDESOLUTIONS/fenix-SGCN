import { Module } from '@nestjs/common';
import { BiaAssessmentsService } from './bia-assessments.service';
import { BiaAssessmentsController } from './bia-assessments.controller';
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
  controllers: [BiaAssessmentsController],
  providers: [BiaAssessmentsService],
  exports: [BiaAssessmentsService],
})
export class BiaAssessmentsModule {}
