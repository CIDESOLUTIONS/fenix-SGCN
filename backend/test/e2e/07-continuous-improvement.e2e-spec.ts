import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Continuous Improvement Module (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Module 7 - Continuous Improvement', () => {
    it('should have continuous-improvement endpoints available', async () => {
      // Test basic endpoint availability
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/dashboard')
        .expect(401); // Expected since no auth token

      expect(response.body.message).toBeDefined();
    });

    it('should have findings endpoints configured', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/findings')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should have CAPA endpoints configured', async () => {
      const response = await request(app.getHttpServer())
        .post('/continuous-improvement/corrective-actions')
        .send({})
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should have KPI endpoints configured', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/kpis/test/trends')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should have management review endpoints configured', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/reports/management-review')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should have ISO 22301 compliance endpoints configured', async () => {
      const response = await request(app.getHttpServer())
        .get('/continuous-improvement/compliance/iso22301')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('Module 7 - Service Integration', () => {
    it('continuous-improvement module should be loaded', () => {
      const module = app.get(ContinuousImprovementService);
      expect(module).toBeDefined();
    });

    it('should have all required methods in service', () => {
      const service = app.get(ContinuousImprovementService);
      
      expect(service.createFinding).toBeDefined();
      expect(service.findAll).toBeDefined();
      expect(service.findOne).toBeDefined();
      expect(service.update).toBeDefined();
      expect(service.remove).toBeDefined();
      expect(service.createCorrectiveAction).toBeDefined();
      expect(service.updateActionStatus).toBeDefined();
      expect(service.performRootCauseAnalysis).toBeDefined();
      expect(service.getManagementReviewDashboard).toBeDefined();
      expect(service.getKPIs).toBeDefined();
      expect(service.getImprovementTrends).toBeDefined();
      expect(service.generateManagementReviewReport).toBeDefined();
      expect(service.convertGapToFinding).toBeDefined();
    });
  });
});

// Import service for testing
import { ContinuousImprovementService } from '../../src/continuous-improvement/continuous-improvement.service';