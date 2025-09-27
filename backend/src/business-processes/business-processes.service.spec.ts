import { Test, TestingModule } from '@nestjs/testing';
import { BusinessProcessesService } from './business-processes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BusinessProcessesService', () => {
  let service: BusinessProcessesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    businessProcess: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessProcessesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BusinessProcessesService>(BusinessProcessesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a business process', async () => {
      const dto = {
        name: 'Test Process',
        description: 'Test Description',
        criticalityLevel: 'HIGH' as any,
        department: 'IT',
      };
      const tenantId = 'tenant_123';
      const expectedResult = { id: '1', ...dto, tenantId };

      mockPrismaService.businessProcess.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto, tenantId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.businessProcess.create).toHaveBeenCalledWith({
        data: { ...dto, tenantId },
      });
    });
  });

  describe('findAll', () => {
    it('should return all business processes for a tenant', async () => {
      const tenantId = 'tenant_123';
      const expectedResult = [
        { id: '1', name: 'Process 1', tenantId },
        { id: '2', name: 'Process 2', tenantId },
      ];

      mockPrismaService.businessProcess.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll(tenantId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.businessProcess.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        include: {
          biaAssessments: true,
          riskAssessments: true,
          strategies: true,
          plans: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single business process', async () => {
      const id = 'process_123';
      const tenantId = 'tenant_123';
      const expectedResult = { id, name: 'Test Process', tenantId };

      mockPrismaService.businessProcess.findFirst.mockResolvedValue(expectedResult);

      const result = await service.findOne(id, tenantId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.businessProcess.findFirst).toHaveBeenCalledWith({
        where: { id, tenantId },
        include: {
          biaAssessments: true,
          riskAssessments: true,
          strategies: true,
          plans: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a business process', async () => {
      const id = 'process_123';
      const tenantId = 'tenant_123';
      const dto = { name: 'Updated Process' };
      const expectedResult = { count: 1 };

      mockPrismaService.businessProcess.updateMany.mockResolvedValue(expectedResult);

      const result = await service.update(id, tenantId, dto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.businessProcess.updateMany).toHaveBeenCalledWith({
        where: { id, tenantId },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a business process', async () => {
      const id = 'process_123';
      const tenantId = 'tenant_123';
      const expectedResult = { count: 1 };

      mockPrismaService.businessProcess.deleteMany.mockResolvedValue(expectedResult);

      const result = await service.remove(id, tenantId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.businessProcess.deleteMany).toHaveBeenCalledWith({
        where: { id, tenantId },
      });
    });
  });
});
