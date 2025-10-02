import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { TenantId } from '../common/tenant-id.decorator';

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
    @Request() req: any,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportsService.generatePlanningDocument(dto, tenantId, req.user.userId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Documento_Planeacion_SGCN_${new Date().toISOString().split('T')[0]}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
