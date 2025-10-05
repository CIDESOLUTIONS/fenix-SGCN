'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Target, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface RiskStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgScoreBefore: number;
  avgScoreAfter: number;
  withTreatment: number;
  reduction: number;
}

interface RiskAssessment {
  id: string;
  name: string;
  category: string;
  scoreBefore: number;
  scoreAfter: number;
  createdAt: string;
}

export default function ARADashboard() {
  const [stats, setStats] = useState<RiskStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    avgScoreBefore: 0,
    avgScoreAfter: 0,
    withTreatment: 0,
    reduction: 0,
  });
  const [recentRisks, setRecentRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/risk-assessments');
      if (response.ok) {
        const risks: RiskAssessment[] = await response.json();
        
        // Calcular estadísticas
        const total = risks.length;
        const critical = risks.filter(r => r.scoreBefore >= 15).length;
        const high = risks.filter(r => r.scoreBefore >= 9 && r.scoreBefore < 15).length;
        const medium = risks.filter(r => r.scoreBefore >= 5 && r.scoreBefore < 9).length;
        const low = risks.filter(r => r.scoreBefore < 5).length;
        
        const avgScoreBefore = total > 0 
          ? risks.reduce((acc, r) => acc + r.scoreBefore, 0) / total 
          : 0;
        const avgScoreAfter = total > 0 
          ? risks.reduce((acc, r) => acc + r.scoreAfter, 0) / total 
          : 0;
        
        const reduction = avgScoreBefore > 0 
          ? ((avgScoreBefore - avgScoreAfter) / avgScoreBefore) * 100 
          : 0;

        setStats({
          total,
          critical,
          high,
          medium,
          low,
          avgScoreBefore,
          avgScoreAfter,
          withTreatment: 0,
          reduction,
        });

        // Últimos 5 riesgos
        setRecentRisks(risks.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 15) return 'text-red-600';
    if (score >= 9) return 'text-orange-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Riesgos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="text-red-600">● {stats.critical} Críticos</span>
            <span className="text-orange-600">● {stats.high} Altos</span>
            <span className="text-yellow-600">● {stats.medium} Medios</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Score Promedio Inicial</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgScoreBefore.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Sin controles aplicados
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Score Promedio Residual</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.avgScoreAfter.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Con controles aplicados
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Reducción de Riesgo</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.reduction.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Efectividad de controles
          </p>
        </div>
      </div>

      {/* Distribución de Riesgos y Flujo Recomendado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Severidad */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-indigo-600" />
            Distribución por Severidad
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Riesgos Críticos</span>
                <span className="text-sm font-bold text-red-600">{stats.critical}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.critical / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Riesgos Altos</span>
                <span className="text-sm font-bold text-orange-600">{stats.high}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Riesgos Medios</span>
                <span className="text-sm font-bold text-yellow-600">{stats.medium}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Riesgos Bajos</span>
                <span className="text-sm font-bold text-green-600">{stats.low}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.low / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flujo Recomendado */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow border border-indigo-200 p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            Flujo Recomendado
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Identifique riesgos</p>
                <p className="text-sm text-gray-600">Registre riesgos que puedan interrumpir actividades críticas</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Evalúe con Montecarlo</p>
                <p className="text-sm text-gray-600">Simule escenarios probabilísticos para análisis cuantitativo</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Visualice en Matriz</p>
                <p className="text-sm text-gray-600">Analice probabilidad vs impacto en mapa de calor</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Defina tratamientos</p>
                <p className="text-sm text-gray-600">Establezca estrategias de mitigación y controles</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm text-indigo-900 font-medium">
                Siguiente paso: 
                <Link href="/dashboard/analisis-impacto" className="ml-1 underline hover:text-indigo-700">
                  Módulo 3: Análisis de Impacto (BIA) →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Riesgos Recientes */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Riesgos Recientes
          </h3>
          <Link
            href="/dashboard/ara/risks"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {recentRisks.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No hay riesgos registrados aún</p>
            <Link
              href="/dashboard/ara/risks"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Registrar primer riesgo →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRisks.map((risk) => (
              <div
                key={risk.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{risk.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{risk.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${getRiskLevelColor(risk.scoreBefore)}`}>
                      {risk.scoreBefore.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Inicial</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${getRiskLevelColor(risk.scoreAfter)}`}>
                      {risk.scoreAfter.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Residual</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
