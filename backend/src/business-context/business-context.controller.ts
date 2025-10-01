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
import { BusinessContextService } from './business-context.service';
import { CreateBusinessContextDto, UpdateBusinessContextDto, CreateSwotAnalysisDto, UpdateSwotAnalysisDto } from './dto/business-context.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('business-context')
export class BusinessContextController {
  constructor(private readonly businessContextService: BusinessContextService) {}

  // ============================================
  // CONTEXTO DE NEGOCIO
  // ============================================

  @Post('contexts')
  createContext(
    @Body() dto: CreateBusinessContextDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.businessContextService.createContext(dto, tenantId, req.user.userId);
  }

  @Get('contexts')
  findAllContexts(@TenantId() tenantId: string) {
    return this.businessContextService.findAllContexts(tenantId);
  }

  @Get('contexts/:id')
  findOneContext(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.findOneContext(id, tenantId);
  }

  @Patch('contexts/:id')
  updateContext(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessContextDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.businessContextService.updateContext(id, dto, tenantId, req.user.userId);
  }

  @Delete('contexts/:id')
  deleteContext(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.deleteContext(id, tenantId);
  }

  @Post('contexts/:id/approve')
  approveContext(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.businessContextService.approveContext(id, tenantId, req.user.userId);
  }

  // ============================================
  // ANÁLISIS FODA (SWOT)
  // ============================================

  @Post('swot')
  createSwotAnalysis(
    @Body() dto: CreateSwotAnalysisDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.businessContextService.createSwotAnalysis(dto, tenantId, req.user.userId);
  }

  @Get('swot')
  findAllSwotAnalyses(
    @TenantId() tenantId: string,
    @Query('contextId') contextId?: string,
  ) {
    return this.businessContextService.findAllSwotAnalyses(tenantId, contextId);
  }

  @Get('swot/:id')
  findOneSwotAnalysis(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.findOneSwotAnalysis(id, tenantId);
  }

  @Patch('swot/:id')
  updateSwotAnalysis(
    @Param('id') id: string,
    @Body() dto: UpdateSwotAnalysisDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.businessContextService.updateSwotAnalysis(id, dto, tenantId, req.user.userId);
  }

  @Delete('swot/:id')
  deleteSwotAnalysis(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.deleteSwotAnalysis(id, tenantId);
  }

  @Post('swot/:id/complete')
  completeSwotAnalysis(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.completeSwotAnalysis(id, tenantId);
  }

  @Post('swot/:id/generate-strategies')
  generateStrategies(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.businessContextService.generateStrategies(id, tenantId);
  }

  @Post('swot/analyze-with-ai')
  analyzeSwotWithAI(
    @Body() dto: { contextContent: string; contextTitle: string; swotData: any },
    @TenantId() tenantId: string,
  ) {
    return this.businessContextService.analyzeSwotWithAI(dto, tenantId);
  }
}
