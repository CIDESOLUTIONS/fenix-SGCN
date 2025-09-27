import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgraph from 'dgraph-js';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class DgraphService implements OnModuleInit {
  private readonly logger = new Logger(DgraphService.name);
  private dgraphClient: dgraph.DgraphClient;
  private dgraphClientStub: dgraph.DgraphClientStub;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.initializeClient();
      await this.setupSchema();
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        throw error;
      }
      this.logger.warn('⚠️ Dgraph no disponible (modo test)');
    }
  }

  private async initializeClient() {
    try {
      const dgraphGrpcUrl = this.configService.get<string>('DGRAPH_GRPC_URL', 'localhost:9080');
      
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

  private async setupSchema() {
    const schema = `
      id: string @index(exact) .
      name: string @index(fulltext) .
      nodeType: string @index(exact) .
      criticality: string @index(exact) .
      status: string @index(exact) .
      tenantId: string @index(exact) .
      email: string @index(exact) .
      fullName: string .
      type: string @index(exact) .
      impact: string @index(exact) .
      likelihood: string @index(exact) .
      rto: int .
      rpo: int .
      
      dependsOn: [uid] @reverse .
      requiredBy: [uid] @reverse .
      ownedBy: uid @reverse .
      hasPlan: uid @reverse .
      hasRisks: [uid] @reverse .
      supports: [uid] @reverse .
      affects: [uid] @reverse .
      mitigatedBy: [uid] @reverse .
      protects: [uid] @reverse .
      owns: [uid] @reverse .
      mitigates: [uid] @reverse .
    `;

    try {
      const op = new dgraph.Operation();
      op.setSchema(schema);
      await this.dgraphClient.alter(op);
      this.logger.log('✅ Dgraph schema initialized');
    } catch (error) {
      this.logger.error('❌ Failed to setup Dgraph schema', error);
    }
  }

  async upsertNode(nodeType: string, data: any, tenantId: string) {
    if (!this.dgraphClient) return null;
    
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
      return null;
    } finally {
      await txn.discard();
    }
  }

  async createRelationship(sourceId: string, targetId: string, relationshipType: string, tenantId: string) {
    if (!this.dgraphClient) return;
    
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

      this.logger.log(`✅ Relationship: ${sourceId} --[${relationshipType}]--> ${targetId}`);
    } catch (error) {
      this.logger.error('Error creating relationship', error);
    } finally {
      await txn.discard();
    }
  }

  async getDependencies(nodeId: string, tenantId: string, depth = 3): Promise<any> {
    if (!this.dgraphClient) return { node: [] };
    
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
      const res = await txn.queryWithVars(query, { $nodeId: nodeId, $tenantId: tenantId });
      return res.getJson();
    } catch (error) {
      this.logger.error('Error getDependencies', error);
      return { node: [] };
    } finally {
      await txn.discard();
    }
  }

  async getImpactAnalysis(nodeId: string, tenantId: string, depth = 3): Promise<any> {
    if (!this.dgraphClient) return { node: [] };
    
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
      const res = await txn.queryWithVars(query, { $nodeId: nodeId, $tenantId: tenantId });
      return res.getJson();
    } catch (error) {
      this.logger.error('Error getImpactAnalysis', error);
      return { node: [] };
    } finally {
      await txn.discard();
    }
  }

  async findSinglePointsOfFailure(tenantId: string): Promise<any> {
    if (!this.dgraphClient) return [];
    
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
      const res = await txn.queryWithVars(query, { $tenantId: tenantId });
      const data = res.getJson();
      return data.spof?.filter((node: any) => node.requiredByCount >= 2) || [];
    } catch (error) {
      return [];
    } finally {
      await txn.discard();
    }
  }

  async getGraphVisualization(tenantId: string): Promise<any> {
    if (!this.dgraphClient) return { nodes: [] };
    
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
      const res = await txn.queryWithVars(query, { $tenantId: tenantId });
      return res.getJson();
    } catch (error) {
      return { nodes: [] };
    } finally {
      await txn.discard();
    }
  }

  async deleteNode(nodeId: string) {
    if (!this.dgraphClient) return;
    
    const txn = this.dgraphClient.newTxn();
    try {
      const mu = new dgraph.Mutation();
      mu.setDeleteJson({ uid: nodeId });
      await txn.mutate(mu);
      await txn.commit();
      
      this.logger.log(`✅ Node deleted: ${nodeId}`);
    } catch (error) {
      this.logger.error('Error deleting node', error);
    } finally {
      await txn.discard();
    }
  }

  async query(query: string, vars?: Record<string, any>): Promise<any> {
    if (!this.dgraphClient) return {};
    
    const txn = this.dgraphClient.newTxn({ readOnly: true });
    try {
      const res = await txn.queryWithVars(query, vars || {});
      return res.getJson();
    } catch (error) {
      return {};
    } finally {
      await txn.discard();
    }
  }

  async analyzeSPOF(tenantId: string) {
    const spofs = await this.findSinglePointsOfFailure(tenantId);
    return {
      criticalAssets: spofs,
      spofRisk: spofs.length > 0 ? 'HIGH' : 'LOW',
      totalSPOFs: spofs.length,
    };
  }

  async calculateImpact(assetId: string, failureType: string, tenantId: string) {
    const impact = await this.getImpactAnalysis(assetId, tenantId);
    const affectedProcesses = impact.node?.[0]?.requiredBy || [];
    
    return {
      affectedProcesses,
      totalImpact: affectedProcesses.length,
      failureType,
    };
  }

  async getUpstreamDependencies(processId: string, tenantId: string) {
    const deps = await this.getDependencies(processId, tenantId);
    return {
      dependencies: deps.node?.[0]?.dependsOn || [],
    };
  }

  async getDownstreamDependencies(assetId: string, tenantId: string) {
    const impact = await this.getImpactAnalysis(assetId, tenantId);
    return {
      impactedProcesses: impact.node?.[0]?.requiredBy || [],
    };
  }

  async calculateCriticalityCascade(startNodeId: string, tenantId: string) {
    const deps = await this.getDependencies(startNodeId, tenantId);
    const criticalityMap = {};
    const highRiskPaths = [];

    return {
      criticalityMap,
      highRiskPaths,
    };
  }

  async onModuleDestroy() {
    if (this.dgraphClientStub) {
      this.dgraphClientStub.close();
      this.logger.log('🔌 Dgraph connection closed');
    }
  }
}
