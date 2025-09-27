import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E - Flujo Completo de Usuario (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let tenantId = 'tenant_acme_corp';

  // IDs para seguimiento entre tests
  let objectiveId: string;
  let processId: string;
  let riskId: string;
  let biaId: string;
  let strategyId: string;
  let planId: string;
  let exerciseId: string;
  let findingId: string;
  let actionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Registro y Autenticación', () => {
    it('debe registrar un nuevo usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-user@acme-corp.com',
          fullName: 'Usuario de Prueba',
          password: 'Test123456!',
          tenantId: tenantId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test-user@acme-corp.com');
      userId = response.body.id;
    });

    it('debe hacer login y recibir token JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'ciso@acme-corp.com',
          password: 'Test123456!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      authToken = response.body.accessToken;
    });

    it('debe obtener perfil del usuario autenticado', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.email).toBe('ciso@acme-corp.com');
      expect(response.body.tenantId).toBe(tenantId);
    });

    it('debe rechazar acceso sin token', async () => {
      await request(app.getHttpServer())
        .get('/governance/policy')
        .expect(401);
    });
  });

  describe('2. Módulo 1 - Gobierno', () => {
    it('debe obtener la política del SGCN', async () => {
      const response = await request(app.getHttpServer())
        .get('/governance/policy')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('content');
      expect(response.body.status).toBe('APPROVED');
    });

    it('debe listar objetivos del SGCN', async () => {
      const response = await request(app.getHttpServer())
        .get('/governance/objectives')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
    });

    it('debe crear un nuevo objetivo', async () => {
      const response = await request(app.getHttpServer())
        .post('/governance/objectives')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Reducir tiempo de cierre de hallazgos',
          description: 'Reducir el tiempo promedio de cierre a 30 días',
          targetValue: '30',
          currentValue: '45',
          unit: 'días',
          targetDate: '2025-12-31',
          owner: 'user_ciso',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      objectiveId = response.body.id;
    });

    it('debe actualizar el objetivo creado', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/governance/objectives/${objectiveId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentValue: '40',
        })
        .expect(200);

      expect(response.body.currentValue).toBe('40');
    });
  });

  describe('3. Procesos de Negocio (Base)', () => {
    it('debe listar procesos existentes', async () => {
      const response = await request(app.getHttpServer())
        .get('/business-processes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      processId = response.body[0].id;
    });

    it('debe crear un nuevo proceso de negocio', async () => {
      const response = await request(app.getHttpServer())
        .post('/business-processes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Sistema de Inventario',
          description: 'Gestión de inventario y logística',
          department: 'OPERATIONS',
          criticalityLevel: 'HIGH',
          responsiblePerson: 'user_ops_manager',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Sistema de Inventario');
    });
  });

  describe('4. Módulo 2 - Riesgos (ARA)', () => {
    it('debe crear evaluación de riesgo', async () => {
      const response = await request(app.getHttpServer())
        .post('/risk-assessments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          processId: processId,
          riskTitle: 'Interrupción de Proveedor Crítico',
          riskDescription: 'Fallo del proveedor principal de servicios',
          category: 'EXTERNAL',
          likelihood: 3,
          impactFinancial: 4,
          impactOperational: 4,
          impactReputational: 3,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.inherentRiskScore).toBeGreaterThan(0);
      riskId = response.body.id;
    });

    it('debe obtener heatmap de riesgos', async () => {
      const response = await request(app.getHttpServer())
        .get('/risk-assessments/heatmap')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('matrix');
      expect(response.body).toHaveProperty('risks');
    });

    it('debe crear tratamiento de riesgo', async () => {
      const response = await request(app.getHttpServer())
        .post(`/risk-assessments/${riskId}/treatment`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          strategy: 'MITIGATE',
          description: 'Contratar proveedor secundario',
          owner: 'user_ops_manager',
          targetDate: '2025-06-30',
          status: 'PLANNED',
        })
        .expect(201);

      expect(response.body).toHaveProperty('strategy');
      expect(response.body.strategy).toBe('MITIGATE');
    });

    it('debe simular riesgo con Montecarlo', async () => {
      const response = await request(app.getHttpServer())
        .post(`/risk-assessments/${riskId}/simulate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          iterations: 1000,
          variables: {
            costPerHour: { min: 10000, max: 20000 },
            probability: { value: 0.3 },
          },
        })
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(response.body.results).toHaveProperty('mean');
    });
  });

  describe('5. Módulo 3 - BIA', () => {
    it('debe obtener sugerencias RTO/RPO', async () => {
      const response = await request(app.getHttpServer())
        .get(`/bia-assessments/process/${processId}/suggest-rto-rpo`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('suggestion');
      expect(response.body.suggestion).toHaveProperty('rto');
      expect(response.body.suggestion).toHaveProperty('rpo');
    });

    it('debe crear BIA', async () => {
      const response = await request(app.getHttpServer())
        .post('/bia-assessments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          processId: processId,
          rto: 8,
          rpo: 4,
          mtpd: 12,
          financialImpact24h: 200000,
          financialImpact48h: 500000,
          financialImpact72h: 1000000,
          operationalImpact: 'Retraso en entregas y pérdida de ventas',
          reputationalImpact: 'Insatisfacción de clientes',
          regulatoryImpact: 'Ninguno',
          dependencyMap: {
            dependencies: [
              { id: 'app_inventory', name: 'Software de Inventario', type: 'APPLICATION' },
              { id: 'supplier_logistics', name: 'Proveedor Logística', type: 'SUPPLIER' },
            ],
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.priorityScore).toBeGreaterThan(0);
      biaId = response.body.id;
    });

    it('debe obtener BIA con mapa de dependencias', async () => {
      const response = await request(app.getHttpServer())
        .get(`/bia-assessments/${biaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('dependencyMap');
      expect(response.body.dependencyMap.dependencies).toHaveLength(2);
    });

    it('debe obtener cobertura de BIA', async () => {
      const response = await request(app.getHttpServer())
        .get('/bia-assessments/coverage')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('coveragePercentage');
      expect(response.body.coveragePercentage).toBeGreaterThan(0);
    });
  });

  describe('6. Módulo 4 - Estrategias', () => {
    it('debe obtener recomendaciones de estrategias', async () => {
      const response = await request(app.getHttpServer())
        .get(`/continuity-strategies/recommend/${processId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('recommendations');
      expect(Array.isArray(response.body.recommendations)).toBe(true);
    });

    it('debe crear estrategia de continuidad', async () => {
      const response = await request(app.getHttpServer())
        .post('/continuity-strategies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          processId: processId,
          scenario: 'Procedimiento Manual Temporal',
          description: 'Activar procedimientos manuales mientras se restaura el sistema',
          type: 'MITIGATION',
          cost: 10000,
          implementationTime: 24,
          effectiveness: 3,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      strategyId = response.body.id;
    });

    it('debe validar estrategia contra RTO', async () => {
      const response = await request(app.getHttpServer())
        .get(`/continuity-strategies/${strategyId}/validate`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('isValid');
    });
  });

  describe('7. Módulo 5 - Planes', () => {
    it('debe crear plan de continuidad', async () => {
      const response = await request(app.getHttpServer())
        .post('/continuity-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Plan de Continuidad - Sistema de Inventario',
          processId: processId,
          planType: 'BCP',
          owner: 'user_ops_manager',
          approver: 'user_ciso',
          content: {
            objectives: ['Restaurar operaciones en 8 horas'],
            scope: 'Sistema de inventario y logística',
            procedures: [
              {
                step: 1,
                title: 'Activar procedimientos manuales',
                description: 'Iniciar registro manual de inventario',
                responsible: 'user_ops_manager',
              },
            ],
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      planId = response.body.id;
    });

    it('debe activar plan', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuity-plans/${planId}/activate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reason: 'Prueba de activación',
          severity: 'DRILL',
        })
        .expect(200);

      expect(response.body).toHaveProperty('activationId');
    });
  });

  describe('8. Módulo 6 - Ejercicios', () => {
    it('debe crear ejercicio', async () => {
      const response = await request(app.getHttpServer())
        .post('/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Ejercicio Tabletop - Inventario',
          type: 'TABLETOP',
          scenario: 'Fallo del sistema de inventario durante temporada alta',
          objectives: ['Validar procedimientos manuales'],
          planId: planId,
          scheduledDate: '2025-03-15T10:00:00Z',
          duration: 4,
          participants: ['user_ops_manager', 'user_ciso'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      exerciseId = response.body.id;
    });

    it('debe iniciar ejercicio', async () => {
      const response = await request(app.getHttpServer())
        .post(`/exercises/${exerciseId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('IN_PROGRESS');
    });

    it('debe registrar evento en ejercicio', async () => {
      const response = await request(app.getHttpServer())
        .post(`/exercises/${exerciseId}/log-event`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'DECISION',
          description: 'Equipo decide activar procedimientos manuales',
        })
        .expect(201);

      expect(response.body).toHaveProperty('event');
    });

    it('debe finalizar ejercicio', async () => {
      const response = await request(app.getHttpServer())
        .post(`/exercises/${exerciseId}/finish`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('score');
    });

    it('debe identificar brechas', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}/gaps`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('gaps');
    });
  });

  describe('9. Módulo 7 - Mejora Continua', () => {
    it('debe convertir brecha a hallazgo', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/exercises/${exerciseId}/convert-gap`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'ADAPTABILITY',
          severity: 'MEDIUM',
          title: 'Falta de proveedor terciario',
          description: 'No hay plan B cuando proveedor secundario falla',
          impact: 'Riesgo de interrupción prolongada',
          recommendation: 'Contratar proveedor terciario',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      findingId = response.body.id;
    });

    it('debe realizar RCA', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${findingId}/root-cause-analysis`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          method: '5 Whys',
          analysis: {
            why1: 'No hay proveedor terciario',
            why2: 'No se consideró en estrategia original',
          },
          rootCause: 'Proceso de BIA no analiza fallos en cadena',
        })
        .expect(201);

      expect(response.body).toHaveProperty('rootCause');
    });

    it('debe crear acción correctiva', async () => {
      const response = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${findingId}/corrective-actions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Mejorar proceso de BIA',
          description: 'Incluir análisis de cascada',
          actionType: 'CORRECTIVE',
          assignedTo: 'user_ciso',
          targetDate: '2025-05-31',
          priority: 'HIGH',
        })
        .expect(201);

      expect(response.body).toHaveProperty('action');
      actionId = response.body.action.id;
    });

    it('debe obtener KPIs', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/kpis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('findingResolutionRate');
      expect(response.body).toHaveProperty('exerciseSuccessRate');
    });

    it('debe obtener dashboard de revisión', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/management-review/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bcmsStatus');
      expect(response.body).toHaveProperty('recommendations');
    });
  });

  describe('10. Integración y Flujo Completo', () => {
    it('debe validar flujo: Ejercicio → Brecha → Hallazgo → CAPA', async () => {
      // 1. Ejercicio completado
      const exercise = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(exercise.body.status).toBe('COMPLETED');

      // 2. Hallazgo vinculado al ejercicio
      const finding = await request(app.getHttpServer())
        .get(`/continuous-improvement/findings/${findingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finding.body.source).toBe('EXERCISE');
      expect(finding.body.sourceReference).toBe(exerciseId);

      // 3. Acción correctiva existe
      expect(finding.body.correctiveActions).toHaveLength(1);
      expect(finding.body.correctiveActions[0].id).toBe(actionId);
    });

    it('debe validar drill-down entre módulos', async () => {
      // Desde hallazgo al ejercicio de origen
      const finding = await request(app.getHttpServer())
        .get(`/continuous-improvement/findings/${findingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const sourceExercise = await request(app.getHttpServer())
        .get(`/exercises/${finding.body.sourceReference}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(sourceExercise.body.id).toBe(exerciseId);

      // Desde ejercicio al plan
      const plan = await request(app.getHttpServer())
        .get(`/continuity-plans/${sourceExercise.body.planId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(plan.body.id).toBe(planId);

      // Desde plan al proceso
      const process = await request(app.getHttpServer())
        .get(`/business-processes/${plan.body.processId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(process.body.id).toBe(processId);
    });

    it('debe validar actualización de dashboards', async () => {
      const dashboard = await request(app.getHttpServer())
        .get('/bi-dashboard/main')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(dashboard.body).toHaveProperty('summary');
      expect(dashboard.body.summary.totalExercises).toBeGreaterThan(0);
      expect(dashboard.body.summary.totalFindings).toBeGreaterThan(0);
    });

    it('debe validar aislamiento de tenants', async () => {
      // Crear otro tenant y usuario
      const otherTenant = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'user@other-company.com',
          name: 'Other User',
          password: 'Test123456!',
          tenantId: 'tenant_other',
        })
        .expect(201);

      const otherLogin = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'user@other-company.com',
          password: 'Test123456!',
        })
        .expect(200);

      // Intentar acceder a datos del otro tenant debe fallar
      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${otherLogin.body.access_token}`)
        .expect(404);
    });
  });
});
