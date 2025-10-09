import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { TenantId } from '../common/tenant-id.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('planning-document')
  async generatePlanningDocument(
    @Body() dto: {
      includeContexts?: boolean;
      includePolicies?: boolean;
      includeObjectives?: boolean;
      includeRaciMatrices?: boolean;
      includeSelectedProcesses?: boolean;
      selectedProcessIds?: string[];
    },
    @TenantId() tenantId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportsService.generatePlanningDocument(dto, tenantId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Documento_Planeacion_SGCN_${new Date().toISOString().split('T')[0]}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Post('risk-summary')
  async generateRiskSummary(
    @Body() dto: {
      includeMatrix?: boolean;
      includeControls?: boolean;
      includeTreatment?: boolean;
      filterByCategory?: string;
      filterByLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    },
    @TenantId() tenantId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportsService.generateRiskSummary(dto, tenantId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Resumen_Riesgos_${new Date().toISOString().split('T')[0]}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
