import { IsString, IsOptional, IsArray, IsEnum, ValidateNested, IsNotEmpty, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para Política
export class CreatePolicyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: string;
}

export class UpdatePolicyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: string;
}

// DTO para Objetivo
export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  measurementCriteria: string;

  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED'])
  @IsOptional()
  status?: string;
}

export class UpdateObjectiveDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  measurementCriteria?: string;

  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED'])
  @IsOptional()
  status?: string;

  @IsOptional()
  progress?: number;
}

// DTO para Matriz RACI
class RaciAssignmentDto {
  @IsString()
  role: string;

  @IsString()
  responsibility: string;

  @IsEnum(['RESPONSIBLE', 'ACCOUNTABLE', 'CONSULTED', 'INFORMED'])
  raciType: string;
}

export class CreateRaciMatrixDto {
  @IsString()
  @IsNotEmpty()
  processOrActivity: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RaciAssignmentDto)
  assignments: RaciAssignmentDto[];
}

export class UpdateRaciMatrixDto {
  @IsString()
  @IsOptional()
  processOrActivity?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RaciAssignmentDto)
  assignments?: RaciAssignmentDto[];
}
