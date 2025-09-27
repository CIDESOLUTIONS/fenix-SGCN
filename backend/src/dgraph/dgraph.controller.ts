import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';

import { DgraphService } from './dgraph.service';
import { JwtGuard } from '../auth/guard/jwt.guard';


@UseGuards(JwtGuard)
@Controller('dgraph')

export class DgraphController {
  constructor(private readonly dgraphService: DgraphService) {}

  @Get('spof-analysis')
  async spofAnalysis(@Request() req: any) {
    return this.dgraphService.analyzeSPOF(req.user.tenantId);
  }

  @Post('calculate-impact')
  async calculateImpact(@Body() data: any, @Request() req: any) {
    return this.dgraphService.calculateImpact(
      data.assetId,
      data.failureType,
      req.user.tenantId,
    );
  }

  @Get('upstream-dependencies/:processId')
  async upstreamDependencies(
    @Param('processId') processId: string,
    @Request() req: any,
  ) {
    return this.dgraphService.getUpstreamDependencies(processId, req.user.tenantId);
  }

  @Get('downstream-dependencies/:assetId')
  async downstreamDependencies(
    @Param('assetId') assetId: string,
    @Request() req: any,
  ) {
    return this.dgraphService.getDownstreamDependencies(assetId, req.user.tenantId);
  }

  @Post('criticality-cascade')
  async criticalityCascade(@Body() data: any, @Request() req: any) {
    return this.dgraphService.calculateCriticalityCascade(
      data.startNodeId,
      req.user.tenantId,
    );
  }
}
