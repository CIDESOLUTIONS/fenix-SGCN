import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateRiskAssessmentDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsString()
  @IsNotEmpty()
  riskDescription: string;

  @IsEnum(['Strategic', 'Operational', 'Financial', 'Compliance', 'Reputational'])
  @IsOptional()
  riskType?: 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Reputational';

  @IsNumber()
  @IsOptional()
  likelihood?: number;

  @IsNumber()
  @IsOptional()
  impact?: number;

  @IsNumber()
  @IsOptional()
  riskScore?: number;

  @IsString()
  @IsOptional()
  mitigationPlan?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsEnum(['Open', 'Mitigated', 'Accepted', 'Transferred', 'Closed'])
  @IsOptional()
  status?: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred' | 'Closed';
}
