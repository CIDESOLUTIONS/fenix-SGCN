import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';

export class CreateContinuityPlanDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Draft', 'Active', 'Review', 'Archived'])
  @IsOptional()
  status?: 'Draft' | 'Active' | 'Review' | 'Archived';

  @IsDateString()
  @IsOptional()
  reviewDate?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsArray()
  @IsOptional()
  activationTriggers?: string[];

  @IsArray()
  @IsOptional()
  procedures?: any[];
}
