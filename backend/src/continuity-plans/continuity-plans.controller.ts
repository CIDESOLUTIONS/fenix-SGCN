import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContinuityPlansService } from './continuity-plans.service';
import { CreateContinuityPlanDto } from './dto/create-continuity-plan.dto';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('continuity-plans')
export class ContinuityPlansController {
  constructor(private readonly continuityPlansService: ContinuityPlansService) {}

  @Post()
  create(@Body() createContinuityPlanDto: CreateContinuityPlanDto, @TenantId() tenantId: string) {
    return this.continuityPlansService.create(createContinuityPlanDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.continuityPlansService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityPlansService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateContinuityPlanDto: UpdateContinuityPlanDto) {
    return this.continuityPlansService.update(id, tenantId, updateContinuityPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityPlansService.remove(id, tenantId);
  }
}
