import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { seedTestData } from './utils/seed-test-data';

describe('Módulo 7: Mejora Continua (E2E)', () => {
  let app: INestApplication;
  let authToken: string;
  let findingId: string;
  let actionId: string;
  let exerciseId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Seed y autenticación
    await seedTestData();
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'ceo@acme-corp.com',
        password: 'Test123456!',
      })
      .expect(200);

    authToken = loginResponse.body.accessToken;

    // Obtener ID de ejercicio existente
    const exercises = await request(app.getHttpServer())
      .get('/exercises')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    exerciseId = exercises.body[0]?.id;
  }, 60000); // Timeout de 60 segundos

  afterAll(async () => {
    await app.close();
  });

  describe('1. Gestión de Hallazgos (Findings)', () => {
    it('debe crear un hallazgo de ejercicio', async () => {
      const response = await request(app.getHttpServer())
        .post('/continuous-improvement/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Plan de respaldo no actualizado',
          description: 'Durante el ejercicio se detectó que el plan de respaldo tiene información obsoleta',
          source: 'EXERCISE',
          sourceReference: exerciseId,
          category: 'DOCUMENTATION',
          severity: 'HIGH',
          affectedArea: 'Plan de Continuidad TI',
          impact: 'Puede causar confusión durante un incidente real',
          recommendation: 'Actualizar contactos y procedimientos del plan',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('OPEN');
      expect(response.body.severity).toBe('HIGH');
      findingId = response.body.id;
    });

    it('debe listar hallazgos con filtros', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/findings?severity=HIGH&status=OPEN')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].severity).toBe('HIGH');
    });

    it('debe obtener un hallazgo por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/continuous-improvement/findings/${findingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(findingId);
      expect(response.body).toHaveProperty('correctiveActions');
    });
  });

  describe('2. Root Cause Analysis (RCA)', () => {
    it('debe realizar análisis de causa raíz usando 5 Whys', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${findingId}/root-cause-analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          method: '5 Whys',
          analysis: {
            why1: '¿Por qué el plan tiene info obsoleta? - No se actualizó en 6 meses',
            why2: '¿Por qué no se actualizó? - No hay proceso de revisión periódica',
            why3: '¿Por qué no hay proceso? - No está en el calendario de actividades',
            why4: '¿Por qué no está en calendario? - Falta de planificación del SGCN',
            why5: '¿Por qué falta planificación? - No hay responsable asignado',
          },
          rootCause: 'Falta de responsable asignado para mantenimiento del SGCN',
          contributingFactors: [
            'Alta rotación de personal',
            'Falta de capacitación',
            'No hay herramienta de seguimiento',
          ],
          performedBy: 'CISO',
        })
        .expect(201);

      expect(response.body).toHaveProperty('rootCause');
      expect(response.body.message).toContain('completado');
    });
  });

  describe('3. Acciones Correctivas (CAPA)', () => {
    it('debe crear acción correctiva con workflow', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${findingId}/corrective-actions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Implementar proceso de revisión trimestral de planes',
          description: 'Crear y documentar proceso formal de revisión cada 3 meses',
          actionType: 'CORRECTIVE',
          assignedTo: 'user_bcm_manager',
          targetDate: '2025-12-31',
          priority: 'HIGH',
          estimatedCost: '5000 USD',
        })
        .expect(201);

      expect(response.body).toHaveProperty('action');
      expect(response.body).toHaveProperty('workflowId');
      expect(response.body.action.status).toBe('PLANNED');
      actionId = response.body.action.id;
    });

    it('debe actualizar estado de acción correctiva', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/continuous-improvement/corrective-actions/${actionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'IN_PROGRESS',
          notes: 'Se inició implementación del proceso de revisión',
        })
        .expect(200);

      expect(response.body.status).toBe('IN_PROGRESS');
    });

    it('debe completar acción y cerrar hallazgo automáticamente', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/continuous-improvement/corrective-actions/${actionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'COMPLETED',
          notes: 'Proceso implementado y documentado. Calendario actualizado.',
        })
        .expect(200);

      expect(response.body.status).toBe('COMPLETED');

      // Verificar que el hallazgo se cerró
      const finding = await request(app.getHttpServer())
        .get(`/continuous-improvement/findings/${findingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finding.body.status).toBe('RESOLVED');
    });
  });

  describe('4. KPIs del SGCN', () => {
    it('debe obtener KPIs completos', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/kpis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('findingResolutionRate');
      expect(response.body).toHaveProperty('avgActionClosureTime');
      expect(response.body).toHaveProperty('exerciseSuccessRate');
      expect(response.body).toHaveProperty('biaCoverage');
      expect(response.body).toHaveProperty('planUpdateRate');
      expect(response.body).toHaveProperty('findingsBySource');
      expect(response.body).toHaveProperty('improvementTrend');
    });
  });

  describe('5. Dashboard de Revisión por la Dirección', () => {
    it('debe obtener dashboard completo ISO 22301 Cl. 9.3', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/management-review/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('period');
      expect(response.body).toHaveProperty('bcmsStatus');
      expect(response.body).toHaveProperty('capaPerformance');
      expect(response.body).toHaveProperty('exerciseResults');
      expect(response.body).toHaveProperty('programCoverage');
      expect(response.body).toHaveProperty('contextChanges');
      expect(response.body).toHaveProperty('recommendations');

      // Verificar estructura de bcmsStatus
      expect(response.body.bcmsStatus).toHaveProperty('totalFindings');
      expect(response.body.bcmsStatus).toHaveProperty('openFindings');
      expect(response.body.bcmsStatus).toHaveProperty('resolvedFindings');

      // Verificar que hay recomendaciones
      expect(Array.isArray(response.body.recommendations)).toBe(true);
    });
  });

  describe('6. Generación de Reportes', () => {
    it('debe generar reporte de revisión por la dirección', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/management-review/report')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('reportData');
      expect(response.body).toHaveProperty('pdfUrl');
      expect(response.body.reportData).toHaveProperty('sections');
      expect(response.body.reportData.sections.length).toBe(8);
    });
  });

  describe('7. Tendencias de Mejora', () => {
    it('debe obtener tendencias de los últimos 12 meses', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/trends?months=12')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(12);
      expect(response.body[0]).toHaveProperty('month');
      expect(response.body[0]).toHaveProperty('newFindings');
      expect(response.body[0]).toHaveProperty('resolvedFindings');
      expect(response.body[0]).toHaveProperty('completedActions');
    });
  });

  describe('8. Integración con Ejercicios', () => {
    it('debe convertir brecha de ejercicio en hallazgo', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/exercises/${exerciseId}/convert-gap`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Tiempo de respuesta excedido',
          description: 'El equipo tardó 6 horas en activar el plan cuando el RTO es 4h',
          category: 'PERFORMANCE',
          severity: 'HIGH',
          impact: 'Puede causar pérdida de clientes',
          recommendation: 'Mejorar capacitación y notificaciones automáticas',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.source).toBe('EXERCISE');
      expect(response.body.sourceReference).toBe(exerciseId);
    });
  });

  describe('9. CRUD de Hallazgos', () => {
    it('debe actualizar un hallazgo', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/continuous-improvement/findings/${findingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          severity: 'MEDIUM',
          description: 'Descripción actualizada después de revisión',
        })
        .expect(200);

      expect(response.body.message).toContain('actualizado');
    });

    it('debe eliminar un hallazgo', async () => {
      // Crear uno nuevo para eliminarlo
      const created = await request(app.getHttpServer())
        .post('/continuous-improvement/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Hallazgo temporal para test',
          description: 'Este será eliminado',
          source: 'AUDIT',
          category: 'DOCUMENTATION',
          severity: 'LOW',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/continuous-improvement/findings/${created.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toContain('eliminado');
    });
  });

  describe('10. Flujo Completo PDCA', () => {
    it('debe validar ciclo completo: Hallazgo → RCA → CAPA → Resolución', async () => {
      // 1. Crear hallazgo
      const finding = await request(app.getHttpServer())
        .post('/continuous-improvement/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test PDCA Completo',
          description: 'Hallazgo para validar ciclo completo',
          source: 'MANAGEMENT_REVIEW',
          category: 'EXECUTION',
          severity: 'MEDIUM',
        })
        .expect(201);

      // 2. RCA
      await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${finding.body.id}/root-cause-analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          method: 'Fishbone',
          analysis: { cause: 'Test' },
          rootCause: 'Causa raíz identificada',
        })
        .expect(201);

      // 3. CAPA
      const capa = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${finding.body.id}/corrective-actions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Acción PDCA',
          description: 'Test',
          actionType: 'CORRECTIVE',
          assignedTo: 'user_bcm_manager',
          targetDate: '2025-12-31',
          priority: 'MEDIUM',
        })
        .expect(201);

      // 4. Completar
      await request(app.getHttpServer())
        .patch(`/continuous-improvement/corrective-actions/${capa.body.action.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'COMPLETED',
          notes: 'Test completado',
        })
        .expect(200);

      // 5. Verificar cierre
      const final = await request(app.getHttpServer())
        .get(`/continuous-improvement/findings/${finding.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(final.body.status).toBe('RESOLVED');
    });
  });
});
