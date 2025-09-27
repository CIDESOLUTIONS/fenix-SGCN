import { Module } from '@nestjs/common';
import { TestExercisesService } from './test-exercises.service';
import { TestExercisesController } from './test-exercises.controller';
import { WorkflowEngineModule } from '../workflow-engine/workflow-engine.module';

@Module({
  imports: [WorkflowEngineModule],
  controllers: [TestExercisesController],
  providers: [TestExercisesService],
  exports: [TestExercisesService],
})
export class TestExercisesModule {}
