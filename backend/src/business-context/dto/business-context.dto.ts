import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateBusinessContextDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  elaborationDate?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  fileSize?: number;
}

export class UpdateBusinessContextDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  fileSize?: number;
}

export class CreateSwotAnalysisDto {
  @IsString()
  contextId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];

  @IsOptional()
  strategies?: any[];

  @IsOptional()
  participants?: string[];

  @IsString()
  facilitator: string;
}

export class UpdateSwotAnalysisDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  strengths?: string[];

  @IsOptional()
  weaknesses?: string[];

  @IsOptional()
  opportunities?: string[];

  @IsOptional()
  threats?: string[];

  @IsOptional()
  strategies?: any[];

  @IsOptional()
  participants?: string[];

  @IsOptional()
  @IsString()
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'ARCHIVED';
}
