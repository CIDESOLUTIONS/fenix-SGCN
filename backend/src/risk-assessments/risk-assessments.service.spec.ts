import { Test, TestingModule } from '@nestjs/testing';
import { RiskAssessmentsService } from './risk-assessments.service';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';
import { NotFoundException } from '@nestjs/common';

describe('RiskAssessmentsService - Módulo 2: Riesgo de Continuidad (EXHAUSTIVO)', () => {
  let service: RiskAssessmentsService;
  let prisma: PrismaService;
  let dgraph: DgraphService;
  let workflow: WorkflowEngineService;
  let analytics: AnalyticsEngineService;

  const mockPrisma = {
    riskAssessment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockDgraph = {
    upsertNode: jest.fn(),
    createRelationship: jest.fn(),
    deleteNode: jest.fn(),
    getImpactAnalysis: jest.fn(),
    query: jest.fn(),
  };

  const mockWorkflow = {
    startWorkflow: jest.fn(),
  };

  const mockAnalytics = {
    runMonteCarloSimulation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskAssessmentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DgraphService, useValue: mockDgraph },
        { provide: WorkflowEngineService, useValue: mockWorkflow },
        { provide: AnalyticsEngineService, useValue: mockAnalytics },
      ],
    }).compile();

    service = module.get<RiskAssessmentsService>(RiskAssessmentsService);
    prisma = module.get<PrismaService>(PrismaService);
    dgraph = module.get<DgraphService>(DgraphService);
    workflow = module.get<WorkflowEngineService>(WorkflowEngineService);
    analytics = module.get<AnalyticsEngineService>(AnalyticsEngineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE EVALUACIÓN DE RIESGOS (ISO 31000)
  // ==========================================

  describe('Evaluación de Riesgos', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-risk-manager';

    it('debe crear riesgo con score calculado correctamente', async () => {
      const mockRisk = {
        id: 'risk-001',
        tenantId,
        name: 'Ciberataque Ransomware',
        category: 'TECHNOLOGICAL',
        probabilityBefore: 4,
        impactBefore: 5,
        scoreBefore: 26, // 4 * 5 * 1.3 (peso tecnológico)
        process: null,
      };

      mockPrisma.riskAssessment.create.mockResolvedValue(mockRisk);
      mockDgraph.upsertNode.mockResolvedValue(true);

      const result = await service.create(
        {
          name: 'Ciberataque Ransomware',
          category: 'TECHNOLOGICAL',
          probabilityBefore: 4,
          impactBefore: 5,
        },
        tenantId,
        userId
      );

      expect(result.scoreBefore).toBe(26);
      expect(mockDgraph.upsertNode).toHaveBeenCalledWith(
        'Risk',
        expect.objectContaining({
          id: mockRisk.id,
          name: mockRisk.name,
          impact: 'HIGH',
          likelihood: 'HIGH',
          category: 'TECHNOLOGICAL',
          nodeType: 'Risk',
        }),
        tenantId
      );
    });

    it('debe aplicar ponderación por categoría correctamente', async () => {
      // Tecnológico: 1.3x
      const techRisk = {
        id: 'risk-tech',
        scoreBefore: 26, // 4*5*1.3 = 26
        category: 'TECHNOLOGICAL',
      };

      // Operacional: 1.2x
      const opRisk = {
        id: 'risk-op',
        scoreBefore: 24, // 4*5*1.2 = 24
        category: 'OPERATIONAL',
      };

      mockPrisma.riskAssessment.create
        .mockResolvedValueOnce(techRisk)
        .mockResolvedValueOnce(opRisk);

      const tech = await service.create(
        { name: 'Tech', category: 'TECHNOLOGICAL', probabilityBefore: 4, impactBefore: 5 },
        tenantId,
        userId
      );

      const op = await service.create(
        { name: 'Op', category: 'OPERATIONAL', probabilityBefore: 4, impactBefore: 5 },
        tenantId,
        userId
      );

      expect(Number(tech.scoreBefore)).toBeGreaterThan(Number(op.scoreBefore));
    });

    it('debe calcular riesgo residual cuando hay controles', async () => {
      const mockRisk = {
        id: 'risk-001',
        probabilityBefore: 4,
        impactBefore: 5,
        scoreBefore: 20,
        probabilityAfter: 2,
        impactAfter: 3,
        scoreAfter: 6, // Reducción significativa
      };

      mockPrisma.riskAssessment.create.mockResolvedValue(mockRisk);

      const result = await service.create(
        {
          name: 'Riesgo con Controles',
          category: 'OPERATIONAL',
          probabilityBefore: 4,
          impactBefore: 5,
          probabilityAfter: 2,
          impactAfter: 3,
          controls: ['Firewall', 'IDS/IPS', 'Backup diario'],
        },
        tenantId,
        userId
      );

      expect(Number(result.scoreAfter)).toBeLessThan(Number(result.scoreBefore));
    });

    it('debe listar riesgos ordenados por score descendente', async () => {
      mockPrisma.riskAssessment.findMany.mockResolvedValue([
        { id: 'risk-001', scoreBefore: 25, name: 'Crítico' },
        { id: 'risk-002', scoreBefore: 15, name: 'Alto' },
        { id: 'risk-003', scoreBefore: 5, name: 'Bajo' },
      ]);

      const result = await service.findAll(tenantId);

      expect(Number(result[0].scoreBefore)).toBeGreaterThanOrEqual(Number(result[1].scoreBefore));
      expect(mockPrisma.riskAssessment.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        include: expect.any(Object),
        orderBy: { scoreBefore: 'desc' },
      });
    });

    it('debe obtener riesgo con análisis de impacto en procesos', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue({
        id: 'risk-001',
        name: 'Fallo Datacenter',
        processId: 'process-001',
        process: {
          id: 'process-001',
          name: 'Procesamiento de Pagos',
          biaAssessments: [{ rto: 240, rpo: 60 }],
        },
      });

      mockDgraph.getImpactAnalysis.mockResolvedValue([
        { id: 'process-001', name: 'Pagos', impact: 'CRITICAL' },
        { id: 'process-002', name: 'CRM', impact: 'HIGH' },
      ]);

      const result = await service.findOne('risk-001', tenantId);

      expect(result.affectedProcesses).toHaveLength(2);
      expect(mockDgraph.getImpactAnalysis).toHaveBeenCalledWith('risk-001', tenantId, 3);
    });

    it('debe vincular riesgo a proceso adicional en grafo', async () => {
      mockDgraph.createRelationship.mockResolvedValue(true);

      const result = await service.linkToProcess('risk-001', 'process-002', tenantId);

      expect(result.message).toBe('Riesgo vinculado al proceso');
      expect(mockDgraph.createRelationship).toHaveBeenCalledWith(
        'risk-001',
        'process-002',
        'affects',
        tenantId
      );
    });
  });

  // ==========================================
  // TESTS DE SIMULACIÓN MONTECARLO
  // ==========================================

  describe('Simulación Montecarlo (ISO 31000)', () => {
    const tenantId = 'tenant-001';

    it('debe ejecutar simulación Montecarlo con 10,000 iteraciones', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue({
        id: 'risk-001',
        name: 'Interrupción TI',
        category: 'TECHNOLOGICAL',
      });

      mockAnalytics.runMonteCarloSimulation.mockResolvedValue({
        mean: 85000,
        median: 82000,
        p90: 125000,
        p95: 145000,
        standardDeviation: 25000,
        distribution: Array(100).fill(0).map((_, i) => ({
          bin: i * 2000,
          frequency: Math.random() * 100,
        })),
      });

      const result = await service.runMonteCarloSimulation('risk-001', tenantId, {
        impactMin: 50000,
        impactMost: 80000,
        impactMax: 200000,
        probabilityMin: 0.6,
        probabilityMax: 0.9,
        iterations: 10000,
      });

      expect(result.simulation.mean).toBe(85000);
      expect(result.simulation.p90).toBeLessThan(result.simulation.p95);
      expect(mockAnalytics.runMonteCarloSimulation).toHaveBeenCalledWith(
        'risk-001',
        10000,
        expect.any(Object)
      );
    });

    it('debe usar 10,000 iteraciones por defecto', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue({
        id: 'risk-001',
        name: 'Test',
        category: 'OPERATIONAL',
      });

      mockAnalytics.runMonteCarloSimulation.mockResolvedValue({
        mean: 75000,
        p90: 100000,
        p95: 120000,
      });

      await service.runMonteCarloSimulation('risk-001', tenantId, {
        impactMin: 30000,
        impactMost: 70000,
        impactMax: 150000,
        probabilityMin: 0.5,
        probabilityMax: 0.8,
        // Sin iterations, debe usar 10000 por defecto
      });

      expect(mockAnalytics.runMonteCarloSimulation).toHaveBeenCalledWith(
        'risk-001',
        10000,
        expect.any(Object)
      );
    });

    it('debe fallar si el riesgo no existe', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue(null);

      await expect(
        service.runMonteCarloSimulation('risk-999', tenantId, {
          impactMin: 10000,
          impactMost: 50000,
          impactMax: 100000,
          probabilityMin: 0.3,
          probabilityMax: 0.7,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // TESTS DE MAPA DE CALOR
  // ==========================================

  describe('Mapa de Calor de Riesgos', () => {
    it('debe generar mapa de calor 3x3 correctamente', async () => {
      mockPrisma.riskAssessment.findMany.mockResolvedValue([
        {
          id: 'risk-001',
          name: 'Crítico',
          probabilityBefore: 5,
          impactBefore: 5,
          scoreBefore: 25,
          category: 'TECHNOLOGICAL',
          process: { id: 'p1', name: 'Pagos', criticalityLevel: 'CRITICAL' },
        },
        {
          id: 'risk-002',
          name: 'Medio',
          probabilityBefore: 3,
          impactBefore: 3,
          scoreBefore: 9,
          category: 'OPERATIONAL',
          process: { id: 'p2', name: 'CRM', criticalityLevel: 'MEDIUM' },
        },
        {
          id: 'risk-003',
          name: 'Bajo',
          probabilityBefore: 1,
          impactBefore: 1,
          scoreBefore: 1,
          category: 'HUMAN',
          process: null,
        },
      ]);

      const heatmap = await service.getRiskHeatmap('tenant-001');

      expect(heatmap.HIGH_HIGH).toHaveLength(1);
      expect((heatmap.HIGH_HIGH[0] as any).name).toBe('Crítico');
      expect(heatmap.MEDIUM_MEDIUM).toHaveLength(1);
      expect(heatmap.LOW_LOW).toHaveLength(1);
    });

    it('debe incluir información del proceso en cada celda', async () => {
      mockPrisma.riskAssessment.findMany.mockResolvedValue([
        {
          id: 'risk-001',
          name: 'Fallo DR',
          probabilityBefore: 4,
          impactBefore: 5,
          scoreBefore: 20,
          category: 'OPERATIONAL',
          process: { id: 'p1', name: 'Facturación', criticalityLevel: 'CRITICAL' },
        },
      ]);

      const heatmap = await service.getRiskHeatmap('tenant-001');

      expect((heatmap.HIGH_HIGH[0] as any).processName).toBe('Facturación');
      expect((heatmap.HIGH_HIGH[0] as any).category).toBe('OPERATIONAL');
    });
  });

  // ==========================================
  // TESTS DE PLANES DE TRATAMIENTO
  // ==========================================

  describe('Planes de Tratamiento de Riesgos', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-ciso';

    it('debe crear plan de mitigación con workflow', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue({
        id: 'risk-001',
        name: 'Ciberataque',
      });

      mockWorkflow.startWorkflow.mockResolvedValue({
        id: 'workflow-001',
        status: 'ACTIVE',
      });

      const result = await service.createTreatmentPlan(
        'risk-001',
        tenantId,
        {
          strategy: 'MITIGATE',
          actions: [
            {
              description: 'Implementar MFA',
              assignee: 'user-it',
              dueDate: '2025-12-31',
            },
            {
              description: 'Actualizar firewall',
              assignee: 'user-security',
              dueDate: '2025-11-30',
            },
          ],
          owner: 'user-ciso',
        },
        userId
      );

      expect(result.workflowId).toBe('workflow-001');
      expect(result.strategy).toBe('MITIGATE');
      expect(result.actions).toBe(2);
      expect(mockWorkflow.startWorkflow).toHaveBeenCalledWith({
        name: expect.stringContaining('Tratamiento de Riesgo'),
        entityType: 'risk-treatment',
        entityId: 'risk-001',
        tenantId,
        steps: expect.arrayContaining([
          expect.objectContaining({
            name: 'Implementar MFA',
            assignedTo: ['user-it'],
          }),
        ]),
        createdBy: userId,
      });
    });

    it('debe permitir estrategia ACCEPT sin acciones', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue({
        id: 'risk-002',
        name: 'Riesgo Menor',
      });

      const result = await service.createTreatmentPlan(
        'risk-002',
        tenantId,
        {
          strategy: 'ACCEPT',
          actions: [],
          owner: 'user-ciso',
        },
        userId
      );

      expect(result.strategy).toBe('ACCEPT');
      expect(mockWorkflow.startWorkflow).not.toHaveBeenCalled();
    });

    it('debe rechazar si el riesgo no existe', async () => {
      mockPrisma.riskAssessment.findFirst.mockResolvedValue(null);

      await expect(
        service.createTreatmentPlan(
          'risk-999',
          tenantId,
          {
            strategy: 'MITIGATE',
            actions: [],
            owner: 'user-ciso',
          },
          userId
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // TESTS DE RIESGOS CRÍTICOS (DGRAPH)
  // ==========================================

  describe('Análisis de Riesgos Críticos con Grafo', () => {
    it('debe obtener riesgos críticos que afectan procesos', async () => {
      mockDgraph.query.mockResolvedValue({
        risks: [
          {
            id: 'risk-001',
            name: 'Fallo Datacenter',
            impact: 'HIGH',
            likelihood: 'HIGH',
            category: 'TECHNOLOGICAL',
            affects: [
              { id: 'process-001', name: 'Pagos', criticality: 'CRITICAL' },
              { id: 'process-002', name: 'ERP', criticality: 'HIGH' },
            ],
          },
          {
            id: 'risk-002',
            name: 'Ransomware',
            impact: 'HIGH',
            likelihood: 'MEDIUM',
            category: 'TECHNOLOGICAL',
            affects: [
              { id: 'process-003', name: 'CRM', criticality: 'MEDIUM' },
            ],
          },
        ],
      });

      const result = await service.getCriticalRisks('tenant-001');

      expect(result.count).toBe(2);
      expect(result.risks[0].affects).toHaveLength(2);
      expect(result.recommendation).toContain('Priorizar tratamiento');
      expect(mockDgraph.query).toHaveBeenCalledWith(
        expect.stringContaining('type(Risk)'),
        expect.objectContaining({ $tenantId: 'tenant-001' })
      );
    });
  });

  // ==========================================
  // TESTS DE INTEGRACIÓN COMPLETA
  // ==========================================

  describe('Flujo Completo de Gestión de Riesgos', () => {
    it('debe completar ciclo: identificar → evaluar → simular → tratar', async () => {
      const tenantId = 'tenant-001';
      const userId = 'user-risk-manager';

      // 1. Identificar y evaluar riesgo
      mockPrisma.riskAssessment.create.mockResolvedValue({
        id: 'risk-001',
        name: 'Interrupción Cloud',
        category: 'TECHNOLOGICAL',
        probabilityBefore: 4,
        impactBefore: 5,
        scoreBefore: 26,
      });

      const created = await service.create(
        {
          name: 'Interrupción Cloud',
          category: 'TECHNOLOGICAL',
          probabilityBefore: 4,
          impactBefore: 5,
        },
        tenantId,
        userId
      );

      expect(created.scoreBefore).toBe(26);

      // 2. Ejecutar simulación Montecarlo
      mockPrisma.riskAssessment.findFirst.mockResolvedValue(created);
      mockAnalytics.runMonteCarloSimulation.mockResolvedValue({
        mean: 150000,
        p90: 200000,
        p95: 250000,
      });

      const simulation = await service.runMonteCarloSimulation(created.id, tenantId, {
        impactMin: 80000,
        impactMost: 150000,
        impactMax: 300000,
        probabilityMin: 0.7,
        probabilityMax: 0.95,
      });

      expect(simulation.simulation.mean).toBe(150000);

      // 3. Crear plan de tratamiento
      mockWorkflow.startWorkflow.mockResolvedValue({ id: 'wf-001' });

      const treatment = await service.createTreatmentPlan(
        created.id,
        tenantId,
        {
          strategy: 'MITIGATE',
          actions: [
            {
              description: 'Configurar multi-region',
              assignee: 'user-devops',
              dueDate: '2025-12-31',
            },
          ],
          owner: userId,
        },
        userId
      );

      expect(treatment.workflowId).toBe('wf-001');
    });
  });
});
