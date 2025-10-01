import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards } from '@nestjs/common';
import { BusinessProcessesService } from './business-processes.service';
import { CreateBusinessProcessDto } from './dto/create-business-process.dto';
import { UpdateBusinessProcessDto } from './dto/update-business-process.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';



@UseGuards(JwtGuard)
@Controller('business-processes')

export class BusinessProcessesController {
  constructor(private readonly businessProcessesService: BusinessProcessesService) {}

  @Post()
  create(@Body() createBusinessProcessDto: CreateBusinessProcessDto, @TenantId() tenantId: string) {
    return this.businessProcessesService.create(createBusinessProcessDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.businessProcessesService.findAll(tenantId);
  }

  @Get('continuity/selected')
  findForContinuityAnalysis(@TenantId() tenantId: string) {
    return this.businessProcessesService.findForContinuityAnalysis(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessProcessesService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateBusinessProcessDto: UpdateBusinessProcessDto) {
    return this.businessProcessesService.update(id, tenantId, updateBusinessProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessProcessesService.remove(id, tenantId);
  }
}
