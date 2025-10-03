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
    userId: string,
  ): Promise<Buffer> {
    this.logger.log(`Generando documento de planeación para tenant ${tenantId}`);

    // Obtener datos
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

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

    // Crear PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Portada
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Documento de Planeación y Gobierno', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(16)
      .font('Helvetica')
      .text('Sistema de Gestión de Continuidad de Negocio (SGCN)', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(14)
      .text(`Organización: ${tenant?.name || 'Sin nombre'}`, { align: 'center' })
      .text(`Generado por: ${user?.fullName || user?.email || 'Usuario'}`, { align: 'center' })
      .text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' })
      .moveDown(3);

    doc.addPage();

    // Tabla de contenidos
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Tabla de Contenidos', { underline: true })
      .moveDown(1);

    let section = 1;
    doc.fontSize(12).font('Helvetica');

    if (contexts.length > 0) doc.text(`${section++}. Contexto de Negocio y Análisis FODA`);
    if (policies.length > 0) doc.text(`${section++}. Políticas del SGCN`);
    if (objectives.length > 0) doc.text(`${section++}. Objetivos del SGCN`);
    if (raciMatrices.length > 0) doc.text(`${section++}. Matriz RACI`);
    if (processes.length > 0) doc.text(`${section++}. Procesos de Negocio`);

    // Resetear contador de secciones
    section = 1;

    // Contextos de Negocio
    if (contexts.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Contexto de Negocio y Análisis FODA`, { underline: true })
        .moveDown(1);

      contexts.forEach((context, idx) => {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${context.title}`)
          .moveDown(0.5);

        doc.fontSize(11).font('Helvetica');

        if (context.description) {
          doc.text(`Descripción: ${context.description}`).moveDown(0.3);
        }

        doc
          .text(`Fecha de elaboración: ${new Date(context.elaborationDate).toLocaleDateString('es-ES')}`)
          .text(`Estado: ${this.getStatusLabel(context.status)}`)
          .moveDown(0.5);

        if (context.content) {
          doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Contenido:', { continued: false })
            .moveDown(0.3);

          doc
            .fontSize(10)
            .font('Helvetica')
            .text(context.content, { align: 'justify' })
            .moveDown(0.5);
        }

        // Análisis FODA
        if (context.swotAnalyses && context.swotAnalyses.length > 0) {
          doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Análisis FODA:')
            .moveDown(0.3);

          context.swotAnalyses.forEach((swot: any) => {
            doc.fontSize(11).font('Helvetica-Bold').text(`- ${swot.title}`);
            doc.fontSize(10).font('Helvetica');
            if (swot.description) doc.text(`  ${swot.description}`);
            doc.text(`  Facilitador: ${swot.facilitator}`);
            if (swot.participants?.length) {
              doc.text(`  Participantes: ${swot.participants.join(', ')}`);
            }
            
            // Mostrar elementos FODA completos
            if (swot.strengths?.length) {
              doc.moveDown(0.3).font('Helvetica-Bold').text('  Fortalezas:').font('Helvetica');
              swot.strengths.forEach((s: string) => doc.text(`    • ${s}`));
            }
            if (swot.weaknesses?.length) {
              doc.moveDown(0.3).font('Helvetica-Bold').text('  Debilidades:').font('Helvetica');
              swot.weaknesses.forEach((w: string) => doc.text(`    • ${w}`));
            }
            if (swot.opportunities?.length) {
              doc.moveDown(0.3).font('Helvetica-Bold').text('  Oportunidades:').font('Helvetica');
              swot.opportunities.forEach((o: string) => doc.text(`    • ${o}`));
            }
            if (swot.threats?.length) {
              doc.moveDown(0.3).font('Helvetica-Bold').text('  Amenazas:').font('Helvetica');
              swot.threats.forEach((t: string) => doc.text(`    • ${t}`));
            }
            
            // Análisis de cruzamientos
            if (swot.crossingAnalysis) {
              doc.moveDown(0.3).font('Helvetica-Bold').text('  Análisis de Cruzamientos (IA):').font('Helvetica');
              doc.text(swot.crossingAnalysis, { align: 'justify' });
            }
            
            doc.moveDown(0.5);
          });
        }

        doc.moveDown(1);
      });
    }

    // Políticas
    if (policies.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Políticas del SGCN`, { underline: true })
        .moveDown(1);

      policies.forEach((policy, idx) => {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${policy.title} (v${policy.version})`)
          .moveDown(0.5);

        doc.fontSize(11).font('Helvetica');
        doc.text(`Estado: ${this.getStatusLabel(policy.status)}`);
        doc.text(`Creado: ${new Date(policy.createdAt).toLocaleDateString('es-ES')}`);
        
        if (policy.approvedAt) {
          doc.text(`Aprobado: ${new Date(policy.approvedAt).toLocaleDateString('es-ES')}`);
        }

        if (policy.content) {
          doc.moveDown(0.5);
          doc
            .fontSize(10)
            .text(policy.content, { align: 'justify' });
        }

        doc.moveDown(1);
      });
    }

    // Objetivos
    if (objectives.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Objetivos del SGCN`, { underline: true })
        .moveDown(1);

      objectives.forEach((objective, idx) => {
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${objective.description}`)
          .moveDown(0.3);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Criterio de medición: ${objective.measurementCriteria || 'No definido'}`);
        doc.text(`Estado: ${this.getObjectiveStatusLabel(objective.status)}`);
        doc.text(`Progreso: ${objective.progress}%`);
        doc.text(`Responsable: ${objective.owner || 'No asignado'}`);
        if (objective.targetDate) {
          doc.text(`Fecha objetivo: ${new Date(objective.targetDate).toLocaleDateString('es-ES')}`);
        }
        doc.moveDown(0.8);
      });
    }

    // Matriz RACI
    if (raciMatrices.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Matriz RACI`, { underline: true })
        .moveDown(1);

      raciMatrices.forEach((matrix, idx) => {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${matrix.processOrActivity}`)
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');

        if (matrix.assignments && Array.isArray(matrix.assignments)) {
          matrix.assignments.forEach((assignment: any) => {
            const raciLabel = this.getRaciLabel(assignment.raciType);
            doc.text(
              `• ${assignment.role || 'Sin rol'}: ${raciLabel} - ${assignment.responsibility || 'Sin responsabilidad'}`
            );
          });
        }

        doc.moveDown(1);
      });
    }

    // Procesos de Negocio
    if (processes.length > 0) {
      doc.addPage();
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(`${section++}. Procesos de Negocio Seleccionados para Análisis`, { underline: true })
        .moveDown(1);

      processes.forEach((process, idx) => {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`${section - 1}.${idx + 1} ${process.name}`)
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');

        if (process.description) {
          doc.text(`Descripción: ${process.description}`).moveDown(0.3);
        }

        if (process.processType) {
          doc.text(`Tipo: ${this.getProcessTypeLabel(process.processType)}`);
        }

        if (process.priorityScore !== null && process.priorityScore !== undefined) {
          doc.text(`Puntuación de prioridad: ${Number(process.priorityScore).toFixed(2)}/10`);
        }

        doc.text(`Incluido en análisis de continuidad: ${process.includeInContinuityAnalysis ? 'Sí' : 'No'}`);
        
        // Caracterización de alto nivel
        if (process.highLevelCharacterization) {
          doc.moveDown(0.3).font('Helvetica-Bold').text('Caracterización de Alto Nivel:').font('Helvetica');
          doc.text(process.highLevelCharacterization, { align: 'justify' });
        }
        
        // Criterios de priorización
        if (process.prioritizationCriteria) {
          doc.moveDown(0.3).font('Helvetica-Bold').text('Criterios de Priorización:').font('Helvetica');
          const criteria = process.prioritizationCriteria as any;
          if (criteria.strategic) doc.text(`  • Estratégico: ${criteria.strategic}/10`);
          if (criteria.operational) doc.text(`  • Operacional: ${criteria.operational}/10`);
          if (criteria.financial) doc.text(`  • Financiero: ${criteria.financial}/10`);
          if (criteria.regulatory) doc.text(`  • Regulatorio: ${criteria.regulatory}/10`);
        }

        doc.moveDown(1);
      });
    }

    // Footer en todas las páginas
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          `Documento generado por Fenix-SGCN | Página ${i + 1} de ${range.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Borrador',
      REVIEW: 'En Revisión',
      APPROVED: 'Aprobado',
      ACTIVE: 'Activo',
    };
    return labels[status] || status;
  }

  private getObjectiveStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      NOT_STARTED: 'No Iniciado',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
      ON_HOLD: 'En Pausa',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  }

  private getRaciLabel(raciType: string): string {
    const labels: Record<string, string> = {
      RESPONSIBLE: 'Responsable',
      ACCOUNTABLE: 'Aprobador',
      CONSULTED: 'Consultado',
      INFORMED: 'Informado',
    };
    return labels[raciType] || raciType;
  }

  private getProcessTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      STRATEGIC: 'Estratégico',
      CORE: 'Misional',
      SUPPORT: 'Soporte',
    };
    return labels[type] || type;
  }
}
