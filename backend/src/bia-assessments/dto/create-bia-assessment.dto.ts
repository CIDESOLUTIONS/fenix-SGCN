import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateBiaAssessmentDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsNumber()
  @IsOptional()
  rto?: number;

  @IsNumber()
  @IsOptional()
  rpo?: number;

  @IsNumber()
  @IsOptional()
  mtpd?: number;

  @IsEnum(['Critical', 'High', 'Medium', 'Low'])
  @IsOptional()
  impactLevel?: 'Critical' | 'High' | 'Medium' | 'Low';

  @IsString()
  @IsOptional()
  financialImpact?: string;

  @IsString()
  @IsOptional()
  operationalImpact?: string;

  @IsString()
  @IsOptional()
  reputationalImpact?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
