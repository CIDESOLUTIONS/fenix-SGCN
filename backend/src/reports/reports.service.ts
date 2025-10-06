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
}
