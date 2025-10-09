import { PartialType } from '@nestjs/mapped-types';
import { CreateBiaCampaignDto } from './create-bia-campaign.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBiaCampaignDto extends PartialType(CreateBiaCampaignDto) {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  completedCount?: number;
}
