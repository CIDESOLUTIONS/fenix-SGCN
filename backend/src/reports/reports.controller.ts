import { Controller, Post, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantId } from '../common/tenant-id.decorator';
import { ReportGeneratorService } from '../report-generator/report-generator.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private reportGenerator: ReportGeneratorService,
    private prisma: PrismaService,
  ) {}

  @Post('risk-summary')
  async generateRiskSummary(@TenantId() tenantId: string, @Res() res: Response) {
    // 1. Obtener criterios de evaluación
    const probabilityCriteria = [
      { level: 5, descriptor: 'Muy Alta (Casi Seguro)', description: 'Se espera que ocurra en la mayoría de las circunstancias', value: 5 },
      { level: 4, descriptor: 'Alta (Probable)', description: 'Se espera que ocurra frecuentemente', value: 4 },
      { level: 3, descriptor: 'Moderada (Posible)', description: 'Podría ocurrir ocasionalmente', value: 3 },
      { level: 2, descriptor: 'Baja (Poco Probable)', description: 'Podría ocurrir raramente', value: 2 },
      { level: 1, descriptor: 'Muy Baja (Raro)', description: 'Es muy poco probable que ocurra', value: 1 },
    ];

    const impactCriteria = [
      { level: 5, descriptor: 'Catastrófico', description: 'Interrupción total y prolongada de servicios críticos' },
      { level: 4, descriptor: 'Mayor', description: 'Interrupción significativa de un servicio crítico' },
      { level: 3, descriptor: 'Moderado', description: 'Interrupción parcial de un servicio crítico' },
      { level: 2, descriptor: 'Menor', description: 'Degradación del servicio o interrupción breve' },
      { level: 1, descriptor: 'Insignificante', description: 'Breve inconveniente sin impacto real' },
    ];

    const riskLevels = [
      { name: 'Crítico', minScore: 19, maxScore: 25, treatment: 'Tratamiento inmediato y monitoreo por la alta dirección', color: '#DC2626' },
      { name: 'Alto', minScore: 13, maxScore: 18, treatment: 'Tratamiento prioritario y plan de acción formal', color: '#EA580C' },
      { name: 'Moderado', minScore: 7, maxScore: 12, treatment: 'Monitoreo y tratamiento según costo-beneficio', color: '#CA8A04' },
      { name: 'Bajo', minScore: 1, maxScore: 6, treatment: 'Aceptación del riesgo y monitoreo periódico', color: '#16A34A' },
    ];

    // 2. Obtener riesgos con controles
    const risks = await this.prisma.riskAssessment.findMany({
      where: { tenantId },
      include: { 
        riskControls: true,
        process: { select: { name: true } }
      },
      orderBy: { scoreBefore: 'desc' },
    });

    // 3. Crear matriz de evaluación
    const matrix = this.createRiskMatrix(risks);

    // 4. Generar HTML del reporte
    const html = this.generateHTML({
      probabilityCriteria,
      impactCriteria,
      riskLevels,
      risks,
      matrix,
    });

    // 5. Generar PDF
    const pdfPath = await this.reportGenerator.generatePDFReport('Resumen de Riesgos', { html });
    const fs = require('fs');
    const pdfBuffer = fs.readFileSync(pdfPath);
    fs.unlinkSync(pdfPath); // Eliminar archivo temporal

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Resumen_Riesgos_${new Date().toISOString().split('T')[0]}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  private createRiskMatrix(risks: any[]) {
    const matrix = Array(5).fill(null).map(() => Array(5).fill([]));
    
    risks.forEach(risk => {
      const p = risk.probabilityBefore - 1;
      const i = risk.impactBefore - 1;
      if (!Array.isArray(matrix[4-p][i])) matrix[4-p][i] = [];
      matrix[4-p][i].push(risk);
    });

    return matrix;
  }

  private generateHTML(data: any): string {
    const { probabilityCriteria, impactCriteria, riskLevels, risks, matrix } = data;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; }
    h1 { color: #1e3a8a; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #3b82f6; margin-top: 25px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #3b82f6; color: white; padding: 8px; text-align: left; }
    td { border: 1px solid #ddd; padding: 8px; }
    .matrix-cell { min-height: 40px; font-size: 9px; }
    .risk-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8px; margin: 2px; }
    .header { text-align: center; margin-bottom: 30px; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 9px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>RESUMEN DE ANÁLISIS DE RIESGOS DE CONTINUIDAD</h1>
    <p>Metodología ISO 31000 - Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
  </div>

  <h2>1. CRITERIOS DE EVALUACIÓN DE RIESGOS</h2>
  
  <h3>1.1 Criterios de Probabilidad</h3>
  <table>
    <tr><th>Nivel</th><th>Descriptor</th><th>Descripción</th><th>Valor</th></tr>
    ${probabilityCriteria.map(c => `
      <tr><td>${c.level}</td><td><strong>${c.descriptor}</strong></td><td>${c.description}</td><td>${c.value}</td></tr>
    `).join('')}
  </table>

  <h3>1.2 Criterios de Impacto</h3>
  <table>
    <tr><th>Nivel</th><th>Descriptor</th><th>Descripción</th></tr>
    ${impactCriteria.map(c => `
      <tr><td>${c.level}</td><td><strong>${c.descriptor}</strong></td><td>${c.description}</td></tr>
    `).join('')}
  </table>

  <h3>1.3 Niveles de Riesgo</h3>
  <table>
    <tr><th>Nivel</th><th>Rango</th><th>Tratamiento</th></tr>
    ${riskLevels.map(l => `
      <tr>
        <td><span style="background: ${l.color}; color: white; padding: 4px 8px; border-radius: 4px;">${l.name}</span></td>
        <td>${l.minScore} - ${l.maxScore}</td>
        <td>${l.treatment}</td>
      </tr>
    `).join('')}
  </table>

  <h2>2. REGISTRO DE RIESGOS IDENTIFICADOS</h2>
  <table>
    <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>P</th><th>I</th><th>Inherente</th><th>Residual</th><th>Controles</th></tr>
    ${risks.map(r => `
      <tr>
        <td>${r.riskId || 'N/A'}</td>
        <td>${r.name}</td>
        <td>${r.category}</td>
        <td>${r.probabilityBefore}</td>
        <td>${r.impactBefore}</td>
        <td><strong>${r.scoreBefore}</strong></td>
        <td><strong>${r.scoreAfter || 'N/A'}</strong></td>
        <td>${r.riskControls?.length || 0}</td>
      </tr>
    `).join('')}
  </table>

  <h2>3. MATRIZ DE EVALUACIÓN DE RIESGOS</h2>
  <table style="table-layout: fixed;">
    <tr>
      <th style="width: 80px;">P \\ I</th>
      <th>Insignificante (1)</th>
      <th>Menor (2)</th>
      <th>Moderado (3)</th>
      <th>Mayor (4)</th>
      <th>Catastrófico (5)</th>
    </tr>
    ${matrix.map((row, pi) => `
      <tr>
        <th>${5-pi} - ${probabilityCriteria[4-pi].descriptor.split(' ')[0]}</th>
        ${row.map(cell => `
          <td class="matrix-cell" style="background: ${this.getCellColor(cell)};">
            ${Array.isArray(cell) ? cell.map(r => `<span class="risk-badge">${r.riskId || r.name.substring(0,15)}</span>`).join('') : ''}
          </td>
        `).join('')}
      </tr>
    `).join('')}
  </table>

  <div class="footer">
    <p>Generado automáticamente por Fenix-SGCN | ${new Date().toLocaleString('es-ES')}</p>
  </div>
</body>
</html>`;
  }

  private getCellColor(risks: any[]): string {
    if (!Array.isArray(risks) || risks.length === 0) return '#f9fafb';
    const maxScore = Math.max(...risks.map(r => r.scoreBefore));
    if (maxScore >= 19) return '#fee2e2';
    if (maxScore >= 13) return '#fed7aa';
    if (maxScore >= 7) return '#fef3c7';
    return '#d1fae5';
  }
}
