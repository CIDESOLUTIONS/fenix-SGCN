import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRiskAssessmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['OPERATIONAL', 'TECHNOLOGICAL', 'NATURAL', 'HUMAN', 'EXTERNAL'])
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  probabilityBefore: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  impactBefore: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  probabilityAfter?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  impactAfter?: number;

  @IsString()
  @IsOptional()
  processId?: string;

  @IsArray()
  @IsOptional()
  controls?: string[];
}

export class UpdateRiskAssessmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['OPERATIONAL', 'TECHNOLOGICAL', 'NATURAL', 'HUMAN', 'EXTERNAL'])
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  probabilityBefore?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  impactBefore?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  probabilityAfter?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  impactAfter?: number;

  @IsArray()
  @IsOptional()
  controls?: string[];
}

class TreatmentActionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  assignee: string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;
}

export class CreateTreatmentPlanDto {
  @IsEnum(['AVOID', 'MITIGATE', 'TRANSFER', 'ACCEPT'])
  @IsNotEmpty()
  strategy: 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreatmentActionDto)
  actions: TreatmentActionDto[];

  @IsString()
  @IsNotEmpty()
  owner: string;
}

export class MonteCarloSimulationDto {
  @IsNumber()
  @Min(0)
  impactMin: number;

  @IsNumber()
  @Min(0)
  impactMost: number;

  @IsNumber()
  @Min(0)
  impactMax: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  probabilityMin: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  probabilityMax: number;

  @IsNumber()
  @Min(1000)
  @Max(100000)
  @IsOptional()
  iterations?: number;
}
