import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateContinuityStrategyDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsEnum(['PREVENTION', 'MITIGATION', 'RECOVERY', 'REDUNDANCY'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  scenario: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  implementationTime?: number; // días

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  effectiveness?: number; // 1-5

  @IsArray()
  @IsOptional()
  requiredResources?: string[];
}

export class UpdateContinuityStrategyDto {
  @IsEnum(['PREVENTION', 'MITIGATION', 'RECOVERY', 'REDUNDANCY'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  scenario?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  implementationTime?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  effectiveness?: number;

  @IsArray()
  @IsOptional()
  requiredResources?: string[];
}

export class CompareStrategiesDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsArray()
  @IsNotEmpty()
  strategyIds: string[];
}
