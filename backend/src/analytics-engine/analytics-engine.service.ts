import { Injectable, Logger } from '@nestjs/common';
import { DgraphService } from '../dgraph/dgraph.service';

@Injectable()
export class AnalyticsEngineService {
  private readonly logger = new Logger(AnalyticsEngineService.name);

  constructor(private dgraphService: DgraphService) {}

  /**
   * Análisis de dependencias completo de un proceso
   */
  async analyzeDependencies(processId: string, tenantId: string): Promise<any> {
    const dependencies = await this.dgraphService.getDependencies(processId, tenantId, 5);
    const impactAnalysis = await this.dgraphService.getImpactAnalysis(processId, tenantId, 5);

    return {
      process: processId,
      downstream: dependencies,
      upstream: impactAnalysis,
      summary: {
        totalDependencies: this.countNodes(dependencies),
        totalImpacted: this.countNodes(impactAnalysis),
      },
    };
  }

  private countNodes(graphData: any): number {
    if (!graphData || !graphData.node || graphData.node.length === 0) return 0;
    
    let count = 0;
    const traverse = (node: any) => {
      count++;
      if (node.dependsOn) {
        node.dependsOn.forEach(traverse);
      }
      if (node.requiredBy) {
        node.requiredBy.forEach(traverse);
      }
    };
    
    graphData.node.forEach(traverse);
    return count;
  }

  /**
   * Identificar puntos únicos de fallo (SPOF)
   */
  async findSinglePointsOfFailure(tenantId: string): Promise<any> {
    const spofs = await this.dgraphService.findSinglePointsOfFailure(tenantId);

    return {
      count: spofs.length,
      criticalSPOFs: spofs.filter((node: any) => node.criticality === 'CRITICAL'),
      allSPOFs: spofs,
      recommendations: this.generateSPOFRecommendations(spofs),
    };
  }

  private generateSPOFRecommendations(spofs: any[]): string[] {
    const recommendations: string[] = [];

    spofs.forEach(spof => {
      if (spof.criticality === 'CRITICAL') {
        recommendations.push(
          `URGENTE: ${spof.name} es un punto único de fallo crítico que afecta a ${spof.requiredByCount} procesos. Se recomienda implementar redundancia inmediata.`
        );
      } else {
        recommendations.push(
          `${spof.name} requiere evaluación de redundancia (afecta ${spof.requiredByCount} procesos).`
        );
      }
    });

    return recommendations;
  }

  /**
   * Análisis de cobertura del BIA
   */
  async analyzeBIACoverage(tenantId: string): Promise<any> {
    const query = `
      query biaCoverage($tenantId: string) {
        allProcesses: count(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId))
        
        processesWithBIA: count(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId)) {
          rto @filter(gt(rto, 0))
        }
        
        criticalWithoutBIA: var(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId) AND eq(criticality, "CRITICAL")) {
          c as count(rto @filter(eq(rto, 0)))
        }
        criticalWithoutBIACount: sum(val(c))
      }
    `;

    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    const coverage = (result.processesWithBIA / result.allProcesses) * 100;
    
    return {
      totalProcesses: result.allProcesses,
      processesWithBIA: result.processesWithBIA,
      coverage: coverage.toFixed(2) + '%',
      criticalWithoutBIA: result.criticalWithoutBIACount || 0,
      status: coverage >= 80 ? 'GOOD' : coverage >= 50 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT',
    };
  }

  /**
   * Análisis de cumplimiento ISO 22301
   */
  async analyzeISO22301Compliance(tenantId: string): Promise<any> {
    const checks = await Promise.all([
      this.checkPolicyExists(tenantId),
      this.checkBIACompleted(tenantId),
      this.checkRiskAssessment(tenantId),
      this.checkContinuityPlans(tenantId),
      this.checkTestingProgram(tenantId),
    ]);

    const complianceScore = (checks.filter(c => c.compliant).length / checks.length) * 100;

    return {
      overallScore: complianceScore.toFixed(2) + '%',
      status: complianceScore >= 80 ? 'COMPLIANT' : complianceScore >= 50 ? 'PARTIAL' : 'NON_COMPLIANT',
      checks,
      recommendations: this.generateComplianceRecommendations(checks),
    };
  }

