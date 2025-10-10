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

import { BiaAssessmentsService } from './bia-assessments.service';
import { CreateBiaAssessmentDto } from './dto/create-bia-assessment.dto';
import { UpdateBiaAssessmentDto } from './dto/update-bia-assessment.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('bia-assessments')

export class BiaAssessmentsController {
  constructor(private readonly biaAssessmentsService: BiaAssessmentsService) {}

  @Post()
  create(
    @Body() createBiaAssessmentDto: CreateBiaAssessmentDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.biaAssessmentsService.create(
      createBiaAssessmentDto,
      tenantId,
      req.user.userId,
    );
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.biaAssessmentsService.findAll(tenantId);
  }

  @Get('coverage')
  getCoverage(@TenantId() tenantId: string) {
    return this.biaAssessmentsService.getCoverage(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.findOne(id, tenantId);
  }

  @Get('process/:processId/suggest-rto-rpo')
  suggestRtoRpo(@Param('processId') processId: string, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.suggestRtoRpo(processId, tenantId);
  }

  @Get(':id/dependency-map')
  getDependencyMap(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.biaAssessmentsService.findOne(id, tenantId);
  }

  @Post(':id/dependencies')
  addDependency(
    @Param('id') id: string,
    @Body() body: { dependencyId: string; dependencyType: string; relationshipType: string },
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.biaAssessmentsService.addDependency(
      id,
      body.dependencyId,
      body.dependencyType,
      body.relationshipType,
      tenantId,
      req.user.userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateBiaAssessmentDto: UpdateBiaAssessmentDto,
    @Request() req: any,
  ) {
    return this.biaAssessmentsService.update(
      id,
      tenantId,
      updateBiaAssessmentDto,
      req.user.userId,
    );
  }

  @Post('campaign')
  createCampaign(
    @Body()
    body: {
      name: string;
      processIds: string[];
      reviewers: string[];
      dueDate: string;
    },
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.biaAssessmentsService.createCampaign(
      body.name,
      body.processIds,
      body.reviewers,
      body.dueDate,
      tenantId,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.biaAssessmentsService.remove(id, tenantId, req.user.userId);
  }
}
