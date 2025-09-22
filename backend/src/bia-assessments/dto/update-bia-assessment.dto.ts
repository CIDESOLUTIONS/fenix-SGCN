import { PartialType } from '@nestjs/mapped-types';
import { CreateBiaAssessmentDto } from './create-bia-assessment.dto';

export class UpdateBiaAssessmentDto extends PartialType(CreateBiaAssessmentDto) {}
