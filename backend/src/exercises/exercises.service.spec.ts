import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsEngineService } from '../analytics-engine/analytics-engine.service';

describe('ExercisesService - Módulo 6: Pruebas de Continuidad', () => {
  let service: ExercisesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    exercise: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    continuityPlan: {
      findFirst: jest.fn(),
    },
    finding: {
      create: jest.fn(),
    },
  };

  const mockAnalyticsService = {
    calculateExerciseScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AnalyticsEngineService, useValue: mockAnalyticsService },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Planificación de Ejercicios (ISO 22301 Cl. 8.5)', () => {
    const mockExercise = {
      id: 'exercise-001',
      tenantId: 'test-tenant-001',
      name: 'Simulacro DR',
      type: 'TABLETOP',
      planId: 'plan-001',
      scheduledDate: new Date('2025-10-15'),
      facilitator: 'user-ciso',
      participants: ['user-001', 'user-002'],
      status: 'PLANNED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('debe crear ejercicio con plan de prueba', async () => {
      mockPrismaService.exercise.create.mockResolvedValue(mockExercise);

      const result = await service.create(
        {
          name: 'Simulacro DR',
          type: 'TABLETOP',
          planId: 'plan-001',
          scheduledDate: new Date('2025-10-15'),
          objectives: [
            'Validar RTO de 4 horas',
            'Probar comunicación del equipo',
          ],
        },
        'test-tenant-001',
        'user-ciso'
      );

      expect(result.type).toBe('TABLETOP');
      expect(result.facilitator).toBe('user-ciso');
    });

    it('debe generar checklist automático del plan', async () => {
      mockPrismaService.continuityPlan.findFirst.mockResolvedValue({
        content: {
          steps: [
            { order: 1, action: 'Activar DR' },
            { order: 2, action: 'Verificar replicación' },
          ],
        },
      });

      const checklist = await service.generateChecklist('plan-001');

      expect(checklist).toHaveLength(2);
      expect(checklist[0]).toHaveProperty('action', 'Activar DR');
      expect(checklist[0]).toHaveProperty('completed', false);
    });
  });

  describe('Ejecución en Tiempo Real', () => {
    it('debe iniciar ejercicio y registrar timestamp', async () => {
      const started = await service.startExercise('exercise-001', 'user-ciso');

      expect(started.status).toBe('IN_PROGRESS');
      expect(started.actualStartTime).toBeDefined();
      expect(started.executionLog).toEqual([
        expect.objectContaining({
          timestamp: expect.any(Date),
          event: 'EXERCISE_STARTED',
        }),
      ]);
    });

    it('debe registrar eventos durante el ejercicio', async () => {
      const event = await service.logEvent('exercise-001', {
        type: 'TASK_COMPLETED',
        taskId: 'task-001',
        completedBy: 'user-001',
        duration: 15, // minutos
      });

      expect(event.logged).toBe(true);
    });

    it('debe finalizar ejercicio y calcular duración', async () => {
      mockPrismaService.exercise.findFirst.mockResolvedValue({
        actualStartTime: new Date('2025-10-15T10:00:00Z'),
      });

      const finished = await service.finishExercise('exercise-001');

      expect(finished.actualEndTime).toBeDefined();
      expect(finished.actualDuration).toBeGreaterThan(0);
      expect(finished.status).toBe('COMPLETED');
    });
  });

  describe('Puntuación Automatizada', () => {
    it('debe calcular score basado en RTO vs tiempo real', async () => {
      mockAnalyticsService.calculateExerciseScore.mockResolvedValue({
        score: 85,
        metrics: {
          rtoAchieved: true,
          rtoTarget: 240,
          actualTime: 210,
          variance: -30,
        },
      });

      const score = await service.calculateScore('exercise-001');

      expect(score.score).toBe(85);
      expect(score.metrics.rtoAchieved).toBe(true);
    });

    it('debe penalizar si se excede RTO', async () => {
      const score = service.scoreRTO(300, 240); // Real: 5h, Target: 4h

      expect(score).toBeLessThan(70); // Penalización
    });
  });

  describe('Captura de Evidencias', () => {
    it('debe subir evidencia multimedia', async () => {
      const evidence = await service.uploadEvidence('exercise-001', {
        type: 'PHOTO',
        file: Buffer.from('fake-image'),
        description: 'Equipo activando DR',
        timestamp: new Date(),
      });

      expect(evidence.url).toMatch(/^https:\/\//);
      expect(evidence.type).toBe('PHOTO');
    });
  });

  describe('Informe Post-Ejercicio', () => {
    it('debe generar informe automático con brechas', async () => {
      mockPrismaService.exercise.findFirst.mockResolvedValue({
        objectives: ['Validar RTO'],
        executionLog: [/* eventos */],
        score: 75,
      });

      const report = await service.generateReport('exercise-001');

      expect(report).toHaveProperty('executiveSummary');
      expect(report).toHaveProperty('objectives');
      expect(report).toHaveProperty('gaps');
      expect(report).toHaveProperty('recommendations');
    });

    it('debe crear findings automáticos de brechas detectadas', async () => {
      const gaps = [
        { description: 'Documentación desactualizada', severity: 'MINOR' },
      ];

      mockPrismaService.finding.create.mockResolvedValue({
        id: 'finding-001',
      });

      const findings = await service.createFindingsFromGaps('exercise-001', gaps);

      expect(findings).toHaveLength(1);
      expect(mockPrismaService.finding.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          source: 'EXERCISE',
          severity: 'MINOR',
        }),
      });
    });
  });
});
