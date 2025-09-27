import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ComplianceFrameworksService } from './compliance-frameworks.service';
import { CreateComplianceFrameworkDto } from './dto/create-compliance-framework.dto';
import { UpdateComplianceFrameworkDto } from './dto/update-compliance-framework.dto';
import { TenantId } from '../common/tenant-id.decorator';

@UseGuards(JwtGuard)
@Controller('compliance-frameworks')
export class ComplianceFrameworksController {
  constructor(private readonly complianceFrameworksService: ComplianceFrameworksService) {}

  @Post()
  create(@Body() createComplianceFrameworkDto: CreateComplianceFrameworkDto, @TenantId() tenantId: string) {
    return this.complianceFrameworksService.create(createComplianceFrameworkDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.complianceFrameworksService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.complianceFrameworksService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateComplianceFrameworkDto: UpdateComplianceFrameworkDto) {
    return this.complianceFrameworksService.update(id, tenantId, updateComplianceFrameworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.complianceFrameworksService.remove(id, tenantId);
  }
}
