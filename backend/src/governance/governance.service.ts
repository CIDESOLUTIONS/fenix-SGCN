import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEngineService } from '../workflow-engine/workflow-engine.service';
import { DgraphService } from '../dgraph/dgraph.service';
import { CreatePolicyDto, CreateObjectiveDto, CreateRaciMatrixDto } from './dto/create-governance.dto';
import { UpdatePolicyDto, UpdateObjectiveDto, UpdateRaciMatrixDto } from './dto/update-governance.dto';

@Injectable()
export class GovernanceService {
  private readonly logger = new Logger(GovernanceService.name);

  constructor(
    private prisma: PrismaService,
    private workflowEngine: WorkflowEngineService,
    private dgraphService: DgraphService,
  ) {}

  // ============================================
  // GESTIÓN DE POLÍTICAS DEL SGCN
  // ============================================

  /**
   * Crear política del SGCN
   */
  async createPolicy(dto: CreatePolicyDto, tenantId: string, userId: string) {
    const policy = await this.prisma.sgcnPolicy.create({
      data: {
        tenantId,
        title: dto.title,
        content: dto.content,
        version: dto.version || '1.0',
        status: dto.status || 'DRAFT',
        createdBy: userId,
      },
    });

    this.logger.log(`Policy created: ${policy.id} by ${userId}`);
    return policy;
  }

