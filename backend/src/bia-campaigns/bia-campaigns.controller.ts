import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BiaCampaignsService } from './bia-campaigns.service';
import { CreateBiaCampaignDto } from './dto/create-bia-campaign.dto';
import { UpdateBiaCampaignDto } from './dto/update-bia-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bia-campaigns')
@UseGuards(JwtAuthGuard)
export class BiaCampaignsController {
  constructor(private readonly biaCampaignsService: BiaCampaignsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateBiaCampaignDto) {
    return this.biaCampaignsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.biaCampaignsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.biaCampaignsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateBiaCampaignDto,
  ) {
    return this.biaCampaignsService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.biaCampaignsService.remove(id, req.user.tenantId);
  }

  @Post(':id/update-progress')
  updateProgress(@Param('id') id: string, @Request() req) {
    return this.biaCampaignsService.updateProgress(id, req.user.tenantId);
  }
}
