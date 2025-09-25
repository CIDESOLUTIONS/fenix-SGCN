import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';

  @IsArray()
  @IsOptional()
  approvers?: string[];
}

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  measurementCriteria: string;

  @IsString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED'])
  @IsOptional()
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED';
}

export class RoleResponsibilityDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  responsibility: string;

  @IsEnum(['RESPONSIBLE', 'ACCOUNTABLE', 'CONSULTED', 'INFORMED'])
  @IsNotEmpty()
  raciType: 'RESPONSIBLE' | 'ACCOUNTABLE' | 'CONSULTED' | 'INFORMED';
}

export class CreateRaciMatrixDto {
  @IsString()
  @IsNotEmpty()
  processOrActivity: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleResponsibilityDto)
  assignments: RoleResponsibilityDto[];
}
