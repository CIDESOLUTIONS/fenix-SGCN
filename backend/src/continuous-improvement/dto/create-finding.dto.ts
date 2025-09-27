import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum FindingSource {
  EXERCISE = 'EXERCISE',
  AUDIT = 'AUDIT',
  INCIDENT = 'INCIDENT',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  MANAGEMENT_REVIEW = 'MANAGEMENT_REVIEW',
  STAKEHOLDER_FEEDBACK = 'STAKEHOLDER_FEEDBACK',
}

export enum FindingSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum FindingCategory {
  PERFORMANCE = 'PERFORMANCE',
  ADAPTABILITY = 'ADAPTABILITY',
  EXECUTION = 'EXECUTION',
  DOCUMENTATION = 'DOCUMENTATION',
  RESOURCES = 'RESOURCES',
}

export class CreateFindingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FindingSource)
  @IsNotEmpty()
  source: FindingSource;

  @IsString()
  @IsOptional()
  sourceReference?: string;

  @IsEnum(FindingCategory)
  @IsNotEmpty()
  category: FindingCategory;

  @IsEnum(FindingSeverity)
  @IsNotEmpty()
  severity: FindingSeverity;

  @IsString()
  @IsOptional()
  affectedArea?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsString()
  @IsOptional()
  recommendation?: string;
}
