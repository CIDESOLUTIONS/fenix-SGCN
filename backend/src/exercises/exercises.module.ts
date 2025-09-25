import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
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
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