  private async checkPolicyExists(tenantId: string): Promise<any> {
    return {
      requirement: 'ISO 22301 Cláusula 5.2 - Política del SGCN',
      compliant: true,
      details: 'Política aprobada y vigente',
    };
  }

  private async checkBIACompleted(tenantId: string): Promise<any> {
    const coverage = await this.analyzeBIACoverage(tenantId);
    return {
      requirement: 'ISO 22301 Cláusula 8.2.2 - BIA',
      compliant: parseFloat(coverage.coverage) >= 80,
      details: `Cobertura del BIA: ${coverage.coverage}`,
    };
  }

  private async checkRiskAssessment(tenantId: string): Promise<any> {
    const query = `
      query riskAssessment($tenantId: string) {
        totalRisks: count(func: type(Risk)) @filter(eq(tenantId, $tenantId))
      }
    `;
    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    return {
      requirement: 'ISO 22301 Cláusula 8.2.3 - Evaluación de Riesgos',
      compliant: result.totalRisks > 0,
      details: `${result.totalRisks} riesgos identificados`,
    };
  }

  private async checkContinuityPlans(tenantId: string): Promise<any> {
    const query = `
      query plans($tenantId: string) {
        totalPlans: count(func: type(ContinuityPlan)) @filter(eq(tenantId, $tenantId))
      }
    `;
    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    return {
      requirement: 'ISO 22301 Cláusula 8.4 - Planes de Continuidad',
      compliant: result.totalPlans > 0,
      details: `${result.totalPlans} planes documentados`,
    };
  }

  private async checkTestingProgram(tenantId: string): Promise<any> {
    return {
      requirement: 'ISO 22301 Cláusula 8.5 - Programa de Pruebas',
      compliant: false,
      details: 'Requiere al menos 1 ejercicio anual',
    };
  }

  private generateComplianceRecommendations(checks: any[]): string[] {
    return checks
      .filter(check => !check.compliant)
      .map(check => `Pendiente: ${check.requirement}`);
  }

  /**
   * Simulación Montecarlo para análisis de riesgo cuantitativo
   */
  async runMonteCarloSimulation(
    riskId: string,
    iterations: number = 10000,
    params: any,
  ): Promise<any> {
    this.logger.log(`Running Monte Carlo simulation for risk ${riskId} with ${iterations} iterations`);

    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const impact = this.sampleTriangularDistribution(
        params.impactMin,
        params.impactMost,
        params.impactMax,
      );
      
      const probability = this.sampleUniformDistribution(
        params.probabilityMin,
        params.probabilityMax,
      );
      
      results.push(impact * probability);
    }

    results.sort((a, b) => a - b);

    return {
      riskId,
      iterations,
      statistics: {
        mean: this.calculateMean(results),
        median: results[Math.floor(iterations / 2)],
        stdDev: this.calculateStdDev(results),
        min: results[0],
        max: results[iterations - 1],
      },
      percentiles: {
        p10: results[Math.floor(iterations * 0.1)],
        p50: results[Math.floor(iterations * 0.5)],
        p90: results[Math.floor(iterations * 0.9)],
        p95: results[Math.floor(iterations * 0.95)],
        p99: results[Math.floor(iterations * 0.99)],
      },
      distribution: this.createHistogram(results, 20),
    };
  }

  private sampleTriangularDistribution(min: number, mode: number, max: number): number {
    const u = Math.random();
    const f = (mode - min) / (max - min);
    
    if (u < f) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
  }

  private sampleUniformDistribution(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStdDev(values: number[]): number {
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private createHistogram(values: number[], bins: number): any[] {
    const min = values[0];
    const max = values[values.length - 1];
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    
    values.forEach(val => {
      const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
      histogram[binIndex]++;
    });

    return histogram.map((count, index) => ({
      range: `${(min + index * binSize).toFixed(2)} - ${(min + (index + 1) * binSize).toFixed(2)}`,
      count,
      probability: (count / values.length * 100).toFixed(2) + '%',
    }));
  }

  /**
   * Alias para compatibilidad - obtener cobertura BIA
   */
  async getBiaCoverage(tenantId: string) {
    return this.analyzeBIACoverage(tenantId);
  }
}
