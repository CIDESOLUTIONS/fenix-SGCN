import { Test, TestingModule } from '@nestjs/testing';
import { ContinuousImprovementService } from './continuous-improvement.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';

describe('ContinuousImprovementService - Módulo 7: Mejora Continua', () => {
  let service: ContinuousImprovementService;
  let prisma: PrismaService;

  const mockPrismaService = {
    finding: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    correctiveAction: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockWorkflowService = {
    createCAPAWorkflow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContinuousImprovementService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WorkflowEngineService, useValue: mockWorkflowService },
      ],
    }).compile();

    service = module.get<ContinuousImprovementService>(ContinuousImprovementService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Registro de Hallazgos (ISO 22301 Cl. 10)', () => {
    const mockFinding = {
      id: 'finding-001',
      tenantId: 'test-tenant-001',
      title: 'Plan desactualizado',
      description: 'El plan DR contiene información obsoleta',
      source: 'AUDIT',
      severity: 'MAJOR',
      status: 'OPEN',
      identifiedBy: 'user-auditor',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('debe crear hallazgo desde auditoría', async () => {
      mockPrismaService.finding.create.mockResolvedValue(mockFinding);

      const result = await service.createFinding(
        {
          title: 'Plan desactualizado',
          description: 'El plan DR contiene información obsoleta',
          source: 'AUDIT',
          severity: 'MAJOR',
          category: 'DOCUMENTATION',
        },
        'test-tenant-001',
        'user-auditor'
      );

      expect(result.source).toBe('AUDIT');
      expect(result.severity).toBe('MAJOR');
    });

    it('debe consolidar hallazgos de múltiples fuentes', async () => {
      mockPrismaService.finding.findMany.mockResolvedValue([
        { source: 'AUDIT', severity: 'MAJOR' },
        { source: 'EXERCISE', severity: 'MINOR' },
        { source: 'INCIDENT', severity: 'CRITICAL' },
      ]);

      const consolidated = await service.getAllFindings('test-tenant-001');

      expect(consolidated).toHaveLength(3);
      expect(consolidated[0].source).toBe('INCIDENT'); // CRITICAL primero
    });
  });

  describe('Flujo CAPA (Acciones Correctivas)', () => {
    const mockCAPA = {
      id: 'capa-001',
      tenantId: 'test-tenant-001',
      findingId: 'finding-001',
      title: 'Actualizar plan DR',
      actionPlan: 'Revisar y actualizar documentación',
      responsible: 'user-ciso',
      dueDate: new Date('2025-11-30'),
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('debe crear CAPA con workflow automático', async () => {
      mockPrismaService.correctiveAction.create.mockResolvedValue(mockCAPA);
      mockWorkflowService.createCAPAWorkflow.mockResolvedValue({
        id: 'workflow-001',
        steps: [
          { type: 'TASK', assignee: 'user-ciso' },
          { type: 'APPROVAL', assignee: 'user-ceo' },
        ],
      });

      const result = await service.createCorrectiveAction(
        'finding-001',
        {
          title: 'Actualizar plan DR',
          actionPlan: 'Revisar y actualizar documentación',
          responsible: 'user-ciso',
          dueDate: new Date('2025-11-30'),
        },
        'test-tenant-001'
      );

      expect(result.status).toBe('OPEN');
      expect(mockWorkflowService.createCAPAWorkflow).toHaveBeenCalled();
    });

    it('debe escalar si CAPA vence sin completarse', async () => {
      const overdue = await service.checkOverdueActions('test-tenant-001');

      expect(overdue).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            daysOverdue: expect.any(Number),
            escalated: true,
          }),
        ])
      );
    });

    it('debe verificar efectividad de acción correctiva', async () => {
      const verification = await service.verifyEffectiveness('capa-001', {
        verifiedBy: 'user-auditor',
        effective: true,
        evidence: 'Plan actualizado y probado',
      });

      expect(verification.status).toBe('VERIFIED');
    });
  });

  describe('Panel Revisión por la Dirección', () => {
    it('debe generar datos para revisión ISO 22301 Cl. 9.3', async () => {
      const dashboardData = await service.getManagementReviewDashboard('test-tenant-001');

      expect(dashboardData).toHaveProperty('openActions');
      expect(dashboardData).toHaveProperty('objectivesProgress');
      expect(dashboardData).toHaveProperty('testResults');
      expect(dashboardData).toHaveProperty('riskLandscape');
      expect(dashboardData).toHaveProperty('stakeholderFeedback');
    });

    it('debe exportar informe de revisión en PDF', async () => {
      const pdf = await service.generateManagementReviewReport('test-tenant-001');

      expect(pdf).toHaveProperty('buffer');
      expect(pdf.mimeType).toBe('application/pdf');
    });
  });

  describe('KPIs y Analítica', () => {
    it('debe calcular KPIs del SGCN', async () => {
      const kpis = await service.calculateKPIs('test-tenant-001');

      expect(kpis).toMatchObject({
        planCoverage: expect.any(Number), // %
        planUpdateRate: expect.any(Number), // %
        exerciseSuccessRate: expect.any(Number), // %
        capaClosureTime: expect.any(Number), // días promedio
        biaCoverage: expect.any(Number), // %
      });
    });

    it('debe mostrar tendencia de mejora', async () => {
      const trend = await service.getImprovementTrend('test-tenant-001', {
        metric: 'exerciseSuccessRate',
        period: 'last12months',
      });

      expect(trend).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            month: expect.any(String),
            value: expect.any(Number),
          }),
        ])
      );

      // Verificar tendencia positiva
      const lastValue = trend[trend.length - 1].value;
      const firstValue = trend[0].value;
      expect(lastValue).toBeGreaterThanOrEqual(firstValue);
    });
  });

  describe('Cierre del Ciclo PDCA', () => {
    it('debe verificar cierre completo de hallazgo', async () => {
      mockPrismaService.finding.findFirst.mockResolvedValue({
        id: 'finding-001',
        correctiveActions: [
          { status: 'COMPLETED', verification: { effective: true } },
        ],
      });

      const canClose = await service.canCloseFinding('finding-001');

      expect(canClose).toBe(true);
    });

    it('debe rechazar cierre si CAPA no verificada', async () => {
      mockPrismaService.finding.findFirst.mockResolvedValue({
        id: 'finding-001',
        correctiveActions: [
          { status: 'COMPLETED', verification: null }, // Sin verificar
        ],
      });

      const canClose = await service.canCloseFinding('finding-001');

      expect(canClose).toBe(false);
    });
  });
});
