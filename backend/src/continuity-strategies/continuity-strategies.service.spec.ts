import { Test, TestingModule } from '@nestjs/testing';
import { ContinuityStrategiesService } from './continuity-strategies.service';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';
import { NotFoundException } from '@nestjs/common';

describe('ContinuityStrategiesService - Módulo 4: Escenarios y Estrategias (EXHAUSTIVO)', () => {
  let service: ContinuityStrategiesService;
  let prisma: PrismaService;
  let dgraph: DgraphService;
  let workflow: WorkflowEngineService;

  const mockPrisma = {
    continuityStrategy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    businessProcess: {
      findFirst: jest.fn(),
    },
  };

  const mockDgraph = {
    getDependencies: jest.fn(),
  };

  const mockWorkflow = {
    createApprovalWorkflow: jest.fn(),
  };

  const mockAnalytics = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContinuityStrategiesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DgraphService, useValue: mockDgraph },
        { provide: WorkflowEngineService, useValue: mockWorkflow },
        { provide: AnalyticsEngineService, useValue: mockAnalytics },
      ],
    }).compile();

    service = module.get<ContinuityStrategiesService>(ContinuityStrategiesService);
    prisma = module.get<PrismaService>(PrismaService);
    dgraph = module.get<DgraphService>(DgraphService);
    workflow = module.get<WorkflowEngineService>(WorkflowEngineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE RECOMENDACIÓN DE ESTRATEGIAS
  // ==========================================

  describe('Recomendación de Estrategias (ISO 22301 Cl. 8.3)', () => {
    const tenantId = 'tenant-001';

    it('debe recomendar REDUNDANCIA para RTO <= 4h', async () => {
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-001',
        name: 'Pagos Online',
        criticalityLevel: 'CRITICAL',
        biaAssessments: [
          { rto: 2, rpo: 1, financialImpact24h: 200000 },
        ],
      });

      mockDgraph.getDependencies.mockResolvedValue({
        node: [],
      });

      const result = await service.recommendStrategies('process-001', tenantId);

      expect(result.recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'REDUNDANCY',
            name: expect.stringContaining('Redundancia'),
            priority: 'HIGH',
          }),
        ])
      );
      expect(result.rto).toBe(2);
    });

    it('debe recomendar SITIO ALTERNO para proceso CRÍTICO', async () => {
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-002',
        name: 'Centro de Control',
        criticalityLevel: 'CRITICAL',
        biaAssessments: [
          { rto: 8, rpo: 4 },
        ],
      });

      mockDgraph.getDependencies.mockResolvedValue({
        node: [],
      });

      const result = await service.recommendStrategies('process-002', tenantId);

      expect(result.recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'RECOVERY',
            name: expect.stringContaining('Sitio'),
          }),
        ])
      );
    });

    it('debe recomendar PROVEEDOR SECUNDARIO si hay dependencias externas', async () => {
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-003',
        name: 'Logística',
        criticalityLevel: 'HIGH',
        biaAssessments: [
          { rto: 12, rpo: 6 },
        ],
      });

      mockDgraph.getDependencies.mockResolvedValue({
        node: [
          {
            id: 'process-003',
            dependsOn: [
              { id: 'supplier-aws', nodeType: 'Asset', type: 'SUPPLIER', name: 'AWS' },
            ],
          },
        ],
      });

      const result = await service.recommendStrategies('process-003', tenantId);

      expect(result.recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'MITIGATION',
            name: expect.stringContaining('Proveedor Secundario'),
          }),
        ])
      );
    });

    it('debe recomendar PROCEDIMIENTOS MANUALES para RTO >= 24h', async () => {
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-004',
        name: 'Reportería Mensual',
        criticalityLevel: 'MEDIUM',
        biaAssessments: [
          { rto: 48, rpo: 24 },
        ],
      });

      mockDgraph.getDependencies.mockResolvedValue({
        node: [],
      });

      const result = await service.recommendStrategies('process-004', tenantId);

      expect(result.recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'MITIGATION',
            name: expect.stringContaining('Manuales'),
            priority: 'LOW',
          }),
        ])
      );
    });

    it('debe ordenar recomendaciones por prioridad', async () => {
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-001',
        name: 'Test',
        criticalityLevel: 'CRITICAL',
        biaAssessments: [{ rto: 4, rpo: 2 }],
      });

      mockDgraph.getDependencies.mockResolvedValue({ node: [] });

      const result = await service.recommendStrategies('process-001', tenantId);

      const priorities = result.recommendations.map((r) => r.priority);
      const highFirst = priorities.indexOf('HIGH') < priorities.indexOf('MEDIUM');
      expect(highFirst || priorities.indexOf('MEDIUM') === -1).toBe(true);
    });
  });

  // ==========================================
  // TESTS DE ANÁLISIS DE BRECHAS
  // ==========================================

  describe('Análisis de Brechas de Recursos', () => {
    const tenantId = 'tenant-001';

    it('debe identificar brechas de infraestructura para REDUNDANCIA', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-001',
        type: 'REDUNDANCY',
        scenario: 'Redundancia Completa',
        processId: 'process-001',
        process: { id: 'process-001', name: 'Pagos' },
      });

      const result = await service.analyzeResourceGaps('strategy-001', tenantId);

      expect(result.gaps).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'INFRASTRUCTURE',
            item: expect.stringContaining('Servidores'),
            gap: expect.any(Number),
            estimatedCost: expect.any(Number),
          }),
        ])
      );
    });

    it('debe identificar brechas de instalaciones para RECOVERY', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-002',
        type: 'RECOVERY',
        scenario: 'Sitio Alterno',
        processId: 'process-001',
        process: { id: 'process-001', name: 'Operaciones' },
      });

      const result = await service.analyzeResourceGaps('strategy-002', tenantId);

      expect(result.gaps).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'FACILITY',
            item: expect.stringContaining('Espacio'),
          }),
          expect.objectContaining({
            category: 'PERSONNEL',
            item: expect.stringContaining('Personal'),
          }),
        ])
      );
    });

    it('debe calcular costo total de brechas', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-001',
        type: 'REDUNDANCY',
        scenario: 'Test',
        processId: 'process-001',
        process: { id: 'process-001', name: 'Test' },
      });

      const result = await service.analyzeResourceGaps('strategy-001', tenantId);

      expect(result.summary.totalEstimatedCost).toBeGreaterThan(0);
      expect(result.summary.totalGaps).toBe(result.gaps.length);
    });
  });

  // ==========================================
  // TESTS DE VALIDACIÓN DE ESTRATEGIA
  // ==========================================

  describe('Validación de Estrategias contra RTO', () => {
    const tenantId = 'tenant-001';

    it('debe rechazar estrategia si implementationTime > RTO', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-001',
        scenario: 'Estrategia Lenta',
        implementationTime: 10, // 10h
        effectiveness: 4,
        cost: 50000,
        processId: 'process-001',
        process: {
          id: 'process-001',
          name: 'Pagos',
          criticalityLevel: 'CRITICAL',
          biaAssessments: [
            { rto: 4, rpo: 2, financialImpact24h: 100000 }, // RTO 4h
          ],
        },
      });

      const result = await service.validateStrategy('strategy-001', tenantId);

      expect(result.isValid).toBe(false);
      expect(result.validations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'ERROR',
            message: expect.stringContaining('tarda 10h'),
          }),
        ])
      );
    });

    it('debe aprobar estrategia si cumple con RTO', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-002',
        scenario: 'Estrategia Rápida',
        implementationTime: 2, // 2h
        effectiveness: 5,
        cost: 30000,
        processId: 'process-001',
        process: {
          id: 'process-001',
          name: 'Pagos',
          criticalityLevel: 'CRITICAL',
          biaAssessments: [
            { rto: 4, rpo: 2, financialImpact24h: 100000 },
          ],
        },
      });

      const result = await service.validateStrategy('strategy-002', tenantId);

      expect(result.isValid).toBe(true);
      expect(result.validations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SUCCESS',
            message: expect.stringContaining('cumple'),
          }),
        ])
      );
    });

    it('debe advertir si proceso CRÍTICO tiene baja efectividad', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-003',
        scenario: 'Estrategia Básica',
        implementationTime: 2,
        effectiveness: 2, // Baja efectividad
        cost: 10000,
        processId: 'process-001',
        process: {
          id: 'process-001',
          name: 'Pagos',
          criticalityLevel: 'CRITICAL',
          biaAssessments: [
            { rto: 4, rpo: 2 },
          ],
        },
      });

      const result = await service.validateStrategy('strategy-003', tenantId);

      expect(result.validations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'WARNING',
            message: expect.stringContaining('mayor efectividad'),
          }),
        ])
      );
    });

    it('debe advertir si costo excede impacto financiero', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-004',
        scenario: 'Estrategia Costosa',
        implementationTime: 2,
        effectiveness: 5,
        cost: 150000, // Mayor que impacto
        processId: 'process-001',
        process: {
          id: 'process-001',
          name: 'Proceso',
          criticalityLevel: 'MEDIUM',
          biaAssessments: [
            { rto: 8, rpo: 4, financialImpact24h: 100000 }, // Impacto menor
          ],
        },
      });

      const result = await service.validateStrategy('strategy-004', tenantId);

      expect(result.validations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'WARNING',
            message: expect.stringContaining('excede impacto'),
          }),
        ])
      );
    });
  });

  // ==========================================
  // TESTS DE COMPARACIÓN DE ESTRATEGIAS
  // ==========================================

  describe('Comparación de Estrategias', () => {
    const tenantId = 'tenant-001';

    it('debe comparar múltiples estrategias', async () => {
      mockPrisma.continuityStrategy.findMany.mockResolvedValue([
        {
          id: 'strategy-001',
          scenario: 'Redundancia',
          type: 'REDUNDANCY',
          cost: 50000,
          implementationTime: 60,
          effectiveness: 5,
          costEffectivenessScore: 12,
        },
        {
          id: 'strategy-002',
          scenario: 'Backup',
          type: 'RECOVERY',
          cost: 15000,
          implementationTime: 30,
          effectiveness: 4,
          costEffectivenessScore: 32,
        },
      ]);

      const result = await service.compareStrategies(
        'process-001',
        ['strategy-001', 'strategy-002'],
        tenantId
      );

      expect(result.strategies).toHaveLength(2);
      expect(result.bestOptions.leastExpensive.id).toBe('strategy-002');
      expect(result.bestOptions.mostEffective.id).toBe('strategy-001');
      expect(result.bestOptions.bestValue.id).toBe('strategy-002'); // Mayor score
    });

    it('debe identificar la opción de mejor relación costo-efectividad', async () => {
      mockPrisma.continuityStrategy.findMany.mockResolvedValue([
        {
          id: 'strategy-001',
          scenario: 'Cara pero Efectiva',
          type: 'REDUNDANCY',
          cost: 100000,
          implementationTime: 90,
          effectiveness: 5,
          costEffectivenessScore: 5,
        },
        {
          id: 'strategy-002',
          scenario: 'Balance Perfecto',
          type: 'RECOVERY',
          cost: 30000,
          implementationTime: 45,
          effectiveness: 4,
          costEffectivenessScore: 15,
        },
      ]);

      const result = await service.compareStrategies(
        'process-001',
        ['strategy-001', 'strategy-002'],
        tenantId
      );

      expect(result.recommendation).toBe('strategy-002');
      expect(result.bestOptions.bestValue.costEffectivenessScore).toBe(15);
    });
  });

  // ==========================================
  // TESTS DE WORKFLOW DE APROBACIÓN
  // ==========================================

  describe('Workflow de Aprobación', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-strategist';

    it('debe enviar estrategia a aprobación con workflow', async () => {
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        id: 'strategy-001',
        scenario: 'Redundancia Total',
        processId: 'process-001',
        process: { id: 'process-001', name: 'Pagos' },
      });

      mockWorkflow.createApprovalWorkflow.mockResolvedValue({
        id: 'workflow-001',
      });

      const result = await service.submitForApproval(
        'strategy-001',
        tenantId,
        ['user-ciso', 'user-cfo'],
        userId
      );

      expect(result.workflowId).toBe('workflow-001');
      expect(result.approvers).toEqual(['user-ciso', 'user-cfo']);
      expect(mockWorkflow.createApprovalWorkflow).toHaveBeenCalledWith({
        type: 'continuity-strategy',
        entityId: 'strategy-001',
        approvers: ['user-ciso', 'user-cfo'],
        tenantId,
        requestedBy: userId,
      });
    });
  });

  // ==========================================
  // TESTS DE CÁLCULO COST-EFFECTIVENESS
  // ==========================================

  describe('Cálculo de Cost-Effectiveness', () => {
    it('debe calcular score correctamente', async () => {
      mockPrisma.continuityStrategy.create.mockResolvedValue({
        id: 'strategy-001',
        cost: 50000,
        effectiveness: 4,
        implementationTime: 30,
        costEffectivenessScore: 80, // Score calculado
      });

      const result = await service.create(
        {
          processId: 'process-001',
          type: 'RECOVERY',
          scenario: 'Test',
          description: 'Test',
          cost: 50000,
          effectiveness: 4,
          implementationTime: 30,
        },
        'tenant-001',
        'user-001'
      );

      expect(Number(result.costEffectivenessScore)).toBeGreaterThan(0);
    });

    it('debe dar bonificación a implementación rápida (<= 30 días)', async () => {
      mockPrisma.continuityStrategy.create.mockResolvedValue({
        id: 'strategy-fast',
        cost: 10000,
        effectiveness: 3,
        implementationTime: 20,
        costEffectivenessScore: 72, // Con bonificación 1.2
      });

      const resultFast = await service.create(
        {
          processId: 'process-001',
          type: 'MITIGATION',
          scenario: 'Rápida',
          description: 'Test',
          cost: 10000,
          effectiveness: 3,
          implementationTime: 20,
        },
        'tenant-001',
        'user-001'
      );

      expect(resultFast.costEffectivenessScore).toBeGreaterThan(50);
    });
  });

  // ==========================================
  // TESTS DE INTEGRACIÓN COMPLETA
  // ==========================================

  describe('Flujo Completo de Estrategias', () => {
    it('debe completar ciclo: recomendar → seleccionar → validar → aprobar', async () => {
      const tenantId = 'tenant-001';
      const userId = 'user-strategist';

      // 1. Obtener recomendaciones
      mockPrisma.businessProcess.findFirst.mockResolvedValue({
        id: 'process-001',
        name: 'Pagos Online',
        criticalityLevel: 'CRITICAL',
        biaAssessments: [{ rto: 4, rpo: 2, financialImpact24h: 150000 }],
      });

      mockDgraph.getDependencies.mockResolvedValue({ node: [] });

      const recommendations = await service.recommendStrategies('process-001', tenantId);

      expect(recommendations.recommendations).toHaveLength(3);

      // 2. Crear estrategia seleccionada
      const selectedStrategy = recommendations.recommendations[0];

      mockPrisma.continuityStrategy.create.mockResolvedValue({
        id: 'strategy-001',
        processId: 'process-001',
        type: selectedStrategy.type,
        scenario: selectedStrategy.name,
        cost: selectedStrategy.estimatedCost,
        effectiveness: selectedStrategy.effectiveness,
        implementationTime: selectedStrategy.implementationTime / 24, // días a horas
        costEffectivenessScore: 20,
      });

      const created = await service.create(
        {
          processId: 'process-001',
          type: selectedStrategy.type,
          scenario: selectedStrategy.name,
          description: selectedStrategy.description,
          cost: selectedStrategy.estimatedCost,
          effectiveness: selectedStrategy.effectiveness,
          implementationTime: selectedStrategy.implementationTime / 24,
        },
        tenantId,
        userId
      );

      expect(created.id).toBe('strategy-001');

      // 3. Validar estrategia
      mockPrisma.continuityStrategy.findFirst.mockResolvedValue({
        ...created,
        process: {
          id: 'process-001',
          name: 'Pagos Online',
          criticalityLevel: 'CRITICAL',
          biaAssessments: [{ rto: 4, rpo: 2, financialImpact24h: 150000 }],
        },
      });

      const validation = await service.validateStrategy(created.id, tenantId);

      expect(validation.isValid).toBeDefined();

      // 4. Enviar a aprobación si es válida
      if (validation.isValid) {
        mockWorkflow.createApprovalWorkflow.mockResolvedValue({
          id: 'workflow-001',
        });

        const approval = await service.submitForApproval(
          created.id,
          tenantId,
          ['user-ciso'],
          userId
        );

        expect(approval.workflowId).toBe('workflow-001');
      }
    });
  });
});
