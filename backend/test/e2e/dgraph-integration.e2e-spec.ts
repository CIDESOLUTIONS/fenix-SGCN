import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DgraphService } from '../../src/dgraph/dgraph.service';

describe('E2E - Integración Dgraph y Sincronización (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let dgraphService: DgraphService;
  let tenantId = 'tenant_acme_corp';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dgraphService = moduleFixture.get<DgraphService>(DgraphService);
    await app.init();

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'ciso@acme-corp.com',
        password: 'Test123456!',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Sincronización PostgreSQL → Dgraph', () => {
    let processId: string;
    let biaId: string;

    it('debe crear proceso en PostgreSQL y sincronizar a Dgraph', async () => {
      const response = await request(app.getHttpServer())
        .post('/business-processes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Proceso de Prueba Sync',
          description: 'Test de sincronización',
          department: 'IT',
          criticalityLevel: 'HIGH',
          responsiblePerson: 'user_it_director',
        })
        .expect(201);

      processId = response.body.id;

      // Esperar sincronización
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar en Dgraph
      const dgraphQuery = `
        query {
          getProcess(func: eq(processId, "${processId}")) {
            uid
            processId
            name
            criticalityLevel
          }
        }
      `;

      const dgraphResult = await dgraphService.query(dgraphQuery);
      expect(dgraphResult.getProcess).toHaveLength(1);
      expect(dgraphResult.getProcess[0].name).toBe('Proceso de Prueba Sync');
    });

    it('debe crear BIA y sincronizar dependencias a Dgraph', async () => {
      const response = await request(app.getHttpServer())
        .post('/bia-assessments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          processId: processId,
          rto: 4,
          rpo: 2,
          mtpd: 8,
          financialImpact24h: 100000,
          dependencyMap: {
            dependencies: [
              { id: 'app_001', name: 'Aplicación Test', type: 'APPLICATION' },
              { id: 'supplier_001', name: 'Proveedor Test', type: 'SUPPLIER' },
            ],
          },
        })
        .expect(201);

      biaId = response.body.id;

      // Esperar sincronización
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar dependencias en Dgraph
      const dgraphQuery = `
        query {
          getProcess(func: eq(processId, "${processId}")) {
            uid
            name
            ~dependsOn {
              uid
              assetId
              name
              type
            }
          }
        }
      `;

      const dgraphResult = await dgraphService.query(dgraphQuery);
      expect(dgraphResult.getProcess[0]['~dependsOn']).toBeDefined();
    });

    it('debe consultar dependencias transitivas', async () => {
      const dgraphQuery = `
        query {
          getProcess(func: eq(processId, "${processId}")) @recurse(depth: 3) {
            uid
            name
            dependsOn {
              uid
              name
              type
            }
          }
        }
      `;

      const dgraphResult = await dgraphService.query(dgraphQuery);
      expect(dgraphResult.getProcess).toHaveLength(1);
    });
  });

  describe('2. Análisis SPOF (Single Point of Failure)', () => {
    it('debe identificar activos críticos compartidos', async () => {
      const response = await request(app.getHttpServer())
        .get('/dgraph/spof-analysis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('criticalAssets');
      expect(response.body).toHaveProperty('spofRisk');
    });

    it('debe calcular impacto de fallo', async () => {
      const response = await request(app.getHttpServer())
        .post('/dgraph/impact-analysis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assetId: 'app_erp',
          failureType: 'COMPLETE_OUTAGE',
        })
        .expect(200);

      expect(response.body).toHaveProperty('affectedProcesses');
      expect(response.body).toHaveProperty('totalImpact');
    });
  });

  describe('3. Consultas de Dependencias Complejas', () => {
    it('debe obtener dependencias upstream', async () => {
      const response = await request(app.getHttpServer())
        .get('/dgraph/upstream-dependencies/proc_payments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('dependencies');
    });

    it('debe obtener dependencias downstream', async () => {
      const response = await request(app.getHttpServer())
        .get('/dgraph/downstream-dependencies/app_erp')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('impactedProcesses');
    });

    it('debe calcular criticidad en cascada', async () => {
      const response = await request(app.getHttpServer())
        .post('/dgraph/cascade-criticality')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          startNodeId: 'proc_infrastructure',
        })
        .expect(200);

      expect(response.body).toHaveProperty('criticalityMap');
      expect(response.body).toHaveProperty('highRiskPaths');
    });
  });

  describe('4. Validación de Consistencia', () => {
    it('debe validar sincronización bidireccional', async () => {
      // Actualizar en PostgreSQL
      const updateResponse = await request(app.getHttpServer())
        .patch('/business-processes/proc_payments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Sistema de Pagos Actualizado',
        })
        .expect(200);

      // Esperar sincronización
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar actualización en Dgraph
      const dgraphQuery = `
        query {
          getProcess(func: eq(processId, "proc_payments")) {
            name
          }
        }
      `;

      const dgraphResult = await dgraphService.query(dgraphQuery);
      expect(dgraphResult.getProcess[0].name).toBe('Sistema de Pagos Actualizado');
    });

    it('debe manejar eliminación en cascada', async () => {
      // Crear proceso temporal
      const createResponse = await request(app.getHttpServer())
        .post('/business-processes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Proceso Temporal',
          department: 'IT',
          criticalityLevel: 'LOW',
        })
        .expect(201);

      const tempProcessId = createResponse.body.id;

      // Eliminar proceso
      await request(app.getHttpServer())
        .delete(`/business-processes/${tempProcessId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar eliminación en Dgraph
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dgraphQuery = `
        query {
          getProcess(func: eq(processId, "${tempProcessId}")) {
            uid
          }
        }
      `;

      const dgraphResult = await dgraphService.query(dgraphQuery);
      expect(dgraphResult.getProcess).toHaveLength(0);
    });
  });
});
