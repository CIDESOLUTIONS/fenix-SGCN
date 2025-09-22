import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';

export class CreateTestExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['Tabletop', 'Walkthrough', 'Simulation', 'FullScale'])
  @IsNotEmpty()
  type: 'Tabletop' | 'Walkthrough' | 'Simulation' | 'FullScale';

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @IsString()
  @IsOptional()
  facilitator?: string;

  @IsArray()
  @IsOptional()
  participants?: string[];

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsString()
  @IsOptional()
  scenario?: string;

  @IsEnum(['Planned', 'InProgress', 'Completed', 'Cancelled'])
  @IsOptional()
  status?: 'Planned' | 'InProgress' | 'Completed' | 'Cancelled';

  @IsString()
  @IsOptional()
  results?: string;

  @IsString()
  @IsOptional()
  lessonsLearned?: string;
}
