import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E - Workflows y BI Dashboard (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let tenantId = 'tenant_acme_corp';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    console.log('🔐 Intentando login...');
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'ciso@acme-corp.com',
        password: 'Test123456!',
      });

    console.log('📊 Login response status:', loginResponse.status);
    console.log('📊 Login response body:', loginResponse.body);

    if (loginResponse.status !== 200 && loginResponse.status !== 201) {
      throw new Error(`Login failed: ${JSON.stringify(loginResponse.body)}`);
    }

    authToken = loginResponse.body.accessToken; // ✅ Correcto: accessToken (camelCase)
    
    if (!authToken) {
      throw new Error('No access_token in response');
    }

    console.log('✅ Token obtenido:', authToken.substring(0, 20) + '...');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Motor de Workflows', () => {
    let workflowId: string;
    let findingId: string;

    it('debe crear hallazgo que dispare workflow automático', async () => {
      console.log('🧪 Test: Creando hallazgo...');
      console.log('🔑 Token:', authToken ? 'OK' : 'MISSING');
      
      // Crear hallazgo
      const findingResponse = await request(app.getHttpServer())
        .post('/continuous-improvement/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Workflow Automático',
          description: 'Hallazgo para probar workflow',
          source: 'AUDIT',
          category: 'PROCESS',
          severity: 'MAJOR', // ✅ Correcto: CRITICAL, MAJOR o MINOR
        })
        .expect(201);

      findingId = findingResponse.body.id;

      // Crear acción correctiva (debe crear workflow automático)
      const actionResponse = await request(app.getHttpServer())
        .post(`/continuous-improvement/findings/${findingId}/corrective-actions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Acción Test',
          description: 'Acción para probar workflow',
          actionType: 'CORRECTIVE',
          assignedTo: 'user_ciso',
          targetDate: '2025-06-30',
          priority: 'HIGH',
        })
        .expect(201);

      expect(actionResponse.body).toHaveProperty('workflowId');
      workflowId = actionResponse.body.workflowId;
    });

    it('debe listar workflows activos', async () => {
      const response = await request(app.getHttpServer())
        .get('/workflows')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const workflow = response.body.find((w: any) => w.id === workflowId);
      expect(workflow).toBeDefined();
      expect(workflow.status).toBe('IN_PROGRESS');
    });

    it('debe obtener detalles del workflow', async () => {
      const response = await request(app.getHttpServer())
        .get(`/workflows/${workflowId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('steps');
      expect(response.body.steps).toHaveLength(2); // Implementar + Verificar
      expect(response.body.steps[0].type).toBe('TASK');
      expect(response.body.steps[1].type).toBe('APPROVAL');
    });

    it('debe completar paso del workflow', async () => {
      const workflow = await request(app.getHttpServer())
        .get(`/workflows/${workflowId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const firstStepId = workflow.body.steps[0].id;

      const response = await request(app.getHttpServer())
        .post(`/workflows/${workflowId}/steps/${firstStepId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Paso completado en test',
          evidence: 'URL de evidencia',
        })
        .expect(200);

      expect(response.body.steps[0].status).toBe('COMPLETED');
      expect(response.body.steps[1].status).toBe('PENDING');
    });
  });

  describe('2. BI Dashboard', () => {
    it('debe obtener métricas del dashboard principal', async () => {
      const response = await request(app.getHttpServer())
        .get('/bi-dashboard/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalRisks');
      expect(response.body).toHaveProperty('criticalProcesses');
      expect(response.body).toHaveProperty('plansCoverage');
      expect(response.body).toHaveProperty('exercisesCompleted');
    });

    it('debe obtener heatmap de riesgos', async () => {
      const response = await request(app.getHttpServer())
        .get('/bi-dashboard/risk-heatmap')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('probability');
      expect(response.body[0]).toHaveProperty('impact');
      expect(response.body[0]).toHaveProperty('count');
    });

    it('debe hacer drill-down desde dashboard a proceso específico', async () => {
      // 1. Obtener lista de procesos críticos del dashboard
      const dashboardResponse = await request(app.getHttpServer())
        .get('/bi-dashboard/critical-processes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const criticalProcess = dashboardResponse.body[0];

      // 2. Drill-down: obtener detalles del proceso
      const processResponse = await request(app.getHttpServer())
        .get(`/business-processes/${criticalProcess.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(processResponse.body.id).toBe(criticalProcess.id);

      // 3. Drill-down: obtener BIA del proceso
      const biaResponse = await request(app.getHttpServer())
        .get(`/bia-assessments?processId=${criticalProcess.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(biaResponse.body)).toBe(true);

      // 4. Drill-down: obtener planes asociados
      const plansResponse = await request(app.getHttpServer())
        .get(`/continuity-plans?processId=${criticalProcess.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(plansResponse.body)).toBe(true);
    });
  });
});
