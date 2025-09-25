import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DgraphService } from '../../dgraph/dgraph.service';

/**
 * Interceptor para sincronizar datos entre PostgreSQL y Dgraph
 * Implementa el patrón de doble escritura
 */
@Injectable()
export class GraphSyncInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GraphSyncInterceptor.name);

  constructor(private dgraphService: DgraphService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route?.path || '';

    return next.handle().pipe(
      tap(async (data) => {
        // Solo sincronizar en operaciones de escritura
        if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
          await this.syncToGraph(path, data, request);
        }
      }),
    );
  }

  /**
   * Sincronizar entidad a Dgraph basado en el path
   */
  private async syncToGraph(path: string, data: any, request: any) {
    try {
      const tenantId = request.user?.tenantId || data?.tenantId;

      if (!tenantId) {
        this.logger.warn('No tenantId found for graph sync');
        return;
      }

      // Sincronizar según el tipo de entidad
      if (path.includes('business-processes')) {
        await this.syncBusinessProcess(data, tenantId);
      } else if (path.includes('risk-assessments')) {
        await this.syncRisk(data, tenantId);
      } else if (path.includes('continuity-plans')) {
        await this.syncContinuityPlan(data, tenantId);
      } else if (path.includes('bia-assessments')) {
        await this.syncBIAAssessment(data, tenantId);
      }

      this.logger.log(`Graph synced: ${path} - ${data?.id || 'unknown'}`);
    } catch (error) {
      this.logger.error('Error syncing to graph', error);
      // No lanzar error para no afectar la operación principal
    }
  }

  /**
   * Sincronizar proceso de negocio
   */
  private async syncBusinessProcess(data: any, tenantId: string) {
    if (!data?.id) return;

    await this.dgraphService.upsertNode(
      'BusinessProcess',
      {
        id: data.id,
        name: data.name,
        criticality: data.criticality,
        rto: data.rto || 0,
        rpo: data.rpo || 0,
        nodeType: 'BusinessProcess',
      },
      tenantId,
    );

    // Sincronizar dependencias si existen
    if (data.dependencies && Array.isArray(data.dependencies)) {
      for (const dep of data.dependencies) {
        await this.dgraphService.createRelationship(
          data.id,
          dep.id,
          'dependsOn',
          tenantId,
        );
      }
    }
  }

  /**
   * Sincronizar riesgo
   */
  private async syncRisk(data: any, tenantId: string) {
    if (!data?.id) return;

    await this.dgraphService.upsertNode(
      'Risk',
      {
        id: data.id,
        name: data.name,
        impact: data.impact,
        likelihood: data.likelihood,
        nodeType: 'Risk',
      },
      tenantId,
    );

    // Vincular riesgo a procesos afectados
    if (data.affectedProcesses && Array.isArray(data.affectedProcesses)) {
      for (const processId of data.affectedProcesses) {
        await this.dgraphService.createRelationship(
          data.id,
          processId,
          'affects',
          tenantId,
        );
      }
    }
  }

  /**
   * Sincronizar plan de continuidad
   */
  private async syncContinuityPlan(data: any, tenantId: string) {
    if (!data?.id) return;

    await this.dgraphService.upsertNode(
      'ContinuityPlan',
      {
        id: data.id,
        name: data.name,
        status: data.status,
        nodeType: 'ContinuityPlan',
      },
      tenantId,
    );

    // Vincular plan a procesos protegidos
    if (data.processId) {
      await this.dgraphService.createRelationship(
        data.id,
        data.processId,
        'protects',
        tenantId,
      );
    }
  }

  /**
   * Sincronizar evaluación BIA
   */
  private async syncBIAAssessment(data: any, tenantId: string) {
    if (!data?.id || !data.processId) return;

    // Actualizar el nodo del proceso con datos del BIA
    await this.dgraphService.upsertNode(
      'BusinessProcess',
      {
        id: data.processId,
        rto: data.rto,
        rpo: data.rpo,
        criticality: data.criticality,
      },
      tenantId,
    );

    // Sincronizar dependencias identificadas en el BIA
    if (data.dependencies && Array.isArray(data.dependencies)) {
      for (const dep of data.dependencies) {
        await this.dgraphService.createRelationship(
          data.processId,
          dep.assetId || dep.id,
          'dependsOn',
          tenantId,
        );
      }
    }
  }
}
