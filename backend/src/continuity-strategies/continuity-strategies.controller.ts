import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContinuityStrategiesService } from './continuity-strategies.service';
import { CreateContinuityStrategyDto } from './dto/create-continuity-strategy.dto';
import { UpdateContinuityStrategyDto } from './dto/update-continuity-strategy.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('continuity-strategies')
export class ContinuityStrategiesController {
  constructor(private readonly continuityStrategiesService: ContinuityStrategiesService) {}

  @Post()
  create(@Body() createContinuityStrategyDto: CreateContinuityStrategyDto, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.create(createContinuityStrategyDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.continuityStrategiesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateContinuityStrategyDto: UpdateContinuityStrategyDto) {
    return this.continuityStrategiesService.update(id, tenantId, updateContinuityStrategyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.remove(id, tenantId);
  }
}
