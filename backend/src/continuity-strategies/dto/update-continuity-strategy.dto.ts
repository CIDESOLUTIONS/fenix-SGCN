import { PartialType } from '@nestjs/mapped-types';
import { CreateContinuityStrategyDto } from './create-continuity-strategy.dto';

export class UpdateContinuityStrategyDto extends PartialType(CreateContinuityStrategyDto) {}