  /**
   * Listar políticas
   */
  async findAllPolicies(tenantId: string) {
    return this.prisma.sgcnPolicy.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener política por ID
   */
  async findOnePolicy(id: string, tenantId: string) {
    const policy = await this.prisma.sgcnPolicy.findFirst({
      where: { id, tenantId },
    });

    if (!policy) {
      throw new NotFoundException(`Policy ${id} not found`);
    }

    return policy;
  }

  /**
   * Actualizar política
   */
  async updatePolicy(id: string, tenantId: string, dto: UpdatePolicyDto, userId: string) {
    const policy = await this.prisma.sgcnPolicy.updateMany({
      where: { id, tenantId },
      data: {
        ...dto,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Policy updated: ${id} by ${userId}`);
    return policy;
  }

  /**
   * Enviar política a revisión (workflow de aprobación)
   */
  async submitPolicyForApproval(id: string, tenantId: string, approvers: string[], userId: string) {
    // Actualizar estado
    await this.prisma.sgcnPolicy.updateMany({
      where: { id, tenantId },
      data: { status: 'REVIEW' },
    });

    // Crear workflow de aprobación
    const workflow = await this.workflowEngine.createApprovalWorkflow(
      'sgcn-policy',
      id,
      approvers,
      tenantId,
      userId,
    );

    this.logger.log(`Policy ${id} submitted for approval - Workflow: ${workflow.id}`);

    return {
      message: 'Política enviada a revisión',
      workflowId: workflow.id,
      approvers,
    };
  }

  /**
   * Aprobar política
   */
  async approvePolicy(id: string, tenantId: string, userId: string, comments?: string) {
    const policy = await this.prisma.sgcnPolicy.updateMany({
      where: { id, tenantId },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    // Notificar al creador
    await this.workflowEngine.sendNotification(
      [userId],
      'Política del SGCN Aprobada',
      `La política ha sido aprobada. ${comments || ''}`,
      tenantId,
    );

    this.logger.log(`Policy ${id} approved by ${userId}`);
    return policy;
  }

  /**
   * Publicar política (activar)
   */
  async publishPolicy(id: string, tenantId: string, userId: string) {
    const policy = await this.prisma.sgcnPolicy.findFirst({
      where: { id, tenantId },
    });

    if (!policy || policy.status !== 'APPROVED') {
      throw new Error('Solo se pueden publicar políticas aprobadas');
    }

    await this.prisma.sgcnPolicy.updateMany({
      where: { id, tenantId },
      data: {
        status: 'ACTIVE',
        publishedAt: new Date(),
        publishedBy: userId,
      },
    });

    // Notificar a toda la organización
    await this.workflowEngine.sendNotification(
      [], // En producción: obtener todos los usuarios del tenant
      `Nueva Política Publicada: ${policy.title}`,
      'Se ha publicado una nueva política del SGCN. Por favor, revise el contenido en el sistema.',
      tenantId,
    );

    this.logger.log(`Policy ${id} published by ${userId}`);
    return { message: 'Política publicada exitosamente', policy };
  }

  /**
   * Eliminar política
   */
  async removePolicy(id: string, tenantId: string) {
    await this.prisma.sgcnPolicy.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`Policy deleted: ${id}`);
    return { message: 'Política eliminada' };
  }

  // ============================================
  // GESTIÓN DE OBJETIVOS DEL SGCN
  // ============================================

  /**
   * Crear objetivo del SGCN
   */
  async createObjective(dto: CreateObjectiveDto, tenantId: string, userId: string) {
    const objective = await this.prisma.sgcnObjective.create({
      data: {
        tenantId,
        description: dto.description,
        measurementCriteria: dto.measurementCriteria,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
        owner: dto.owner || userId,
        status: dto.status || 'NOT_STARTED',
        createdBy: userId,
      },
    });

    // Sincronizar objetivo a Dgraph para análisis
    await this.dgraphService.upsertNode(
      'Objective',
      {
        id: objective.id,
        description: objective.description,
        status: objective.status,
        owner: objective.owner,
        nodeType: 'Objective',
      },
      tenantId,
    );

    this.logger.log(`Objective created: ${objective.id}`);
    return objective;
  }

  /**
   * Listar objetivos
   */
  async findAllObjectives(tenantId: string) {
    return this.prisma.sgcnObjective.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener objetivo por ID
   */
  async findOneObjective(id: string, tenantId: string) {
    const objective = await this.prisma.sgcnObjective.findFirst({
      where: { id, tenantId },
    });

    if (!objective) {
      throw new NotFoundException(`Objective ${id} not found`);
    }

    return objective;
  }

  /**
   * Actualizar objetivo
   */
  async updateObjective(id: string, tenantId: string, dto: UpdateObjectiveDto, userId: string) {
    const objective = await this.prisma.sgcnObjective.updateMany({
      where: { id, tenantId },
      data: {
        ...dto,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        updatedAt: new Date(),
      },
    });

    // Actualizar en Dgraph
    await this.dgraphService.upsertNode(
      'Objective',
      {
        id,
        description: dto.description,
        status: dto.status,
      },
      tenantId,
    );

    this.logger.log(`Objective updated: ${id}`);
    return objective;
  }

  /**
   * Vincular objetivo a proceso (relación en grafo)
   */
  async linkObjectiveToProcess(objectiveId: string, processId: string, tenantId: string) {
    await this.dgraphService.createRelationship(
      objectiveId,
      processId,
      'supportsProcess',
      tenantId,
    );

    this.logger.log(`Objective ${objectiveId} linked to process ${processId}`);
    return { message: 'Objetivo vinculado al proceso' };
  }

  /**
   * Eliminar objetivo
   */
  async removeObjective(id: string, tenantId: string) {
    await this.prisma.sgcnObjective.deleteMany({
      where: { id, tenantId },
    });

    await this.dgraphService.deleteNode(id);

    this.logger.log(`Objective deleted: ${id}`);
    return { message: 'Objetivo eliminado' };
  }

  // ============================================
  // GESTIÓN DE MATRIZ RACI
  // ============================================

  /**
   * Crear matriz RACI
   */
  async createRaciMatrix(dto: CreateRaciMatrixDto, tenantId: string, userId: string) {
    const matrix = await this.prisma.raciMatrix.create({
      data: {
        tenantId,
        processOrActivity: dto.processOrActivity,
        assignments: dto.assignments as any,
        createdBy: userId,
      },
    });

    this.logger.log(`RACI Matrix created: ${matrix.id}`);
    return matrix;
  }

  /**
   * Listar matrices RACI
   */
  async findAllRaciMatrices(tenantId: string) {
    return this.prisma.raciMatrix.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener matriz RACI por ID
   */
  async findOneRaciMatrix(id: string, tenantId: string) {
    const matrix = await this.prisma.raciMatrix.findFirst({
      where: { id, tenantId },
    });

    if (!matrix) {
      throw new NotFoundException(`RACI Matrix ${id} not found`);
    }

    return matrix;
  }

  /**
   * Actualizar matriz RACI
   */
  async updateRaciMatrix(id: string, tenantId: string, dto: UpdateRaciMatrixDto) {
    const matrix = await this.prisma.raciMatrix.updateMany({
      where: { id, tenantId },
      data: {
        processOrActivity: dto.processOrActivity,
        assignments: dto.assignments as any,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`RACI Matrix updated: ${id}`);
    return matrix;
  }

  /**
   * Eliminar matriz RACI
   */
  async removeRaciMatrix(id: string, tenantId: string) {
    await this.prisma.raciMatrix.deleteMany({
      where: { id, tenantId },
    });

    this.logger.log(`RACI Matrix deleted: ${id}`);
    return { message: 'Matriz RACI eliminada' };
  }

  /**
   * Obtener roles y responsabilidades por usuario
   */
  async getUserResponsibilities(userId: string, tenantId: string) {
    const matrices = await this.prisma.raciMatrix.findMany({
      where: { tenantId },
    });

    const userResponsibilities = matrices.filter(matrix => {
      const assignments = matrix.assignments as any[];
      return assignments.some(a => a.owner === userId);
    });

    return userResponsibilities;
  }
}
