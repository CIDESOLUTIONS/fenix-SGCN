import { Test, TestingModule } from '@nestjs/testing';
import { TestExercisesService } from './test-exercises.service';
import { PrismaService } from '../prisma/prisma.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { NotFoundException } from '@nestjs/common';

describe('TestExercisesService - Módulo 6: Pruebas de Continuidad (EXHAUSTIVO)', () => {
  let service: TestExercisesService;
  let prisma: PrismaService;

  const mockPrisma = {
    testExercise: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    finding: {
      create: jest.fn(),
    },
  };

  const mockDgraph = {};
  const mockWorkflow = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestExercisesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DgraphService, useValue: mockDgraph },
        { provide: WorkflowEngineService, useValue: mockWorkflow },
      ],
    }).compile();

    service = module.get<TestExercisesService>(TestExercisesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE CREACIÓN DE EJERCICIOS
  // ==========================================

  describe('Creación de Ejercicios (ISO 22301 Cl. 8.5)', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-exercise-manager';

    it('debe crear ejercicio TABLETOP', async () => {
      mockPrisma.testExercise.create.mockResolvedValue({
        id: 'exercise-001',
        tenantId,
        name: 'Ejercicio de Mesa: Fallo de Datacenter',
        type: 'DESKTOP',
        planId: 'plan-001',
        scheduledDate: new Date('2025-12-15'),
        objectives: ['Validar comunicación del equipo', 'Revisar procedimientos'],
        scenario: { description: 'Fallo completo del datacenter principal' },
        participants: ['user-001', 'user-002', 'user-003'],
        plan: { id: 'plan-001', name: 'Plan DR Datacenter' },
      });

      const result = await service.create(
        {
          name: 'Ejercicio de Mesa: Fallo de Datacenter',
          type: 'DESKTOP',
          planId: 'plan-001',
          scheduledDate: '2025-12-15',
          objectives: ['Validar comunicación del equipo', 'Revisar procedimientos'],
          scenario: 'Fallo completo del datacenter principal',
          participants: ['user-001', 'user-002', 'user-003'],
        },
        tenantId,
        userId
      );

      expect(result.type).toBe('DESKTOP');
      expect(result.participants).toHaveLength(3);
    });

    it('debe crear ejercicio FULL_SCALE con múltiples objetivos', async () => {
      mockPrisma.testExercise.create.mockResolvedValue({
        id: 'exercise-002',
        type: 'FULL_RECOVERY',
        objectives: [
          'Validar RTO de 4 horas',
          'Probar failover automático',
          'Verificar comunicaciones',
          'Validar restauración de datos',
        ],
      });

      const result = await service.create(
        {
          name: 'Ejercicio Completo DR',
          type: 'FULL_RECOVERY',
          planId: 'plan-001',
          objectives: [
            'Validar RTO de 4 horas',
            'Probar failover automático',
            'Verificar comunicaciones',
            'Validar restauración de datos',
          ],
        },
        tenantId,
        userId
      );

      expect(result.type).toBe('FULL_RECOVERY');
      expect(result.objectives).toHaveLength(4);
    });
  });

  // ==========================================
  // TESTS DE EJECUCIÓN DE EJERCICIOS
  // ==========================================

  describe('Ejecución de Ejercicios', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-facilitator';

    it('debe iniciar ejercicio y registrar hora de inicio', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-001',
        name: 'Test Exercise',
        plan: { id: 'plan-001', name: 'Plan Test' },
      });

      const startTime = new Date();
      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-001',
        executedDate: startTime,
        executedBy: userId,
        actualStartTime: startTime,
        executionLog: {
          startedBy: userId,
          startedAt: startTime,
          events: [],
        },
      });

      const result = await service.startExercise('exercise-001', tenantId, userId);

      expect(result.executedDate).toEqual(startTime);
      expect(result.actualStartTime).toEqual(startTime);
      expect(result.executionLog).toHaveProperty('startedBy', userId);
    });

    it('debe registrar eventos durante ejecución', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-001',
        executionLog: {
          startedBy: 'user-001',
          startedAt: new Date(),
          events: [],
        },
      });

      const event = {
        timestamp: new Date(),
        type: 'TASK_COMPLETED',
        description: 'Failover a sitio secundario completado',
        participantId: 'user-002',
        duration: 35,
      };

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-001',
        executionLog: {
          startedBy: 'user-001',
          startedAt: new Date(),
          events: [event],
        },
      });

      const result = await service.logEvent('exercise-001', tenantId, event, userId);

      expect(result.executionLog).toHaveProperty('events');
      expect((result.executionLog as any).events).toHaveLength(1);
    });

    it('debe fallar si ejercicio no existe', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue(null);

      await expect(
        service.startExercise('exercise-999', tenantId, userId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // TESTS DE SCORING AUTOMÁTICO
  // ==========================================

  describe('Scoring Automático de Ejercicios', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-facilitator';

    it('debe asignar PASS si RTO se cumple', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-001',
        name: 'Test',
        plan: {
          id: 'plan-001',
          process: {
            id: 'process-001',
            biaAssessments: [{ rto: 4, rpo: 2 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-001',
        actualEndTime: new Date(),
        results: {
          rtoAchieved: 3.5,
          successRate: 95,
          score: 'PASS',
          completedBy: userId,
        },
      });

      mockPrisma.finding.create.mockResolvedValue({});

      const result = await service.completeExercise(
        'exercise-001',
        tenantId,
        {
          rtoAchieved: 3.5,
          successRate: 95,
          observations: [],
        },
        userId
      );

      expect(result.actualEndTime).toBeDefined();
      expect((result.results as any).score).toBe('PASS');
    });

    it('debe asignar FAIL si RTO no se cumple', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-002',
        name: 'Test Failed',
        plan: {
          id: 'plan-001',
          process: {
            id: 'process-001',
            biaAssessments: [{ rto: 4, rpo: 2 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-002',
        actualEndTime: new Date(),
        results: {
          rtoAchieved: 6,
          successRate: 60,
          score: 'FAIL',
        },
      });

      mockPrisma.finding.create.mockResolvedValue({});

      const result = await service.completeExercise(
        'exercise-002',
        tenantId,
        {
          rtoAchieved: 6,
          successRate: 60,
          observations: ['Demora en activación de respaldo'],
        },
        userId
      );

      expect((result.results as any).score).toBe('FAIL');
    });

    it('debe asignar FAIL si successRate < 70%', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-004',
        plan: {
          process: {
            biaAssessments: [{ rto: 4 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-004',
        results: {
          successRate: 65,
          score: 'FAIL',
        },
      });

      mockPrisma.finding.create.mockResolvedValue({});

      const result = await service.completeExercise(
        'exercise-004',
        tenantId,
        {
          rtoAchieved: 3,
          successRate: 65,
        },
        userId
      );

      expect((result.results as any).score).toBe('FAIL');
    });
  });

  // ==========================================
  // TESTS DE GENERACIÓN DE HALLAZGOS
  // ==========================================

  describe('Generación Automática de Hallazgos', () => {
    const tenantId = 'tenant-001';
    const userId = 'user-facilitator';

    it('debe generar hallazgo si RTO no se cumple', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-001',
        plan: {
          process: {
            biaAssessments: [{ rto: 4, rpo: 2 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-001',
        status: 'COMPLETED',
        results: {
          rtoAchieved: 6,
          score: 'FAIL',
        },
      });

      mockPrisma.finding.create.mockResolvedValue({
        id: 'finding-001',
        title: 'RTO No Cumplido',
        severity: 'HIGH',
      });

      await service.completeExercise(
        'exercise-001',
        tenantId,
        {
          rtoAchieved: 6,
          successRate: 80,
        },
        userId
      );

      expect(mockPrisma.finding.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'RTO No Cumplido',
            severity: 'HIGH',
            source: 'EXERCISE',
          }),
        })
      );
    });

    it('debe generar múltiples hallazgos si hay varias fallas', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-002',
        plan: {
          process: {
            biaAssessments: [{ rto: 4 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: 'exercise-002',
        results: {
          rtoAchieved: 6,
          successRate: 65,
          score: 'FAIL',
        },
      });

      mockPrisma.finding.create.mockResolvedValue({});

      await service.completeExercise(
        'exercise-002',
        tenantId,
        {
          rtoAchieved: 6,
          successRate: 65,
          observations: ['Error en comunicaciones', 'Falta de personal capacitado'],
        },
        userId
      );

      expect(mockPrisma.finding.create).toHaveBeenCalledTimes(3);
    });
  });

  // ==========================================
  // TESTS DE REPORTES POST-EJERCICIO
  // ==========================================

  describe('Generación de Reportes', () => {
    const tenantId = 'tenant-001';

    it('debe generar reporte completo post-ejercicio', async () => {
      const startTime = new Date('2025-12-15T10:00:00');
      const endTime = new Date('2025-12-15T13:30:00');

      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-001',
        name: 'Ejercicio DR Datacenter',
        type: 'FULL_SCALE',
        scheduledDate: new Date('2025-12-15'),
        actualStartTime: startTime,
        actualEndTime: endTime,
        objectives: ['Validar RTO', 'Probar failover'],
        scenario: 'Fallo completo datacenter',
        participants: ['user-001', 'user-002'],
        executionLog: {
          events: [
            { type: 'START', description: 'Inicio ejercicio' },
            { type: 'TASK', description: 'Failover completado', duration: 30 },
          ],
        },
        results: {
          score: 'PASS',
          rtoAchieved: 3.5,
          successRate: 95,
          observations: ['Excelente coordinación'],
          evidence: [{ type: 'SCREENSHOT', url: '/evidence/1.png', description: 'DR activo' }],
        },
        plan: {
          id: 'plan-001',
          name: 'Plan DR',
          process: {
            id: 'process-001',
            name: 'Pagos Online',
            biaAssessments: [{ rto: 4, rpo: 2 }],
          },
        },
      });

      const report = await service.generateReport('exercise-001', tenantId);

      expect(report).toMatchObject({
        exerciseId: 'exercise-001',
        exerciseName: 'Ejercicio DR Datacenter',
        exerciseType: 'FULL_SCALE',
        duration: 3.5,
        planDetails: {
          id: 'plan-001',
          name: 'Plan DR',
          processName: 'Pagos Online',
        },
        execution: {
          totalEvents: 2,
        },
        results: {
          score: 'PASS',
          rtoTarget: 4,
          rtoAchieved: 3.5,
          rtoMet: true,
          successRate: 95,
        },
      });
      expect(report.recommendations).toBeDefined();
    });

    it('debe generar recomendaciones basadas en resultados', async () => {
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: 'exercise-002',
        name: 'Test',
        type: 'TABLETOP',
        actualStartTime: new Date(),
        actualEndTime: new Date(),
        results: {
          rtoAchieved: 6,
          successRate: 65,
          observations: ['Obs 1', 'Obs 2', 'Obs 3', 'Obs 4'],
        },
        participants: ['user-001'],
        plan: {
          process: {
            biaAssessments: [{ rto: 4 }],
          },
        },
      });

      const report = await service.generateReport('exercise-002', tenantId);

      expect(report.recommendations).toEqual(
        expect.arrayContaining([
          expect.stringContaining('reducir el tiempo de recuperación'),
          expect.stringContaining('capacitación adicional'),
          expect.stringContaining('Actualizar el plan'),
          expect.stringContaining('más participantes'),
        ])
      );
    });
  });

  // ==========================================
  // TESTS DE ESTADÍSTICAS
  // ==========================================

  describe('Estadísticas de Ejercicios', () => {
    const tenantId = 'tenant-001';

    it('debe calcular estadísticas correctamente', async () => {
      mockPrisma.testExercise.findMany.mockResolvedValue([
        {
          id: 'ex-001',
          type: 'DESKTOP',
          actualEndTime: new Date(),
          results: { score: 'PASS', successRate: 95 },
          plan: { process: {} },
        },
        {
          id: 'ex-002',
          type: 'FULL_RECOVERY',
          actualEndTime: new Date(),
          results: { score: 'FAIL', successRate: 60 },
          plan: { process: {} },
        },
        {
          id: 'ex-003',
          type: 'DESKTOP',
          actualEndTime: null,
          results: null,
          plan: { process: {} },
        },
      ]);

      const stats = await service.getExerciseStatistics(tenantId);

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.passed).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.passRate).toBe(50);
      expect(stats.avgSuccessRate).toBeCloseTo(77.5, 1);
      expect(stats.byType).toEqual({
        DESKTOP: 2,
        FULL_RECOVERY: 1,
      });
    });

    it('debe manejar caso sin ejercicios', async () => {
      mockPrisma.testExercise.findMany.mockResolvedValue([]);

      const stats = await service.getExerciseStatistics(tenantId);

      expect(stats.total).toBe(0);
      expect(stats.passRate).toBe(0);
    });
  });

  // ==========================================
  // TESTS DE INTEGRACIÓN COMPLETA
  // ==========================================

  describe('Flujo Completo de Ejercicios', () => {
    it('debe completar ciclo: crear → ejecutar → completar → reportar', async () => {
      const tenantId = 'tenant-001';
      const userId = 'user-facilitator';

      // 1. Crear ejercicio
      mockPrisma.testExercise.create.mockResolvedValue({
        id: 'exercise-001',
        name: 'Ejercicio DR',
        type: 'FULL_RECOVERY',
        planId: 'plan-001',
      });

      const created = await service.create(
        {
          name: 'Ejercicio DR',
          type: 'FULL_RECOVERY',
          planId: 'plan-001',
          objectives: ['Validar RTO'],
        },
        tenantId,
        userId
      );

      expect(created.id).toBe('exercise-001');

      // 2. Iniciar ejercicio
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: created.id,
        plan: {},
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: created.id,
        executedDate: new Date(),
        actualStartTime: new Date(),
      });

      const started = await service.startExercise(created.id, tenantId, userId);
      expect(started.actualStartTime).toBeDefined();

      // 3. Completar con resultados
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        id: created.id,
        plan: {
          process: {
            biaAssessments: [{ rto: 4, rpo: 2 }],
          },
        },
      });

      mockPrisma.testExercise.update.mockResolvedValue({
        id: created.id,
        actualEndTime: new Date(),
        results: {
          rtoAchieved: 3.5,
          successRate: 95,
          score: 'PASS',
        },
      });

      mockPrisma.finding.create.mockResolvedValue({});

      const completed = await service.completeExercise(
        created.id,
        tenantId,
        {
          rtoAchieved: 3.5,
          successRate: 95,
        },
        userId
      );

      expect(completed.actualEndTime).toBeDefined();
      expect((completed.results as any).score).toBe('PASS');

      // 4. Generar reporte
      mockPrisma.testExercise.findFirst.mockResolvedValue({
        ...completed,
        actualStartTime: new Date(),
        actualEndTime: new Date(),
        executionLog: { events: [] },
        plan: {
          process: {
            biaAssessments: [{ rto: 4 }],
          },
        },
      });

      const report = await service.generateReport(created.id, tenantId);

      expect(report.exerciseId).toBe(created.id);
      expect(report.results.score).toBe('PASS');
    });
  });
});
