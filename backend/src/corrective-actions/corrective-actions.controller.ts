import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto } from './dto/create-corrective-action.dto';
import { UpdateCorrectiveActionDto } from './dto/update-corrective-action.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('corrective-actions')
export class CorrectiveActionsController {
  constructor(private readonly correctiveActionsService: CorrectiveActionsService) {}

  @Post()
  create(@Body() createCorrectiveActionDto: CreateCorrectiveActionDto, @TenantId() tenantId: string) {
    return this.correctiveActionsService.create(createCorrectiveActionDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.correctiveActionsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.correctiveActionsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateCorrectiveActionDto: UpdateCorrectiveActionDto) {
    return this.correctiveActionsService.update(id, tenantId, updateCorrectiveActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.correctiveActionsService.remove(id, tenantId);
  }
}
