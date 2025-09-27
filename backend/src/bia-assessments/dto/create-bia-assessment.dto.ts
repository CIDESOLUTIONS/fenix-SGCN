import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested, IsNotEmpty, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

class DependencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['APPLICATION', 'ASSET', 'VENDOR', 'FACILITY', 'PROCESS'])
  @IsNotEmpty()
  type: string;

  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  @IsOptional()
  criticalityLevel?: string;
}

class DependencyMapDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DependencyDto)
  dependencies: DependencyDto[];
}

export class CreateBiaAssessmentDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  rto: number; // Recovery Time Objective (horas)

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  rpo: number; // Recovery Point Objective (horas)

  @IsNumber()
  @Min(1)
  @IsOptional()
  mtpd?: number; // Maximum Tolerable Period of Disruption (horas)

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact1h?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact24h?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact1week?: number;

  @IsString()
  @IsOptional()
  operationalImpact?: string;

  @IsString()
  @IsOptional()
  reputationalImpact?: string;

  @IsString()
  @IsOptional()
  legalRegulatoryImpact?: string;

  @IsArray()
  @IsOptional()
  vitalRecords?: string[];

  @IsArray()
  @IsOptional()
  keyPersonnel?: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => DependencyMapDto)
  @IsOptional()
  dependencyMap?: DependencyMapDto;
}

export class UpdateBiaAssessmentDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  rto?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  rpo?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  mtpd?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact1h?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact24h?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  financialImpact1week?: number;

  @IsString()
  @IsOptional()
  operationalImpact?: string;

  @IsString()
  @IsOptional()
  reputationalImpact?: string;

  @IsString()
  @IsOptional()
  legalRegulatoryImpact?: string;

  @IsArray()
  @IsOptional()
  vitalRecords?: string[];

  @IsArray()
  @IsOptional()
  keyPersonnel?: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => DependencyMapDto)
  @IsOptional()
  dependencyMap?: DependencyMapDto;
}

export class CreateBiaCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  processIds: string[];

  @IsArray()
  @IsNotEmpty()
  reviewers: string[];

  @IsString()
  @IsNotEmpty()
  dueDate: string;
}
