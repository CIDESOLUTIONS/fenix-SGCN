import { Module } from '@nestjs/common';
import { RiskAssessmentsService } from './risk-assessments.service';
import { RiskAssessmentsController } from './risk-assessments.controller';
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
  controllers: [RiskAssessmentsController],
  providers: [RiskAssessmentsService],
  exports: [RiskAssessmentsService],
})
export class RiskAssessmentsModule {}
