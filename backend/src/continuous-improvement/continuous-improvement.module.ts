import { Module } from '@nestjs/common';
import { ContinuousImprovementService } from './continuous-improvement.service';
import { ContinuousImprovementController } from './continuous-improvement.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkflowEngineModule } from '../workflow-engine/workflow-engine.module';
import { AnalyticsEngineModule } from '../analytics-engine/analytics-engine.module';
import { ReportGeneratorModule } from '../report-generator/report-generator.module';

@Module({
  imports: [
    PrismaModule,
    WorkflowEngineModule,
    AnalyticsEngineModule,
    ReportGeneratorModule,
  ],
  controllers: [ContinuousImprovementController],
  providers: [ContinuousImprovementService],
  exports: [ContinuousImprovementService],
})
export class ContinuousImprovementModule {}
