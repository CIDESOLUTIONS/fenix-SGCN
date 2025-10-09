import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateBiaCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  deadline: string;

  @IsArray()
  @IsString({ each: true })
  targetProcesses: string[];
}
