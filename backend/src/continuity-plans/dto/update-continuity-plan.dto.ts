import { PartialType } from '@nestjs/mapped-types';
import { CreateContinuityPlanDto } from './create-continuity-plan.dto';

export class UpdateContinuityPlanDto extends PartialType(CreateContinuityPlanDto) {}
