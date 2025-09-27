import { IsString, IsEnum, IsObject, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class CreateContinuityPlanDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['BCP', 'DRP', 'IT_DR', 'CRISIS_MANAGEMENT', 'INCIDENT_RESPONSE'])
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsOptional()
  content?: any;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;
}

export class UpdateContinuityPlanDto {
  @IsString()
  @IsOptional()
  processId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['BCP', 'DRP', 'IT_DR', 'CRISIS_MANAGEMENT', 'INCIDENT_RESPONSE'])
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  content?: any;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;
}

export class SubmitForReviewDto {
  @IsArray()
  @IsNotEmpty()
  approvers: string[];
}

export class ActivatePlanDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
