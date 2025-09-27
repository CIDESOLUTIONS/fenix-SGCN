import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceService } from './governance.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { NotFoundException } from '@nestjs/common';

describe('GovernanceService - Módulo 1: Planeación y Gobierno (EXHAUSTIVO)', () => {
  let service: GovernanceService;
  let prisma: PrismaService;
  let workflow: WorkflowEngineService;
  let dgraph: DgraphService;

  const mockPrisma = {
    sgcnPolicy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    sgcnObjective: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    raciMatrix: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockWorkflow = {
    createApprovalWorkflow: jest.fn(),
    sendNotification: jest.fn(),
  };

  const mockDgraph = {
    upsertNode: jest.fn(),
    createRelationship: jest.fn(),
    deleteNode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WorkflowEngineService, useValue: mockWorkflow },
        { provide: DgraphService, useValue: mockDgraph },
      ],
    }).compile();

    service = module.get<GovernanceService>(GovernanceService);
    prisma = module.get<PrismaService>(PrismaService);
    workflow = module.get<WorkflowEngineService>(WorkflowEngineService);
    dgraph = module.get<DgraphService>(DgraphService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE POLÍTICAS SGCN (ISO 22301 Cl. 5.2)
  // ==========================================

  describe('Gestión de Políticas', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-ciso';

    it('debe crear política en estado DRAFT', async () => {
      const mockPolicy = {
        id: 'policy-001',
        tenantId,
        title: 'Política BCM 2025',
        content: 'Contenido de la política...',
        version: '1.0',
        status: 'DRAFT',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.sgcnPolicy.create.mockResolvedValue(mockPolicy);

      const result = await service.createPolicy(
        {
          title: 'Política BCM 2025',
          content: 'Contenido de la política...',
          version: '1.0',
        },
        tenantId,
        userId
      );

      expect(result.status).toBe('DRAFT');
      expect(result.createdBy).toBe(userId);
      expect(mockPrisma.sgcnPolicy.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenantId,
          title: 'Política BCM 2025',
          status: 'DRAFT',
        }),
      });
    });

    it('debe enviar política a revisión y crear workflow', async () => {
      const policyId = 'policy-001';
      const approvers = ['user-ceo', 'user-director'];

      mockPrisma.sgcnPolicy.updateMany.mockResolvedValue({ count: 1 });
      mockWorkflow.createApprovalWorkflow.mockResolvedValue({
        id: 'workflow-001',
        approvers,
      });

      const result = await service.submitPolicyForApproval(
        policyId,
        tenantId,
        approvers,
        userId
      );

      expect(result.workflowId).toBe('workflow-001');
      expect(mockPrisma.sgcnPolicy.updateMany).toHaveBeenCalledWith({
        where: { id: policyId, tenantId },
        data: { status: 'REVIEW' },
      });
      expect(mockWorkflow.createApprovalWorkflow).toHaveBeenCalledWith({
        type: 'sgcn-policy',
        entityId: policyId,
        approvers,
        tenantId,
        requestedBy: userId,
      });
    });

    it('debe aprobar política y notificar', async () => {
      const policyId = 'policy-001';
      mockPrisma.sgcnPolicy.updateMany.mockResolvedValue({ count: 1 });
      mockWorkflow.sendNotification.mockResolvedValue(true);

      await service.approvePolicy(policyId, tenantId, 'user-ceo', 'Aprobada sin cambios');

      expect(mockPrisma.sgcnPolicy.updateMany).toHaveBeenCalledWith({
        where: { id: policyId, tenantId },
        data: {
          status: 'APPROVED',
          approvedBy: 'user-ceo',
          approvedAt: expect.any(Date),
        },
      });
      expect(mockWorkflow.sendNotification).toHaveBeenCalled();
    });

    it('debe publicar política solo si está APPROVED', async () => {
      const policyId = 'policy-001';
      
      mockPrisma.sgcnPolicy.findFirst.mockResolvedValue({
        id: policyId,
        status: 'APPROVED',
        title: 'Política BCM',
      });
      mockPrisma.sgcnPolicy.updateMany.mockResolvedValue({ count: 1 });
      mockWorkflow.sendNotification.mockResolvedValue(true);

      const result = await service.publishPolicy(policyId, tenantId, userId);

      expect(result.message).toBe('Política publicada exitosamente');
      expect(mockPrisma.sgcnPolicy.updateMany).toHaveBeenCalledWith({
        where: { id: policyId, tenantId },
        data: {
          status: 'ACTIVE',
          publishedAt: expect.any(Date),
          publishedBy: userId,
        },
      });
    });

    it('debe rechazar publicación si no está APPROVED', async () => {
      mockPrisma.sgcnPolicy.findFirst.mockResolvedValue({
        id: 'policy-001',
        status: 'DRAFT',
      });

      await expect(
        service.publishPolicy('policy-001', tenantId, userId)
      ).rejects.toThrow('Solo se pueden publicar políticas aprobadas');
    });

    it('debe listar todas las políticas del tenant', async () => {
      mockPrisma.sgcnPolicy.findMany.mockResolvedValue([
        { id: 'policy-001', status: 'ACTIVE' },
        { id: 'policy-002', status: 'DRAFT' },
      ]);

      const result = await service.findAllPolicies(tenantId);

      expect(result).toHaveLength(2);
      expect(mockPrisma.sgcnPolicy.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('debe obtener política por ID', async () => {
      mockPrisma.sgcnPolicy.findFirst.mockResolvedValue({
        id: 'policy-001',
        title: 'Política BCM',
      });

      const result = await service.findOnePolicy('policy-001', tenantId);

      expect(result.id).toBe('policy-001');
    });

    it('debe lanzar error si política no existe', async () => {
      mockPrisma.sgcnPolicy.findFirst.mockResolvedValue(null);

      await expect(
        service.findOnePolicy('policy-999', tenantId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // TESTS DE OBJETIVOS (ISO 22301 Cl. 5.1)
  // ==========================================

  describe('Gestión de Objetivos SMART', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-ciso';

    it('debe crear objetivo SMART y sincronizar a Dgraph', async () => {
      const mockObjective = {
        id: 'obj-001',
        tenantId,
        description: '100% cobertura BIA',
        measurementCriteria: 'BIAs completados / Procesos totales',
        targetDate: new Date('2025-12-31'),
        owner: userId,
        status: 'NOT_STARTED',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.sgcnObjective.create.mockResolvedValue(mockObjective);
      mockDgraph.upsertNode.mockResolvedValue(true);

      const result = await service.createObjective(
        {
          description: '100% cobertura BIA',
          measurementCriteria: 'BIAs completados / Procesos totales',
          targetDate: '2025-12-31',
          owner: userId,
        },
        tenantId,
        userId
      );

      expect(result.description).toBe('100% cobertura BIA');
      expect(mockDgraph.upsertNode).toHaveBeenCalledWith(
        'Objective',
        expect.objectContaining({
          id: mockObjective.id,
          description: mockObjective.description,
          nodeType: 'Objective',
        }),
        tenantId
      );
    });

    it('debe actualizar objetivo y reflejar en Dgraph', async () => {
      mockPrisma.sgcnObjective.updateMany.mockResolvedValue({ count: 1 });
      mockDgraph.upsertNode.mockResolvedValue(true);

      await service.updateObjective(
        'obj-001',
        tenantId,
        {
          status: 'IN_PROGRESS',
          progress: 50,
        },
        userId
      );

      expect(mockDgraph.upsertNode).toHaveBeenCalledWith(
        'Objective',
        expect.objectContaining({
          id: 'obj-001',
          status: 'IN_PROGRESS',
        }),
        tenantId
      );
    });

    it('debe vincular objetivo a proceso en grafo', async () => {
      mockDgraph.createRelationship.mockResolvedValue(true);

      const result = await service.linkObjectiveToProcess(
        'obj-001',
        'process-001',
        tenantId
      );

      expect(result.message).toBe('Objetivo vinculado al proceso');
      expect(mockDgraph.createRelationship).toHaveBeenCalledWith(
        'obj-001',
        'process-001',
        'supportsProcess',
        tenantId
      );
    });

    it('debe eliminar objetivo de BD y Dgraph', async () => {
      mockPrisma.sgcnObjective.deleteMany.mockResolvedValue({ count: 1 });
      mockDgraph.deleteNode.mockResolvedValue(true);

      await service.removeObjective('obj-001', tenantId);

      expect(mockPrisma.sgcnObjective.deleteMany).toHaveBeenCalled();
      expect(mockDgraph.deleteNode).toHaveBeenCalledWith('obj-001');
    });
  });

  // ==========================================
  // TESTS DE MATRIZ RACI (ISO 22301 Cl. 5.3)
  // ==========================================

  describe('Gestión de Matriz RACI', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-ciso';

    it('debe crear matriz RACI válida', async () => {
      const mockRaci = {
        id: 'raci-001',
        tenantId,
        processOrActivity: 'Gestión de Crisis',
        assignments: [
          { role: 'CISO', responsibility: 'Líder', raciType: 'RESPONSIBLE' },
          { role: 'IT Director', responsibility: 'Soporte', raciType: 'ACCOUNTABLE' },
        ],
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.raciMatrix.create.mockResolvedValue(mockRaci);

      const result = await service.createRaciMatrix(
        {
          processOrActivity: 'Gestión de Crisis',
          assignments: [
            { role: 'CISO', responsibility: 'Líder', raciType: 'RESPONSIBLE' },
            { role: 'IT Director', responsibility: 'Soporte', raciType: 'ACCOUNTABLE' },
          ],
        },
        tenantId,
        userId
      );

      expect(result.processOrActivity).toBe('Gestión de Crisis');
      expect(result.assignments).toHaveLength(2);
    });

    it('debe listar matrices RACI', async () => {
      mockPrisma.raciMatrix.findMany.mockResolvedValue([
        { id: 'raci-001', processOrActivity: 'Gestión de Crisis' },
        { id: 'raci-002', processOrActivity: 'Respuesta a Incidentes' },
      ]);

      const result = await service.findAllRaciMatrices(tenantId);

      expect(result).toHaveLength(2);
    });

    it('debe obtener responsabilidades de un usuario', async () => {
      mockPrisma.raciMatrix.findMany.mockResolvedValue([
        {
          id: 'raci-001',
          processOrActivity: 'Crisis',
          assignments: [
            { role: 'CISO', owner: 'user-ciso', raciType: 'RESPONSIBLE' },
          ],
        },
        {
          id: 'raci-002',
          processOrActivity: 'DR',
          assignments: [
            { role: 'Admin', owner: 'user-admin', raciType: 'ACCOUNTABLE' },
          ],
        },
      ]);

      const result = await service.getUserResponsibilities('user-ciso', tenantId);

      expect(result).toHaveLength(1);
      expect(result[0].processOrActivity).toBe('Crisis');
    });
  });

  // ==========================================
  // TESTS DE INTEGRACIÓN COMPLETA
  // ==========================================

  describe('Flujo Completo de Gobierno', () => {
    it('debe completar ciclo completo de política: crear → revisar → aprobar → publicar', async () => {
      const tenantId = 'tenant-001';
      const userId = 'user-ciso';
      
      // 1. Crear
      mockPrisma.sgcnPolicy.create.mockResolvedValue({
        id: 'policy-001',
        status: 'DRAFT',
      });

      const created = await service.createPolicy(
        { title: 'Test', content: 'Test', version: '1.0' },
        tenantId,
        userId
      );

      expect(created.status).toBe('DRAFT');

      // 2. Enviar a revisión
      mockPrisma.sgcnPolicy.updateMany.mockResolvedValue({ count: 1 });
      mockWorkflow.createApprovalWorkflow.mockResolvedValue({ id: 'wf-001' });

      await service.submitPolicyForApproval(created.id, tenantId, ['user-ceo'], userId);

      // 3. Aprobar
      await service.approvePolicy(created.id, tenantId, 'user-ceo');

      // 4. Publicar
      mockPrisma.sgcnPolicy.findFirst.mockResolvedValue({
        id: created.id,
        status: 'APPROVED',
        title: 'Test',
      });

      const published = await service.publishPolicy(created.id, tenantId, userId);

      expect(published.message).toBe('Política publicada exitosamente');
    });
  });
});
