import { Injectable, Logger } from '@nestjs/common';
import { DgraphService } from '../dgraph/dgraph.service';

export enum WidgetType {
  KPI_CARD = 'KPI_CARD',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  LINE_CHART = 'LINE_CHART',
  HEATMAP = 'HEATMAP',
  TABLE = 'TABLE',
  RISK_MATRIX = 'RISK_MATRIX',
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  query: string;
  config?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  role?: string;
  tenantId: string;
  widgets: Widget[];
  layout?: Record<string, any>;
}

@Injectable()
export class BIDashboardService {
  private readonly logger = new Logger(BIDashboardService.name);

  constructor(private dgraphService: DgraphService) {}

  /**
   * Crear un dashboard personalizado
   */
  async createDashboard(dashboard: Omit<Dashboard, 'id'>): Promise<Dashboard> {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.logger.log(`Dashboard created: ${newDashboard.name}`);
    return newDashboard;
  }

  /**
   * Obtener KPIs del SGCN
   */
  async getSGCNKPIs(tenantId: string): Promise<any> {
    const query = `
      query kpis($tenantId: string) {
        totalProcesses: count(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId))
        criticalProcesses: count(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId) AND eq(criticality, "CRITICAL"))
        totalRisks: count(func: type(Risk)) @filter(eq(tenantId, $tenantId))
        highRisks: count(func: type(Risk)) @filter(eq(tenantId, $tenantId) AND eq(impact, "HIGH"))
        totalPlans: count(func: type(ContinuityPlan)) @filter(eq(tenantId, $tenantId))
        activePlans: count(func: type(ContinuityPlan)) @filter(eq(tenantId, $tenantId) AND eq(status, "ACTIVE"))
      }
    `;

    return this.dgraphService.query(query, { $tenantId: tenantId });
  }

  /**
   * Dashboard para CISO / Gestor del SGCN
   */
  async getCISODashboard(tenantId: string): Promise<Dashboard> {
    return {
      id: 'ciso_dashboard',
      name: 'Dashboard del CISO',
      role: 'CISO',
      tenantId,
      widgets: [
        {
          id: 'kpi_critical_processes',
          type: WidgetType.KPI_CARD,
          title: 'Procesos Críticos',
          query: 'criticalProcesses',
        },
        {
          id: 'kpi_high_risks',
          type: WidgetType.KPI_CARD,
          title: 'Riesgos Altos',
          query: 'highRisks',
        },
        {
          id: 'risk_heatmap',
          type: WidgetType.HEATMAP,
          title: 'Mapa de Calor de Riesgos',
          query: 'riskMatrix',
        },
        {
          id: 'plan_status',
          type: WidgetType.PIE_CHART,
          title: 'Estado de Planes',
          query: 'planStatus',
        },
      ],
    };
  }

  /**
   * Dashboard para Propietario de Proceso
   */
  async getProcessOwnerDashboard(tenantId: string, userId: string): Promise<Dashboard> {
    return {
      id: 'process_owner_dashboard',
      name: 'Dashboard del Propietario de Proceso',
      tenantId,
      widgets: [
        {
          id: 'my_processes',
          type: WidgetType.TABLE,
          title: 'Mis Procesos',
          query: `
            query myProcesses($tenantId: string, $userId: string) {
              processes(func: type(BusinessProcess)) @filter(eq(tenantId, $tenantId)) {
                id
                name
                criticality
                rto
                rpo
                ownedBy @filter(eq(id, $userId)) {
                  id
                }
              }
            }
          `,
        },
        {
          id: 'my_risks',
          type: WidgetType.BAR_CHART,
          title: 'Riesgos de mis Procesos',
          query: 'myRisks',
        },
      ],
    };
  }

  /**
   * Obtener datos para un widget específico
   */
  async getWidgetData(widgetId: string, tenantId: string, params?: any): Promise<any> {
    // Lógica para obtener datos según el tipo de widget
    this.logger.log(`Fetching data for widget: ${widgetId}`);
    
    // Placeholder: implementar consultas específicas por widget
    return { data: [], message: 'Widget data placeholder' };
  }

  /**
   * Mapa de calor de riesgos
   */
  async getRiskHeatmap(tenantId: string): Promise<any> {
    const query = `
      query riskMatrix($tenantId: string) {
        risks(func: type(Risk)) @filter(eq(tenantId, $tenantId)) {
          id
          name
          impact
          likelihood
          affects {
            id
            name
          }
        }
      }
    `;

    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    // Transformar a formato de mapa de calor
    const heatmap = this.transformToHeatmap(result.risks || []);
    return heatmap;
  }

  private transformToHeatmap(risks: any[]): any {
    const matrix = {
      HIGH_HIGH: [],
      HIGH_MEDIUM: [],
      HIGH_LOW: [],
      MEDIUM_HIGH: [],
      MEDIUM_MEDIUM: [],
      MEDIUM_LOW: [],
      LOW_HIGH: [],
      LOW_MEDIUM: [],
      LOW_LOW: [],
    };

    risks.forEach(risk => {
      const key = `${risk.impact}_${risk.likelihood}`;
      if (matrix[key]) {
        matrix[key].push(risk);
      }
    });

    return matrix;
  }

  /**
   * Estado de planes de continuidad
   */
  async getPlanStatusChart(tenantId: string): Promise<any> {
    const query = `
      query planStatus($tenantId: string) {
        plans(func: type(ContinuityPlan)) @filter(eq(tenantId, $tenantId)) {
          status
        }
      }
    `;

    const result = await this.dgraphService.query(query, { $tenantId: tenantId });
    
    // Agrupar por estado
    const statusCount = {};
    result.plans?.forEach(plan => {
      statusCount[plan.status] = (statusCount[plan.status] || 0) + 1;
    });

    return statusCount;
  }
}
