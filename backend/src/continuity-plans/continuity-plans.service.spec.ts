import { Test, TestingModule } from '@nestjs/testing';
import { ContinuityPlansService } from './continuity-plans.service';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { NotFoundException } from '@nestjs/common';
import { PlanStatus } from '@prisma/client';

describe('ContinuityPlansService - Módulo 5: Planes de Continuidad (EXHAUSTIVO)', () => {
  let service: ContinuityPlansService;
  let prisma: PrismaService;
  let dgraph: DgraphService;
  let workflow: WorkflowEngineService;

  const mockPrisma = {
    continuityPlan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    businessProcess: {
      findMany: jest.fn(),
    },
  };

  const mockDgraph = {
    upsertNode: jest.fn(),
    createRelationship: jest.fn(),
    getDependencies: jest.fn(),
    getImpactAnalysis: jest.fn(),
    deleteNode: jest.fn(),
  };

  const mockWorkflow = {
    startWorkflow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContinuityPlansService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DgraphService, useValue: mockDgraph },
        { provide: WorkflowEngineService, useValue: mockWorkflow },
      ],
    }).compile();

    service = module.get<ContinuityPlansService>(ContinuityPlansService);
    prisma = module.get<PrismaService>(PrismaService);
    dgraph = module.get<DgraphService>(DgraphService);
    workflow = module.get<WorkflowEngineService>(WorkflowEngineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE CREACIÓN DE PLANES
  // ==========================================

  describe('Creación de Planes (ISO 22301 Cl. 8.4)', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-planner';

    it('debe crear plan BCP con sincronización a grafo', async () => {
      const mockPlan = {
        id: 'plan-001',
        tenantId,
        processId: 'process-001',
        name: 'Plan de Recuperación de Pagos',
        type: 'BCP',
        content: {
          steps: [
            { id: '1', name: 'Notificar equipo', order: 1 },
            { id: '2', name: 'Activar respaldo', order: 2 },
          ],
        },
        version: '1.0',
        status: PlanStatus.DRAFT,
        process: { id: 'process-001', name: 'Pagos Online' },
      };

      mockPrisma.continuityPlan.create.mockResolvedValue(mockPlan);
      mockDgraph.upsertNode.mockResolvedValue(true);
      mockDgraph.createRelationship.mockResolvedValue(true);

      const result = await service.create(
        {
          processId: 'process-001',
          name: 'Plan de Recuperación de Pagos',
          type: 'BCP',
          content: {
            steps: [
              { id: '1', name: 'Notificar equipo', order: 1 },
              { id: '2', name: 'Activar respaldo', order: 2 },
            ],
          },
          version: '1.0',
        },
        tenantId,
        userId
      );

      expect(result.id).toBe('plan-001');
      expect(mockDgraph.upsertNode).toHaveBeenCalledWith(
        'ContinuityPlan',
        expect.objectContaining({
          id: 'plan-001',
          name: 'Plan de Recuperación de Pagos',
          status: PlanStatus.DRAFT,
          nodeType: 'ContinuityPlan',
        }),
        tenantId
      );
      expect(mockDgraph.createRelationship).toHaveBeenCalledWith(
        'plan-001',
        'process-001',
        'protects',
        tenantId
      );
    });

    it('debe crear plan IT DR con contenido estructurado', async () => {
      mockPrisma.continuityPlan.create.mockResolvedValue({
        id: 'plan-002',
        tenantId,
        processId: 'process-002',
        name: 'Plan DR Datacenter',
        type: 'IT_DR',
        content: {
          rto: 4,
          rpo: 2,
          steps: [
            { id: '1', name: 'Failover a sitio secundario', duration: 30 },
            { id: '2', name: 'Verificar integridad de datos', duration: 60 },
          ],
        },
        status: PlanStatus.DRAFT,
      });

      const result = await service.create(
        {
          processId: 'process-002',
          name: 'Plan DR Datacenter',
          type: 'IT_DR',
          content: {
            rto: 4,
            rpo: 2,
            steps: [
              { id: '1', name: 'Failover a sitio secundario', duration: 30 },
              { id: '2', name: 'Verificar integridad de datos', duration: 60 },
            ],
          },
        },
        tenantId,
        userId
      );

      expect(result.type).toBe('IT_DR');
      expect(result.content).toHaveProperty('rto');
      expect(result.content).toHaveProperty('steps');
    });

    it('debe asignar versión 1.0 por defecto si no se especifica', async () => {
      mockPrisma.continuityPlan.create.mockResolvedValue({
        id: 'plan-003',
        version: '1.0',
        status: PlanStatus.DRAFT,
      });

      const result = await service.create(
        {
          processId: 'process-001',
          name: 'Plan Test',
          type: 'BCP',
        },
        tenantId,
        userId
      );

      expect(result.version).toBe('1.0');
    });
  });

  // ==========================================
  // TESTS DE FLUJO DE APROBACIÓN
  // ==========================================

  describe('Flujo de Aprobación de Planes', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-manager';

    it('debe enviar plan a revisión con workflow de aprobación', async () => {
      mockPrisma.continuityPlan.update.mockResolvedValue({
        id: 'plan-001',
        status: PlanStatus.REVIEW,
      });

      mockWorkflow.startWorkflow.mockResolvedValue({
        id: 'workflow-001',
      });

      const result = await service.submitForReview(
        'plan-001',
        tenantId,
        ['user-reviewer-1', 'user-reviewer-2'],
        userId
      );

      expect(result.message).toBe('Plan submitted for review');
      expect(mockPrisma.continuityPlan.update).toHaveBeenCalledWith({
        where: { id: 'plan-001' },
        data: { status: PlanStatus.REVIEW },
      });
      expect(mockWorkflow.startWorkflow).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Plan Review Workflow',
          entityType: 'continuity_plan',
          entityId: 'plan-001',
          steps: expect.arrayContaining([
            expect.objectContaining({
              name: 'Approve Plan',
              assignedTo: ['user-reviewer-1'],
            }),
          ]),
        })
      );
    });

    it('debe aprobar plan y registrar aprobador', async () => {
      const approvedDate = new Date();
      mockPrisma.continuityPlan.update.mockResolvedValue({
        id: 'plan-001',
        status: PlanStatus.APPROVED,
        approvedBy: 'user-ciso',
        approvedAt: approvedDate,
      });

      const result = await service.approvePlan(
        'plan-001',
        tenantId,
        'user-ciso',
        'Plan cumple con todos los requisitos'
      );

      expect(result.status).toBe(PlanStatus.APPROVED);
      expect(result.approvedBy).toBe('user-ciso');
      expect(result.approvedAt).toEqual(approvedDate);
    });
  });

  // ==========================================
  // TESTS DE ACTIVACIÓN DE PLANES
  // ==========================================

  describe('Activación de Planes', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-incident-manager';

    it('debe activar plan durante incidente real', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue({
        id: 'plan-001',
        name: 'Plan BCP Pagos',
        status: PlanStatus.APPROVED,
      });

      const activationDate = new Date();
      mockPrisma.continuityPlan.update.mockResolvedValue({
        id: 'plan-001',
        status: PlanStatus.ACTIVE,
        lastActivated: activationDate,
        executionLog: {
          activatedBy: userId,
          activatedAt: activationDate,
          reason: 'Caída del datacenter principal',
          steps: [],
        },
      });

      mockWorkflow.startWorkflow.mockResolvedValue({ id: 'wf-notify-001' });

      const result = await service.activatePlan(
        'plan-001',
        tenantId,
        userId,
        'Caída del datacenter principal'
      );

      expect(result.status).toBe(PlanStatus.ACTIVE);
      expect(result.lastActivated).toEqual(activationDate);
      expect(result.executionLog).toHaveProperty('activatedBy', userId);
      expect(result.executionLog).toHaveProperty('reason');
      expect(mockWorkflow.startWorkflow).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Plan Activation Notification',
          steps: expect.arrayContaining([
            expect.objectContaining({
              name: 'Notify Response Team',
              metadata: expect.objectContaining({
                planId: 'plan-001',
                reason: 'Caída del datacenter principal',
              }),
            }),
          ]),
        })
      );
    });

    it('debe fallar si plan no existe', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.activatePlan('plan-999', tenantId, userId, 'Test')
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // TESTS DE ANÁLISIS DE DEPENDENCIAS
  // ==========================================

  describe('Análisis de Dependencias en Planes', () => {
    const tenantId = 'tenant-001';

    it('debe obtener mapa de dependencias del proceso protegido', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue({
        id: 'plan-001',
        processId: 'process-001',
        name: 'Plan BCP',
        process: {
          id: 'process-001',
          name: 'Pagos',
          biaAssessments: [],
          riskAssessments: [],
        },
      });

      mockDgraph.getDependencies.mockResolvedValue({
        node: [
          {
            id: 'process-001',
            name: 'Pagos',
            dependsOn: [
              { id: 'app-001', name: 'Payment Gateway', type: 'APPLICATION' },
              { id: 'vendor-001', name: 'Stripe', type: 'SUPPLIER' },
            ],
          },
        ],
      });

      const result = await service.findOne('plan-001', tenantId);

      expect(result.dependencyMap).toBeDefined();
      expect((result.dependencyMap as any)?.node[0].dependsOn).toHaveLength(2);
    });

    it('debe obtener análisis de impacto del plan', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue({
        id: 'plan-001',
        processId: 'process-001',
        process: { id: 'process-001', name: 'Pagos' },
      });

      mockDgraph.getImpactAnalysis.mockResolvedValue({
        directImpact: [
          { id: 'process-002', name: 'Facturación', level: 'HIGH' },
        ],
        cascadingImpact: [
          { id: 'process-003', name: 'Reportes', level: 'MEDIUM' },
        ],
      });

      const result = await service.getImpactAnalysis('plan-001', tenantId);

      expect(result.directImpact).toBeDefined();
      expect(result.cascadingImpact).toBeDefined();
      expect(mockDgraph.getImpactAnalysis).toHaveBeenCalledWith(
        'process-001',
        tenantId,
        3
      );
    });
  });

  // ==========================================
  // TESTS DE CLONACIÓN DE PLANES
  // ==========================================

  describe('Clonación de Planes', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-planner';

    it('debe clonar plan existente con nuevo nombre', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue({
        id: 'plan-001',
        tenantId,
        processId: 'process-001',
        name: 'Plan Original',
        type: 'BCP',
        content: {
          steps: [
            { id: '1', name: 'Paso 1' },
            { id: '2', name: 'Paso 2' },
          ],
        },
        status: PlanStatus.APPROVED,
      });

      mockPrisma.continuityPlan.create.mockResolvedValue({
        id: 'plan-002',
        tenantId,
        processId: 'process-001',
        name: 'Plan Clonado',
        type: 'BCP',
        content: {
          steps: [
            { id: '1', name: 'Paso 1' },
            { id: '2', name: 'Paso 2' },
          ],
        },
        version: '1.0',
        status: PlanStatus.DRAFT,
      });

      const result = await service.clonePlan(
        'plan-001',
        tenantId,
        'Plan Clonado',
        userId
      );

      expect(result.id).toBe('plan-002');
      expect(result.name).toBe('Plan Clonado');
      expect(result.status).toBe(PlanStatus.DRAFT);
      expect(result.version).toBe('1.0');
      expect(result.content).toEqual({
        steps: [
          { id: '1', name: 'Paso 1' },
          { id: '2', name: 'Paso 2' },
        ],
      });
    });

    it('debe resetear estado a DRAFT al clonar plan APROBADO', async () => {
      mockPrisma.continuityPlan.findFirst.mockResolvedValue({
        id: 'plan-approved',
        status: PlanStatus.APPROVED,
        processId: 'process-001',
        type: 'BCP',
        content: {},
      });

      mockPrisma.continuityPlan.create.mockResolvedValue({
        id: 'plan-cloned',
        status: PlanStatus.DRAFT,
      });

      const result = await service.clonePlan(
        'plan-approved',
        'tenant-001',
        'Clonado',
        'user-001'
      );

      expect(result.status).toBe(PlanStatus.DRAFT);
    });
  });

  // ==========================================
  // TESTS DE ANÁLISIS DE COBERTURA
  // ==========================================

  describe('Análisis de Cobertura de Planes', () => {
    const tenantId = 'tenant-001';

    it('debe calcular cobertura de planes correctamente', async () => {
      mockPrisma.businessProcess.findMany.mockResolvedValue([
        {
          id: 'process-001',
          name: 'Pagos',
          criticalityLevel: 'CRITICAL',
          plans: [
            { id: 'plan-001', status: PlanStatus.APPROVED },
          ],
          biaAssessments: [{ rto: 4, rpo: 2 }],
        },
        {
          id: 'process-002',
          name: 'CRM',
          criticalityLevel: 'HIGH',
          plans: [],
          biaAssessments: [{ rto: 8, rpo: 4 }],
        },
        {
          id: 'process-003',
          name: 'Reportes',
          criticalityLevel: 'MEDIUM',
          plans: [
            { id: 'plan-002', status: PlanStatus.ACTIVE },
          ],
          biaAssessments: [],
        },
      ]);

      const result = await service.getCoverageAnalysis(tenantId);

      expect(result.totalProcesses).toBe(3);
      expect(result.coveredProcesses).toBe(2);
      expect(result.uncoveredProcesses).toBe(1);
      expect(result.coverageRate).toBeCloseTo(66.67, 2);
      expect(result.details).toHaveLength(3);
      expect(result.details[0]).toMatchObject({
        processId: 'process-001',
        covered: true,
        hasPlan: true,
        hasActivePlan: false,
      });
    });

    it('debe identificar procesos sin planes', async () => {
      mockPrisma.businessProcess.findMany.mockResolvedValue([
        {
          id: 'process-001',
          name: 'Proceso Sin Plan',
          criticalityLevel: 'CRITICAL',
          plans: [],
          biaAssessments: [{ rto: 2, rpo: 1 }],
        },
      ]);

      const result = await service.getCoverageAnalysis(tenantId);

      expect(result.coverageRate).toBe(0);
      expect(result.uncoveredProcesses).toBe(1);
      expect(result.details[0].covered).toBe(false);
    });

    it('debe manejar caso sin procesos', async () => {
      mockPrisma.businessProcess.findMany.mockResolvedValue([]);

      const result = await service.getCoverageAnalysis(tenantId);

      expect(result.totalProcesses).toBe(0);
      expect(result.coverageRate).toBe(0);
    });
  });

  // ==========================================
  // TESTS DE INTEGRACIÓN COMPLETA
  // ==========================================

  describe('Flujo Completo de Gestión de Planes', () => {
    it('debe completar ciclo: crear → revisar → aprobar → activar', async () => {
      const tenantId = 'tenant-001';
      const userId = 'user-planner';

      // 1. Crear plan
      mockPrisma.continuityPlan.create.mockResolvedValue({
        id: 'plan-001',
        name: 'Plan BCP Pagos',
        type: 'BCP',
        status: PlanStatus.DRAFT,
        processId: 'process-001',
      });

      const created = await service.create(
        {
          processId: 'process-001',
          name: 'Plan BCP Pagos',
          type: 'BCP',
          content: {
            steps: [
              { id: '1', name: 'Notificar', order: 1 },
              { id: '2', name: 'Activar DR', order: 2 },
            ],
          },
        },
        tenantId,
        userId
      );

      expect(created.status).toBe(PlanStatus.DRAFT);

      // 2. Enviar a revisión
      mockPrisma.continuityPlan.update.mockResolvedValue({
        ...created,
        status: PlanStatus.REVIEW,
      });
      mockWorkflow.startWorkflow.mockResolvedValue({ id: 'wf-001' });

      await service.submitForReview(
        created.id,
        tenantId,
        ['user-reviewer'],
        userId
      );

      // 3. Aprobar
      mockPrisma.continuityPlan.update.mockResolvedValue({
        ...created,
        status: PlanStatus.APPROVED,
        approvedBy: 'user-ciso',
        approvedAt: new Date(),
      });

      const approved = await service.approvePlan(
        created.id,
        tenantId,
        'user-ciso'
      );

      expect(approved.status).toBe(PlanStatus.APPROVED);

      // 4. Activar durante incidente
      mockPrisma.continuityPlan.findFirst.mockResolvedValue(approved);
      mockPrisma.continuityPlan.update.mockResolvedValue({
        ...approved,
        status: PlanStatus.ACTIVE,
        lastActivated: new Date(),
      });

      const activated = await service.activatePlan(
        created.id,
        tenantId,
        'user-incident-manager',
        'Incidente crítico'
      );

      expect(activated.status).toBe(PlanStatus.ACTIVE);
    });
  });
});
