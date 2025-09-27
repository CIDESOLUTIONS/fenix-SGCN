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

import { ContinuityPlansService } from './continuity-plans.service';
import { CreateContinuityPlanDto } from './dto/create-continuity-plan.dto';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('continuity-plans')

export class ContinuityPlansController {
  constructor(private readonly continuityPlansService: ContinuityPlansService) {}

  @Post()
  create(
    @Body() createContinuityPlanDto: CreateContinuityPlanDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuityPlansService.create(
      createContinuityPlanDto,
      tenantId,
      req.user.userId,
    );
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.continuityPlansService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityPlansService.findOne(id, tenantId);
  }

  @Get(':id/impact-analysis')
  getImpactAnalysis(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityPlansService.getImpactAnalysis(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateContinuityPlanDto: UpdateContinuityPlanDto,
    @Request() req: any,
  ) {
    return this.continuityPlansService.update(
      id,
      tenantId,
      updateContinuityPlanDto,
      req.user.userId,
    );
  }

  @Post(':id/submit-review')
  submitForReview(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { approvers: string[] },
    @Request() req: any,
  ) {
    return this.continuityPlansService.submitForReview(
      id,
      tenantId,
      body.approvers,
      req.user.userId,
    );
  }

  @Post(':id/approve')
  approvePlan(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { comments?: string },
    @Request() req: any,
  ) {
    return this.continuityPlansService.approvePlan(
      id,
      tenantId,
      req.user.userId,
      body.comments,
    );
  }

  @Post(':id/activate')
  activatePlan(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { reason: string },
    @Request() req: any,
  ) {
    return this.continuityPlansService.activatePlan(
      id,
      tenantId,
      req.user.userId,
      body.reason,
    );
  }

  @Post(':id/clone')
  clonePlan(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { newName: string },
    @Request() req: any,
  ) {
    return this.continuityPlansService.clonePlan(
      id,
      tenantId,
      body.newName,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuityPlansService.remove(id, tenantId);
  }
}
