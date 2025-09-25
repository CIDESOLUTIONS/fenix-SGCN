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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContinuityStrategiesService } from './continuity-strategies.service';
import { CreateContinuityStrategyDto } from './dto/create-continuity-strategy.dto';
import { UpdateContinuityStrategyDto } from './dto/update-continuity-strategy.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('continuity-strategies')
@UseGuards(JwtAuthGuard)
export class ContinuityStrategiesController {
  constructor(
    private readonly continuityStrategiesService: ContinuityStrategiesService,
  ) {}

  @Post()
  create(
    @Body() createContinuityStrategyDto: CreateContinuityStrategyDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuityStrategiesService.create(
      createContinuityStrategyDto,
      tenantId,
      req.user.userId,
    );
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.continuityStrategiesService.findAll(tenantId);
  }

  @Get('recommend/:processId')
  recommendStrategies(
    @Param('processId') processId: string,
    @TenantId() tenantId: string,
  ) {
    return this.continuityStrategiesService.recommendStrategies(processId, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.findOne(id, tenantId);
  }

  @Get(':id/resource-gaps')
  analyzeResourceGaps(@Param('id') strategyId: string, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.analyzeResourceGaps(strategyId, tenantId);
  }

  @Get(':id/validate')
  validateStrategy(@Param('id') strategyId: string, @TenantId() tenantId: string) {
    return this.continuityStrategiesService.validateStrategy(strategyId, tenantId);
  }

  @Post('compare')
  compareStrategies(
    @Body() body: { processId: string; strategyIds: string[] },
    @TenantId() tenantId: string,
  ) {
    return this.continuityStrategiesService.compareStrategies(
      body.processId,
      body.strategyIds,
      tenantId,
    );
  }

  @Post(':id/submit-approval')
  submitForApproval(
    @Param('id') strategyId: string,
    @TenantId() tenantId: string,
    @Body() body: { approvers: string[] },
    @Request() req: any,
  ) {
    return this.continuityStrategiesService.submitForApproval(
      strategyId,
      tenantId,
      body.approvers,
      req.user.userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateContinuityStrategyDto: UpdateContinuityStrategyDto,
    @Request() req: any,
  ) {
    return this.continuityStrategiesService.update(
      id,
      tenantId,
      updateContinuityStrategyDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.continuityStrategiesService.remove(id, tenantId, req.user.userId);
  }
}
