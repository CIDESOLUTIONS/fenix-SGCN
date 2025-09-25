import { Injectable, Logger } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import * as Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import { promises as fs } from 'fs';

export enum ReportFormat {
  PDF = 'PDF',
  DOCX = 'DOCX',
  JSON = 'JSON',
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  format: ReportFormat;
}

@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);

  /**
   * Generar reporte en PDF
   */
  async generatePDFReport(data: any, template: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFKit({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Fenix-SGCN', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(data.title || 'Reporte de Continuidad de Negocio', { align: 'center' });
      doc.moveDown(2);

      // Metadata
      doc.fontSize(10);
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`);
      doc.text(`Organización: ${data.tenantName || 'N/A'}`);
      doc.moveDown();

      // Content sections
      if (data.sections) {
        data.sections.forEach((section: any) => {
          doc.fontSize(14).text(section.title, { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(10).text(section.content);
          doc.moveDown();
        });
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Página ${i + 1} de ${pageCount}`,
          50,
          doc.page.height - 50,
          { align: 'center' },
        );
      }

      doc.end();
    });
  }

  /**
   * Generar reporte en DOCX usando plantilla
   */
  async generateDOCXReport(data: any, templatePath: string): Promise<Buffer> {
    try {
      const content = await fs.readFile(templatePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      const buffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });

      return buffer;
    } catch (error) {
      this.logger.error('Error generating DOCX report', error);
      throw error;
    }
  }

  /**
   * Reporte de Revisión por la Dirección (ISO 22301 Cláusula 9.3)
   */
  async generateManagementReviewReport(tenantId: string, data: any): Promise<Buffer> {
    const reportData = {
      title: 'Reporte de Revisión por la Dirección',
      tenantName: data.tenantName,
      sections: [
        {
          title: '1. Estado del SGCN',
          content: `Estado general: ${data.sgcnStatus}\nÚltima actualización: ${data.lastUpdate}`,
        },
        {
          title: '2. Resultados de Auditorías',
          content: data.auditResults || 'No se han realizado auditorías en el período.',
        },
        {
          title: '3. Cumplimiento de Objetivos',
          content: `Objetivos cumplidos: ${data.objectivesMet}/${data.totalObjectives}`,
        },
        {
          title: '4. Resultados de Pruebas',
          content: `Ejercicios realizados: ${data.testsCompleted}\nTasa de éxito: ${data.testSuccessRate}%`,
        },
        {
          title: '5. Acciones Correctivas Pendientes',
          content: `Total: ${data.openActions}\nVencidas: ${data.overdueActions}`,
        },
        {
          title: '6. Cambios en el Contexto',
          content: data.contextChanges || 'No se identificaron cambios significativos.',
        },
        {
          title: '7. Recomendaciones',
          content: data.recommendations?.join('\n') || 'Sin recomendaciones.',
        },
      ],
    };

    return this.generatePDFReport(reportData, 'management-review');
  }

  /**
   * Reporte de Análisis de Impacto de Negocio (BIA)
   */
  async generateBIAReport(tenantId: string, data: any): Promise<Buffer> {
    const reportData = {
      title: 'Reporte de Análisis de Impacto de Negocio (BIA)',
      tenantName: data.tenantName,
      sections: [
        {
          title: 'Resumen Ejecutivo',
          content: `Total de procesos evaluados: ${data.totalProcesses}\nProcesos críticos: ${data.criticalProcesses}`,
        },
        {
          title: 'Procesos Críticos',
          content: data.criticalProcessList?.map((p: any) => 
            `- ${p.name} (RTO: ${p.rto}h, RPO: ${p.rpo}h)`
          ).join('\n') || 'No hay procesos críticos definidos.',
        },
        {
          title: 'Dependencias Identificadas',
          content: `Total de dependencias: ${data.totalDependencies}\nPuntos únicos de fallo: ${data.spofCount}`,
        },
        {
          title: 'Análisis de Impacto Financiero',
          content: data.financialImpact || 'Pendiente de análisis cuantitativo.',
        },
      ],
    };

    return this.generatePDFReport(reportData, 'bia-report');
  }

  /**
   * Reporte de Evaluación de Riesgos
   */
  async generateRiskAssessmentReport(tenantId: string, data: any): Promise<Buffer> {
    const reportData = {
      title: 'Reporte de Evaluación de Riesgos de Continuidad',
      tenantName: data.tenantName,
      sections: [
        {
          title: 'Panorama General de Riesgos',
          content: `Total de riesgos: ${data.totalRisks}\nRiesgos altos: ${data.highRisks}\nRiesgos medios: ${data.mediumRisks}\nRiesgos bajos: ${data.lowRisks}`,
        },
        {
          title: 'Top 10 Riesgos Críticos',
          content: data.topRisks?.map((r: any, i: number) => 
            `${i + 1}. ${r.name} (Impacto: ${r.impact}, Probabilidad: ${r.likelihood})`
          ).join('\n') || 'No hay riesgos críticos.',
        },
        {
          title: 'Planes de Tratamiento',
          content: `Planes implementados: ${data.treatmentPlans}\nPendientes: ${data.pendingTreatments}`,
        },
      ],
    };

    return this.generatePDFReport(reportData, 'risk-assessment');
  }

  /**
   * Reporte de Pruebas y Ejercicios
   */
  async generateTestExerciseReport(tenantId: string, exerciseId: string, data: any): Promise<Buffer> {
    const reportData = {
      title: `Reporte de Ejercicio: ${data.exerciseName}`,
      tenantName: data.tenantName,
      sections: [
        {
          title: 'Información del Ejercicio',
          content: `Tipo: ${data.exerciseType}\nFecha: ${data.exerciseDate}\nDuración: ${data.duration}`,
        },
        {
          title: 'Objetivos',
          content: data.objectives?.join('\n') || 'No se definieron objetivos.',
        },
        {
          title: 'Resultados',
          content: `RTO objetivo: ${data.targetRTO}h\nRTO alcanzado: ${data.actualRTO}h\nEstado: ${data.status}`,
        },
        {
          title: 'Observaciones',
          content: data.observations || 'Sin observaciones.',
        },
        {
          title: 'Lecciones Aprendidas',
          content: data.lessonsLearned?.join('\n') || 'No se documentaron lecciones.',
        },
        {
          title: 'Acciones Correctivas',
          content: data.correctiveActions?.map((a: any) => 
            `- ${a.description} (Responsable: ${a.assignee}, Fecha: ${a.dueDate})`
          ).join('\n') || 'No se requieren acciones correctivas.',
        },
      ],
    };

    return this.generatePDFReport(reportData, 'test-exercise');
  }
}
