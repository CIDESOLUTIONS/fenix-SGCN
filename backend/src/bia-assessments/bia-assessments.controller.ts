import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiaAssessmentsService } from './bia-assessments.service';
import { CreateBiaAssessmentDto } from './dto/create-bia-assessment.dto';
import { UpdateBiaAssessmentDto } from './dto/update-bia-assessment.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('bia-assessments')
export class BiaAssessmentsController {
  constructor(private readonly biaAssessmentsService: BiaAssessmentsService) {}

  @Post()
  create(@Body() createBiaAssessmentDto: CreateBiaAssessmentDto, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.create(createBiaAssessmentDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.biaAssessmentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateBiaAssessmentDto: UpdateBiaAssessmentDto) {
    return this.biaAssessmentsService.update(id, tenantId, updateBiaAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.remove(id, tenantId);
  }
}
