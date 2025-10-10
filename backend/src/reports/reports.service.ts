import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async generatePlanningDocument(
    dto: {
      includeContexts?: boolean;
      includePolicies?: boolean;
      includeObjectives?: boolean;
      includeRaciMatrices?: boolean;
      includeSelectedProcesses?: boolean;
      selectedProcessIds?: string[];
    },
    tenantId: string,
  ): Promise<Buffer> {
    this.logger.log(`Generando documento de planeación para tenant ${tenantId}`);

    // Obtener datos
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    const contexts = dto.includeContexts
      ? await this.prisma.businessContext.findMany({
          where: { tenantId },
          include: { swotAnalyses: true },
        })
      : [];

    const policies = dto.includePolicies
      ? await this.prisma.sgcnPolicy.findMany({ where: { tenantId } })
      : [];

    const objectives = dto.includeObjectives
      ? await this.prisma.sgcnObjective.findMany({ where: { tenantId } })
      : [];

    const raciMatrices = dto.includeRaciMatrices
      ? await this.prisma.raciMatrix.findMany({ where: { tenantId } })
      : [];

    const processes = dto.includeSelectedProcesses && dto.selectedProcessIds?.length
      ? await this.prisma.businessProcess.findMany({
          where: { 
            tenantId,
            id: { in: dto.selectedProcessIds }
          }
        })
      : [];

    // Crear PDF con soporte UTF-8
    const doc = new PDFDocument({ 
      margin: 50,
      bufferPages: true, // Importante para numeración de páginas
      autoFirstPage: false // Control manual de páginas
    });
    
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Helper para verificar espacio en página
    const checkPageSpace = (requiredSpace: number = 100) => {
      if (doc.y > 700) { // Si quedan menos de ~100px
        doc.addPage();
      }
    };

    // Helper para texto con manejo de UTF-8
    const safeText = (text: string, options?: any) => {
      // Reemplazar caracteres problemáticos
      const cleanText = text
        .replace(/[^\x00-\x7F]/g, (char) => {
          const replacements: { [key: string]: string } = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
            'ñ': 'n', 'Ñ': 'N', '¿': '', '¡': ''
          };
          return replacements[char] || char;
        });
      return doc.text(cleanText, options);
    };

    // Portada
    doc.addPage();
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Documento de Planeacion y Gobierno', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(16)
      .font('Helvetica')
      .text('Sistema de Gestion de Continuidad de Negocio (SGCN)', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(14)
      .text(`Organizacion: ${tenant?.name || 'Sin nombre'}`, { align: 'center' })
      .text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' })
      .moveDown(3);

    // Tabla de contenidos
    doc.addPage();
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Tabla de Contenidos', { underline: true })
      .moveDown(1);

    let section = 1;
    doc.fontSize(12).font('Helvetica');

    if (contexts.length > 0) doc.text(`${section++}. Contexto de Negocio y Analisis FODA`);
    if (policies.length > 0) doc.text(`${section++}. Politicas del SGCN`);
    if (objectives.length > 0) doc.text(`${section++}. Objetivos del SGCN`);
    if (raciMatrices.length > 0) doc.text(`${section++}. Matriz RACI`);
    if (processes.length > 0) doc.text(`${section++}. Procesos de Negocio`);

    section = 1;

    // CONTEXTOS DE NEGOCIO
    if (contexts.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Contexto de Negocio y Analisis FODA`, { underline: true })
        .moveDown(1);

      contexts.forEach((context, idx) => {
        checkPageSpace(150);
        
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${context.title}`)
          .moveDown(0.5);

        doc.fontSize(11).font('Helvetica');

        if (context.description) {
          // Sin truncamiento, con salto de página automático
          const lines = doc.heightOfString(context.description, { width: 500 });
          if (doc.y + lines > 700) doc.addPage();
          
          safeText(`Descripcion: ${context.description}`, { width: 500 });
          doc.moveDown(0.3);
        }

        safeText(`Fecha: ${new Date(context.elaborationDate).toLocaleDateString('es-ES')}`);
        safeText(`Estado: ${this.getStatusLabel(context.status)}`);
        doc.moveDown(0.5);

        // SWOT sin truncar
        if (context.swotAnalyses && context.swotAnalyses.length > 0) {
          context.swotAnalyses.forEach((swot) => {
            checkPageSpace(200);
            
            doc
              .fontSize(12)
              .font('Helvetica-Bold')
              .text('Analisis FODA:')
              .moveDown(0.3);

            doc.fontSize(10).font('Helvetica');

            // Fortalezas
            if (swot.strengths && Array.isArray(swot.strengths) && swot.strengths.length > 0) {
              checkPageSpace(100);
              doc.font('Helvetica-Bold').text('Fortalezas:');
              swot.strengths.forEach((s: any, i: number) => {
                checkPageSpace(30);
                safeText(`  ${i + 1}. ${String(s)}`, { indent: 20 });
              });
              doc.moveDown(0.3);
            } else if (swot.strengths && typeof swot.strengths === 'string') {
              const strengths = JSON.parse(swot.strengths);
              if (Array.isArray(strengths) && strengths.length > 0) {
                checkPageSpace(100);
                doc.font('Helvetica-Bold').text('Fortalezas:');
                strengths.forEach((s: string, i: number) => {
                  checkPageSpace(30);
                  safeText(`  ${i + 1}. ${s}`, { indent: 20 });
                });
                doc.moveDown(0.3);
              }
            }

            // Debilidades
            if (swot.weaknesses && Array.isArray(swot.weaknesses) && swot.weaknesses.length > 0) {
              checkPageSpace(100);
              doc.font('Helvetica-Bold').text('Debilidades:');
              swot.weaknesses.forEach((w: any, i: number) => {
                checkPageSpace(30);
                safeText(`  ${i + 1}. ${String(w)}`, { indent: 20 });
              });
              doc.moveDown(0.3);
            } else if (swot.weaknesses && typeof swot.weaknesses === 'string') {
              const weaknesses = JSON.parse(swot.weaknesses);
              if (Array.isArray(weaknesses) && weaknesses.length > 0) {
                checkPageSpace(100);
                doc.font('Helvetica-Bold').text('Debilidades:');
                weaknesses.forEach((w: string, i: number) => {
                  checkPageSpace(30);
                  safeText(`  ${i + 1}. ${w}`, { indent: 20 });
                });
                doc.moveDown(0.3);
              }
            }

            // Oportunidades
            if (swot.opportunities && Array.isArray(swot.opportunities) && swot.opportunities.length > 0) {
              checkPageSpace(100);
              doc.font('Helvetica-Bold').text('Oportunidades:');
              swot.opportunities.forEach((o: any, i: number) => {
                checkPageSpace(30);
                safeText(`  ${i + 1}. ${String(o)}`, { indent: 20 });
              });
              doc.moveDown(0.3);
            } else if (swot.opportunities && typeof swot.opportunities === 'string') {
              const opportunities = JSON.parse(swot.opportunities);
              if (Array.isArray(opportunities) && opportunities.length > 0) {
                checkPageSpace(100);
                doc.font('Helvetica-Bold').text('Oportunidades:');
                opportunities.forEach((o: string, i: number) => {
                  checkPageSpace(30);
                  safeText(`  ${i + 1}. ${o}`, { indent: 20 });
                });
                doc.moveDown(0.3);
              }
            }

            // Amenazas
            if (swot.threats && Array.isArray(swot.threats) && swot.threats.length > 0) {
              checkPageSpace(100);
              doc.font('Helvetica-Bold').text('Amenazas:');
              swot.threats.forEach((t: any, i: number) => {
                checkPageSpace(30);
                safeText(`  ${i + 1}. ${String(t)}`, { indent: 20 });
              });
              doc.moveDown(0.5);
            } else if (swot.threats && typeof swot.threats === 'string') {
              const threats = JSON.parse(swot.threats);
              if (Array.isArray(threats) && threats.length > 0) {
                checkPageSpace(100);
                doc.font('Helvetica-Bold').text('Amenazas:');
                threats.forEach((t: string, i: number) => {
                  checkPageSpace(30);
                  safeText(`  ${i + 1}. ${t}`, { indent: 20 });
                });
                doc.moveDown(0.5);
              }
            }
          });
        }
      });
    }

    // POLÍTICAS
    if (policies.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Politicas del SGCN`, { underline: true })
        .moveDown(1);

      policies.forEach((policy, idx) => {
        checkPageSpace(150);
        
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${policy.title}`)
          .moveDown(0.5);

        doc.fontSize(11).font('Helvetica');

        if (policy.content) {
          const lines = doc.heightOfString(policy.content, { width: 500 });
          if (doc.y + lines > 700) doc.addPage();
          
          safeText(policy.content, { width: 500, align: 'justify' });
          doc.moveDown(0.5);
        }

        safeText(`Version: ${policy.version || '1.0'}`);
        safeText(`Aprobado: ${policy.approvedAt ? new Date(policy.approvedAt).toLocaleDateString('es-ES') : 'Pendiente'}`);
        doc.moveDown(1);
      });
    }

    // OBJETIVOS
    if (objectives.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Objetivos del SGCN`, { underline: true })
        .moveDown(1);

      objectives.forEach((obj, idx) => {
        checkPageSpace(100);
        
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${obj.description}`)
          .moveDown(0.3);

        doc.fontSize(10).font('Helvetica');
        
        if (obj.description) {
          const lines = doc.heightOfString(obj.description, { width: 500 });
          if (doc.y + lines > 700) doc.addPage();
          
          safeText(obj.description, { width: 500 });
        }
        
        doc.moveDown(0.5);
      });
    }

    // MATRIZ RACI
    if (raciMatrices.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Matriz RACI`, { underline: true })
        .moveDown(1);

      raciMatrices.forEach((raci, idx) => {
        checkPageSpace(150);
        
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${raci.processOrActivity}`)
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');

        // Parsear assignments que es JsonValue
        if (raci.assignments) {
          const assignments = typeof raci.assignments === 'string' 
            ? JSON.parse(raci.assignments) 
            : raci.assignments;
          
          if (assignments && typeof assignments === 'object') {
            const assignObj = assignments as any;
            if (assignObj.responsible) safeText(`Responsable (R): ${assignObj.responsible}`);
            if (assignObj.accountable) safeText(`Aprobador (A): ${assignObj.accountable}`);
            if (assignObj.consulted) safeText(`Consultado (C): ${assignObj.consulted}`);
            if (assignObj.informed) safeText(`Informado (I): ${assignObj.informed}`);
          }
        }
        
        doc.moveDown(1);
      });
    }

    // PROCESOS
    if (processes.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Procesos de Negocio`, { underline: true })
        .moveDown(1);

      processes.forEach((proc, idx) => {
        checkPageSpace(150);
        
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${proc.name}`)
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');

        if (proc.description) {
          const lines = doc.heightOfString(proc.description, { width: 500 });
          if (doc.y + lines > 700) doc.addPage();
          
          safeText(`Descripcion: ${proc.description}`, { width: 500 });
        }

        safeText(`Tipo: ${this.getProcessTypeLabel(proc.processType || 'CORE')}`);
        safeText(`Criticidad: ${this.getCriticalityLabel(proc.criticalityLevel)}`);
        safeText(`En analisis de continuidad: ${proc.includeInContinuityAnalysis ? 'Si' : 'No'}`);
        
        doc.moveDown(1);
      });
    }

    // Numeración de páginas
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Pagina ${i + 1} de ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });
  }

  private getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'DRAFT': 'Borrador',
      'IN_REVIEW': 'En Revision',
      'APPROVED': 'Aprobado',
      'PUBLISHED': 'Publicado',
    };
    return labels[status] || status;
  }

  private getProcessTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'STRATEGIC': 'Estrategico',
      'CORE': 'Misional',
      'SUPPORT': 'Soporte',
    };
    return labels[type] || type;
  }

  private getCriticalityLabel(level: string): string {
    const labels: { [key: string]: string } = {
      'CRITICAL': 'Critico',
      'HIGH': 'Alto',
      'MEDIUM': 'Medio',
      'LOW': 'Bajo',
    };
    return labels[level] || level;
  }

  async generateRiskSummary(
    dto: {
      includeMatrix?: boolean;
      includeControls?: boolean;
      includeTreatment?: boolean;
      filterByCategory?: string;
      filterByLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    },
    tenantId: string,
  ): Promise<Buffer> {
    this.logger.log(`Generando resumen de riesgos para tenant ${tenantId}`);

    // Obtener datos del tenant
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    // Obtener todos los riesgos con sus relaciones
    let where: any = { tenantId };
    if (dto.filterByCategory) {
      where.category = dto.filterByCategory;
    }

    const risks = await this.prisma.riskAssessment.findMany({
      where,
      include: {
        process: true,
      },
      orderBy: { scoreBefore: 'desc' },
    });

    // Filtrar por nivel si se especifica
    const filteredRisks = dto.filterByLevel
      ? risks.filter(r => this.getRiskLevel(Number(r.scoreBefore)) === dto.filterByLevel)
      : risks;

    // Calcular estadísticas
    const stats = {
      total: filteredRisks.length,
      critical: filteredRisks.filter(r => Number(r.scoreBefore) >= 15).length,
      high: filteredRisks.filter(r => Number(r.scoreBefore) >= 9 && Number(r.scoreBefore) < 15).length,
      medium: filteredRisks.filter(r => Number(r.scoreBefore) >= 5 && Number(r.scoreBefore) < 9).length,
      low: filteredRisks.filter(r => Number(r.scoreBefore) < 5).length,
      avgBefore: filteredRisks.length > 0
        ? filteredRisks.reduce((acc, r) => acc + Number(r.scoreBefore), 0) / filteredRisks.length
        : 0,
      avgAfter: filteredRisks.length > 0
        ? filteredRisks.reduce((acc, r) => acc + Number(r.scoreAfter || 0), 0) / filteredRisks.length
        : 0,
      withTreatment: filteredRisks.filter(r => Number(r.scoreAfter || r.scoreBefore) < Number(r.scoreBefore)).length,
    };

    // Crear PDF
    const doc = new PDFDocument({ margin: 50, bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Portada
    doc.addPage();
    doc.fontSize(24).text('RESUMEN DE RIESGOS', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Sistema de Gestion de Continuidad del Negocio', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Organizacion: ${tenant?.name || 'N/A'}`, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, { align: 'center' });
    doc.moveDown(4);
    doc.fontSize(10).text('ISO 22301:2019 Clausula 8.2.3 & ISO 31000:2018', { align: 'center' });

    // Resumen ejecutivo
    doc.addPage();
    doc.fontSize(18).text('RESUMEN EJECUTIVO');
    doc.moveDown();

    doc.fontSize(12).text('Estadisticas Generales:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total de Riesgos Identificados: ${stats.total}`);
    doc.text(`  - Criticos: ${stats.critical}`);
    doc.text(`  - Altos: ${stats.high}`);
    doc.text(`  - Medios: ${stats.medium}`);
    doc.text(`  - Bajos: ${stats.low}`);
    doc.moveDown();
    doc.text(`Riesgo Inherente Promedio: ${stats.avgBefore.toFixed(2)}`);
    doc.text(`Riesgo Residual Promedio: ${stats.avgAfter.toFixed(2)}`);
    const reduction = stats.avgBefore > 0 
      ? ((stats.avgBefore - stats.avgAfter) / stats.avgBefore * 100) 
      : 0;
    doc.text(`Reduccion de Riesgo: ${reduction.toFixed(1)}%`);
    doc.text(`Riesgos con Tratamiento: ${stats.withTreatment}`);

    // Tabla de riesgos
    doc.addPage();
    doc.fontSize(16).text('REGISTRO DE RIESGOS');
    doc.moveDown();

    // Encabezados de tabla
    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 150;
    const col3X = 350;
    const col4X = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('ID', col1X, tableTop);
    doc.text('Riesgo', col2X, tableTop);
    doc.text('Categoria', col3X, tableTop);
    doc.text('Nivel', col4X, tableTop);

    // Dibujar línea después de encabezados
    doc.moveTo(col1X, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    // Datos de riesgos
    doc.font('Helvetica');
    filteredRisks.forEach((risk, index) => {
      // Verificar espacio en página
      if (doc.y > 700) {
        doc.addPage();
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('ID', col1X, doc.y);
        doc.text('Riesgo', col2X, doc.y);
        doc.text('Categoria', col3X, doc.y);
        doc.text('Nivel', col4X, doc.y);
        doc.moveTo(col1X, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown();
        doc.font('Helvetica');
      }

      const startY = doc.y;
      doc.fontSize(9);
      doc.text(risk.riskId || risk.id.substring(0, 8), col1X, startY, { width: 90 });
      doc.text(risk.name.substring(0, 40), col2X, startY, { width: 190 });
      doc.text(risk.category, col3X, startY, { width: 90 });
      doc.text(this.getRiskLevelLabel(Number(risk.scoreBefore)), col4X, startY);

      doc.moveDown(0.5);
    });

    // Matriz de riesgos si se solicita
    if (dto.includeMatrix) {
      doc.addPage();
      doc.fontSize(16).text('MATRIZ DE RIESGOS');
      doc.moveDown();
      doc.fontSize(10).text('(Probabilidad x Impacto)');
      doc.moveDown();

      // Dibujar matriz simplificada
      const matrixStartX = 100;
      const matrixStartY = doc.y + 20;
      const cellSize = 60;

      // Etiquetas de impacto (eje Y)
      doc.fontSize(8);
      for (let i = 5; i >= 1; i--) {
        const y = matrixStartY + (5 - i) * cellSize + cellSize / 2;
        doc.text(i.toString(), matrixStartX - 20, y - 5);
      }

      // Etiquetas de probabilidad (eje X)
      for (let i = 1; i <= 5; i++) {
        const x = matrixStartX + (i - 1) * cellSize + cellSize / 2;
        doc.text(i.toString(), x - 5, matrixStartY + 5 * cellSize + 10);
      }

      // Dibujar celdas
      for (let prob = 1; prob <= 5; prob++) {
        for (let imp = 1; imp <= 5; imp++) {
          const score = prob * imp;
          const x = matrixStartX + (prob - 1) * cellSize;
          const y = matrixStartY + (5 - imp) * cellSize;

          // Color según nivel
          let color = '#90EE90'; // Verde
          if (score >= 15) color = '#FF6B6B'; // Rojo
          else if (score >= 9) color = '#FFA500'; // Naranja
          else if (score >= 5) color = '#FFD700'; // Amarillo

          doc.rect(x, y, cellSize, cellSize).fillAndStroke(color, '#000');

          // Número en la celda
          doc.fillColor('#000').fontSize(12);
          doc.text(score.toString(), x + cellSize / 2 - 5, y + cellSize / 2 - 5);
        }
      }

      doc.fillColor('#000'); // Resetear color
    }

    // Tratamiento de riesgos si se solicita
    if (dto.includeTreatment) {
      doc.addPage();
      doc.fontSize(16).text('TRATAMIENTO DE RIESGOS');
      doc.moveDown();

      const risksWithTreatment = filteredRisks.filter(r => Number(r.scoreAfter || r.scoreBefore) < Number(r.scoreBefore));

      if (risksWithTreatment.length === 0) {
        doc.fontSize(10).text('No hay riesgos con estrategia de tratamiento definida.');
      } else {
        risksWithTreatment.forEach(risk => {
          if (doc.y > 700) doc.addPage();

          doc.fontSize(12).font('Helvetica-Bold');
          doc.text(`${risk.riskId || risk.id.substring(0, 8)}: ${risk.name}`);
          doc.font('Helvetica').fontSize(10);
          doc.text(`Estrategia: Tratamiento aplicado`);
          doc.text(`Riesgo Inherente: ${Number(risk.scoreBefore).toFixed(1)} -> Residual: ${Number(risk.scoreAfter || risk.scoreBefore).toFixed(1)}`);

          doc.moveDown();
        });
      }
    }

    // Pie de página
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).text(
        `Pagina ${i + 1} de ${totalPages}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );
    }

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });
  }

  private getRiskLevel(score: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (score >= 15) return 'CRITICAL';
    if (score >= 9) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    return 'LOW';
  }

  private getRiskLevelLabel(score: number): string {
    const level = this.getRiskLevel(score);
    const labels = {
      'CRITICAL': 'Critico',
      'HIGH': 'Alto',
      'MEDIUM': 'Medio',
      'LOW': 'Bajo',
    };
    return labels[level];
  }

  private getTreatmentLabel(strategy?: string): string {
    const labels: { [key: string]: string } = {
      'AVOID': 'Evitar',
      'MITIGATE': 'Mitigar',
      'TRANSFER': 'Transferir',
      'ACCEPT': 'Aceptar',
    };
    return strategy ? labels[strategy] : 'Sin estrategia';
  }

  private getControlTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'PREVENTIVE': 'Preventivo',
      'DETECTIVE': 'Detectivo',
      'CORRECTIVE': 'Correctivo',
    };
    return labels[type] || type;
  }
}
