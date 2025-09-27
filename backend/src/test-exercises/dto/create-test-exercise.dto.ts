import { IsString, IsEnum, IsArray, IsOptional, IsNotEmpty, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class CreateTestExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['DESKTOP', 'FUNCTIONAL', 'SIMULATION', 'FULL_RECOVERY'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsArray()
  @IsOptional()
  objectives?: string[];

  @IsString()
  @IsOptional()
  scenario?: string;

  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class UpdateTestExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['DESKTOP', 'FUNCTIONAL', 'SIMULATION', 'FULL_RECOVERY'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  planId?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsArray()
  @IsOptional()
  objectives?: string[];

  @IsString()
  @IsOptional()
  scenario?: string;

  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class CompleteExerciseDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  rtoAchieved?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rpoAchieved?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  successRate?: number;

  @IsArray()
  @IsOptional()
  observations?: string[];

  @IsArray()
  @IsOptional()
  evidence?: Array<{ type: string; url: string; description: string }>;
}

export class LogEventDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  participantId?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
