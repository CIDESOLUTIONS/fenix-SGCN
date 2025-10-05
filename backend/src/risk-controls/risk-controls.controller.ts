import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RiskControlsService } from './risk-controls.service';
import { CreateRiskControlDto } from './dto/create-risk-control.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('risk-controls')
@UseGuards(JwtAuthGuard)
export class RiskControlsController {
  constructor(private readonly riskControlsService: RiskControlsService) {}

  @Post()
  create(@Body() createRiskControlDto: CreateRiskControlDto) {
    return this.riskControlsService.create(createRiskControlDto);
  }

  @Get('risk/:riskId')
  findAll(@Param('riskId') riskId: string) {
    return this.riskControlsService.findAll(riskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riskControlsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riskControlsService.remove(id);
  }

  @Post('calculate-residual/:riskId')
  calculateResidual(@Param('riskId') riskId: string) {
    return this.riskControlsService.calculateResidualRisk(riskId);
  }
}
