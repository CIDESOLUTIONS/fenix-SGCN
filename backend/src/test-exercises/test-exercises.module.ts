import { Module } from '@nestjs/common';
import { TestExercisesService } from './test-exercises.service';
import { TestExercisesController } from './test-exercises.controller';

@Module({
  controllers: [TestExercisesController],
  providers: [TestExercisesService],
})
export class TestExercisesModule {}
