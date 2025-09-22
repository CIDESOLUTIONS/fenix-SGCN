import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RiskAssessmentsService } from './risk-assessments.service';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('risk-assessments')
export class RiskAssessmentsController {
  constructor(private readonly riskAssessmentsService: RiskAssessmentsService) {}

  @Post()
  create(@Body() createRiskAssessmentDto: CreateRiskAssessmentDto, @TenantId() tenantId: string) {
    return this.riskAssessmentsService.create(createRiskAssessmentDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.riskAssessmentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.riskAssessmentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateRiskAssessmentDto: UpdateRiskAssessmentDto) {
    return this.riskAssessmentsService.update(id, tenantId, updateRiskAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.riskAssessmentsService.remove(id, tenantId);
  }
}
