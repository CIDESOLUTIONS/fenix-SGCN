import { PartialType } from '@nestjs/mapped-types';
import { CreateTestExerciseDto } from './create-test-exercise.dto';

export class UpdateTestExerciseDto extends PartialType(CreateTestExerciseDto) {}
