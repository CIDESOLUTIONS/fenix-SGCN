import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgraph from 'dgraph-js';
import * as grpc from '@grpc/grpc-js';

/**
 * Servicio para interactuar con Dgraph (Base de Datos en Grafo)
 * Proporciona operaciones para gestionar el grafo de dependencias
 */
@Injectable()
export class DgraphService implements OnModuleInit {
  private readonly logger = new Logger(DgraphService.name);
  private dgraphClient: dgraph.DgraphClient;
  private dgraphClientStub: dgraph.DgraphClientStub;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeClient();
    await this.setupSchema();
  }

  /**
   * Inicializa el cliente de Dgraph
   */
  private async initializeClient() {
    try {
      const dgraphGrpcUrl = this.configService.get<string>('DGRAPH_GRPC_URL', 'fenix_dgraph:9080');
      
      this.dgraphClientStub = new dgraph.DgraphClientStub(
        dgraphGrpcUrl,
        grpc.credentials.createInsecure(),
      );
      
      this.dgraphClient = new dgraph.DgraphClient(this.dgraphClientStub);
      
      this.logger.log(`✅ Dgraph client initialized: ${dgraphGrpcUrl}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Dgraph client', error);
      throw error;
    }
  }

  /**
   * Configura el esquema inicial del grafo
   */
  private async setupSchema() {
    const schema = `
      # Tipos de Nodos en el Grafo
      type BusinessProcess {
        id: string @index(exact) @upsert
        name: string @index(fulltext)
        criticality: string @index(exact)
        rto: int
        rpo: int
        tenantId: string @index(exact)
        
        # Relaciones
        dependsOn: [GraphNode]
        requiredBy: [GraphNode]
        ownedBy: User
        hasPlan: ContinuityPlan
        hasRisks: [Risk]
      }

      type Asset {
        id: string @index(exact) @upsert
        name: string @index(fulltext)
        type: string @index(exact)
        criticality: string @index(exact)
        tenantId: string @index(exact)
        
        # Relaciones
        supports: [BusinessProcess]
        dependsOn: [Asset]
        requiredBy: [GraphNode]
      }

      type Risk {
        id: string @index(exact) @upsert
        name: string @index(fulltext)
        impact: string @index(exact)
        likelihood: string @index(exact)
        tenantId: string @index(exact)
        
        # Relaciones
        affects: [GraphNode]
        mitigatedBy: [Control]
      }

      type ContinuityPlan {
        id: string @index(exact) @upsert
        name: string @index(fulltext)
        status: string @index(exact)
        tenantId: string @index(exact)
        
        # Relaciones
        protects: [BusinessProcess]
        dependsOn: [Asset]
      }

      type User {
        id: string @index(exact) @upsert
        email: string @index(exact)
        fullName: string
        tenantId: string @index(exact)
        
        # Relaciones
        owns: [GraphNode]
      }

      type Control {
        id: string @index(exact) @upsert
        name: string @index(fulltext)
        tenantId: string @index(exact)
        
        # Relaciones
        mitigates: [Risk]
      }

      # Tipo genérico para nodos en el grafo
      type GraphNode {
        id: string @index(exact) @upsert
        nodeType: string @index(exact)
        tenantId: string @index(exact)
      }
    `;

    try {
      const op = new dgraph.Operation();
      op.setSchema(schema);
      await this.dgraphClient.alter(op);
      this.logger.log('✅ Dgraph schema initialized successfully');
    } catch (error) {
      this.logger.error('❌ Failed to setup Dgraph schema', error);
    }
  }

  /**
   * Crear o actualizar un nodo en el grafo
   */
  async upsertNode(nodeType: string, data: any, tenantId: string) {
    const txn = this.dgraphClient.newTxn();
    try {
      const mutation = {
        ...data,
        'dgraph.type': nodeType,
        tenantId,
      };

      const mu = new dgraph.Mutation();
      mu.setSetJson(mutation);
      const response = await txn.mutate(mu);
      await txn.commit();

      return response.getUidsMap().get('blank-0');
    } catch (error) {
      this.logger.error(`Error upserting node: ${nodeType}`, error);
      throw error;
    } finally {
      await txn.discard();
    }
  }

  /**
   * Crear una relación entre dos nodos
   */
  async createRelationship(
    sourceId: string,
    targetId: string,
    relationshipType: string,
    tenantId: string,
  ) {
    const txn = this.dgraphClient.newTxn();
    try {
      const mutation = {
        uid: sourceId,
        [relationshipType]: {
          uid: targetId,
        },
      };

      const mu = new dgraph.Mutation();
      mu.setSetJson(mutation);
      await txn.mutate(mu);
      await txn.commit();

      this.logger.log(`✅ Relationship created: ${sourceId} --[${relationshipType}]--> ${targetId}`);
    } catch (error) {
      this.logger.error('Error creating relationship', error);
      throw error;
    } finally {
      await txn.discard();
    }
  }

  /**
   * Consultar dependencias de un nodo (hacia abajo)
   */
  async getDependencies(nodeId: string, tenantId: string, depth = 3): Promise<any> {
    const query = `
      query dependencies($nodeId: string, $tenantId: string) {
        node(func: eq(id, $nodeId)) @filter(eq(tenantId, $tenantId)) {
          id
          name
          nodeType
          dependsOn @recurse(depth: ${depth}) {
            id
            name
            nodeType
            criticality
          }
        }
      }
    `;

    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.query(query, { $nodeId: nodeId, $tenantId: tenantId });
      return res.getJson();
    } finally {
      await txn.discard();
    }
  }

  /**
   * Consultar qué depende de un nodo (hacia arriba)
   */
  async getImpactAnalysis(nodeId: string, tenantId: string, depth = 3): Promise<any> {
    const query = `
      query impactAnalysis($nodeId: string, $tenantId: string) {
        node(func: eq(id, $nodeId)) @filter(eq(tenantId, $tenantId)) {
          id
          name
          nodeType
          requiredBy @recurse(depth: ${depth}) {
            id
            name
            nodeType
            criticality
          }
        }
      }
    `;

    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.query(query, { $nodeId: nodeId, $tenantId: tenantId });
      return res.getJson();
    } finally {
      await txn.discard();
    }
  }

  /**
   * Encontrar puntos únicos de fallo (Single Points of Failure)
   */
  async findSinglePointsOfFailure(tenantId: string): Promise<any> {
    const query = `
      query spof($tenantId: string) {
        spof(func: has(requiredBy)) @filter(eq(tenantId, $tenantId)) {
          id
          name
          nodeType
          criticality
          requiredByCount: count(requiredBy)
          requiredBy {
            id
            name
            criticality
          }
        }
      }
    `;

    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.query(query, { $tenantId: tenantId });
      const data = res.getJson();
      
      // Filtrar nodos con múltiples dependientes críticos
      return data.spof?.filter((node: any) => node.requiredByCount >= 2) || [];
    } finally {
      await txn.discard();
    }
  }

  /**
   * Obtener el grafo completo para visualización
   */
  async getGraphVisualization(tenantId: string): Promise<any> {
    const query = `
      query graph($tenantId: string) {
        nodes(func: has(nodeType)) @filter(eq(tenantId, $tenantId)) {
          id
          name
          nodeType
          criticality
          dependsOn {
            id
            name
            nodeType
          }
        }
      }
    `;

    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.query(query, { $tenantId: tenantId });
      return res.getJson();
    } finally {
      await txn.discard();
    }
  }

  /**
   * Eliminar un nodo del grafo
   */
  async deleteNode(nodeId: string) {
    const txn = this.dgraphClient.newTxn();
    try {
      const mu = new dgraph.Mutation();
      mu.setDeleteJson({ uid: nodeId });
      await txn.mutate(mu);
      await txn.commit();
      
      this.logger.log(`✅ Node deleted: ${nodeId}`);
    } catch (error) {
      this.logger.error('Error deleting node', error);
      throw error;
    } finally {
      await txn.discard();
    }
  }

  /**
   * Ejecutar una consulta personalizada
   */
  async query(query: string, vars?: Record<string, any>): Promise<any> {
    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.query(query, vars);
      return res.getJson();
    } finally {
      await txn.discard();
    }
  }

  /**
   * Cerrar la conexión con Dgraph
   */
  async onModuleDestroy() {
    if (this.dgraphClientStub) {
      this.dgraphClientStub.close();
      this.logger.log('🔌 Dgraph connection closed');
    }
  }
}
