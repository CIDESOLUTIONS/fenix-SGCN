import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Risk Assessment Module E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let tenantId: string;
  let processId: string;
  let riskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    const testTenant = await prisma.tenant.create({
      data: {
        name: 'Test Tenant Risk',
        domain: 'test-risk.example.com',
        subscriptionPlan: 'PROFESSIONAL',
      },
    });
    tenantId = testTenant.id;

    const testUser = await prisma.user.create({
      data: {
        email: 'riskuser@test.com',
        password: '$2b$10$K7L/MQY6wQZvBMSZNNZ.6uBQBZB8B5OBKp8vKzH0kz0KqK0KZQK0K',
        fullName: 'Risk Test User',
        role: 'ADMIN',
        tenantId: tenantId,
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'riskuser@test.com',
        password: 'test123',
      });

    accessToken = loginResponse.body.access_token;

    const processResponse = await request(app.getHttpServer())
      .post('/business-processes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Proceso Crítico Test',
        processType: 'MISIONAL',
        description: 'Proceso para pruebas de riesgo',
        includeInContinuityAnalysis: true,
        prioritizationCriteria: {
          strategic: 5,
          operational: 5,
          financial: 4,
          regulatory: 3,
        },
      });

    processId = processResponse.body.id;
  });

  afterAll(async () => {
    await prisma.riskAssessment.deleteMany({ where: { tenantId } });
    await prisma.businessProcess.deleteMany({ where: { tenantId } });
    await prisma.user.deleteMany({ where: { tenantId } });
    await prisma.tenant.delete({ where: { id: tenantId } });
    await app.close();
  });

  describe('GET /business-processes/continuity/selected', () => {
    it('should return only processes included in continuity analysis', async () => {
      const response = await request(app.getHttpServer())
        .get('/business-processes/continuity/selected')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('includeInContinuityAnalysis', true);
      expect(response.body[0]).toHaveProperty('priorityScore');
    });
  });

  describe('POST /risk-assessments', () => {
    it('should create risk assessment with process linkage', async () => {
      const response = await request(app.getHttpServer())
        .post('/risk-assessments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          processId: processId,
          name: 'Fallo de Servidor Principal',
          description: 'Caída del servidor crítico',
          category: 'TECHNOLOGICAL',
          probabilityBefore: 4,
          impactBefore: 5,
          controls: ['Monitoreo 24/7', 'Servidor de respaldo'],
          probabilityAfter: 2,
          impactAfter: 3,
        })
        .expect(201);

      riskId = response.body.id;
      expect(response.body).toHaveProperty('scoreBefore', 26);
      expect(response.body).toHaveProperty('scoreAfter', 7.8);
    });
  });

  describe('POST /risk-assessments/:id/monte-carlo', () => {
    it('should execute Monte Carlo simulation', async () => {
      const response = await request(app.getHttpServer())
        .post(`/risk-assessments/${riskId}/monte-carlo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          impactMin: 10000,
          impactMost: 50000,
          impactMax: 200000,
          probabilityMin: 0.1,
          probabilityMax: 0.5,
          iterations: 10000,
        })
        .expect(201);

      expect(response.body.simulation.statistics).toHaveProperty('mean');
      expect(response.body.simulation.percentiles.p90).toBeGreaterThan(
        response.body.simulation.percentiles.p50
      );
    });
  });

  describe('GET /risk-assessments/heatmap', () => {
    it('should return risk heatmap matrix', async () => {
      const response = await request(app.getHttpServer())
        .get('/risk-assessments/heatmap')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('HIGH_HIGH');
    });
  });

  describe('DELETE /risk-assessments/:id', () => {
    it('should delete risk assessment', async () => {
      await request(app.getHttpServer())
        .delete(`/risk-assessments/${riskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
