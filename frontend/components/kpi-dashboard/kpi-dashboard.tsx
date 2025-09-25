'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface KPIData {
  findingResolutionRate: number;
  avgActionClosureTime: number;
  exerciseSuccessRate: number;
  biaCoverage: {
    coveragePercentage: number;
    assessedProcesses: number;
    totalProcesses: number;
  };
  planUpdateRate: number;
  findingsBySource: Record<string, number>;
  improvementTrend: {
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    data: Array<{ month: string; resolvedFindings: number }>;
  };
}

interface KPIDashboardProps {
  kpiData: KPIData;
  trendData?: Array<{
    month: string;
    newFindings: number;
    resolvedFindings: number;
    completedActions: number;
    exercisesPerformed: number;
  }>;
}

export function KPIDashboard({ kpiData, trendData = [] }: KPIDashboardProps) {
  const getTrendIcon = (trend: string) => {
    if (trend === 'IMPROVING') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === 'DECLINING') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getKPIColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tasa de Resolución */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-600">Tasa de Resolución</span>
            </div>
            {getTrendIcon(kpiData.improvementTrend.trend)}
          </div>
          <div className={`text-4xl font-bold ${getKPIColor(kpiData.findingResolutionRate)}`}>
            {kpiData.findingResolutionRate}%
          </div>
          <p className="text-xs text-gray-500 mt-2">Hallazgos resueltos</p>
        </div>

        {/* KPI 2: Tiempo de Cierre */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-600">Tiempo de Cierre</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {kpiData.avgActionClosureTime}
          </div>
          <p className="text-xs text-gray-500 mt-2">Días promedio</p>
        </div>

        {/* KPI 3: Éxito de Ejercicios */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-gray-600">Éxito de Ejercicios</span>
          </div>
          <div className={`text-4xl font-bold ${getKPIColor(kpiData.exerciseSuccessRate)}`}>
            {kpiData.exerciseSuccessRate}%
          </div>
          <p className="text-xs text-gray-500 mt-2">Ejercicios exitosos</p>
        </div>

        {/* KPI 4: Cobertura BIA */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-gray-600">Cobertura BIA</span>
          </div>
          <div className={`text-4xl font-bold ${getKPIColor(kpiData.biaCoverage.coveragePercentage, 100)}`}>
            {kpiData.biaCoverage.coveragePercentage}%
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {kpiData.biaCoverage.assessedProcesses} de {kpiData.biaCoverage.totalProcesses} procesos
          </p>
        </div>
      </div>

      {/* Gráfico de Tendencias */}
      {trendData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tendencias de Mejora (Últimos 12 Meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="newFindings"
                stroke="#ef4444"
                name="Nuevos Hallazgos"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="resolvedFindings"
                stroke="#10b981"
                name="Hallazgos Resueltos"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completedActions"
                stroke="#3b82f6"
                name="Acciones Completadas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="exercisesPerformed"
                stroke="#8b5cf6"
                name="Ejercicios Realizados"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hallazgos por Fuente */}
      {Object.keys(kpiData.findingsBySource).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Hallazgos por Fuente</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={Object.entries(kpiData.findingsBySource).map(([source, count]) => ({
                source,
                count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Actualización de Planes</h4>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${getKPIColor(kpiData.planUpdateRate, 80)}`}>
              {kpiData.planUpdateRate}%
            </div>
            <span className="text-xs text-gray-500">Últimos 6 meses</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Estado del Programa</h4>
          <div className="flex items-center gap-2">
            {kpiData.improvementTrend.trend === 'IMPROVING' && (
              <>
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-green-600 font-semibold">Mejorando</span>
              </>
            )}
            {kpiData.improvementTrend.trend === 'DECLINING' && (
              <>
                <TrendingDown className="w-6 h-6 text-red-500" />
                <span className="text-red-600 font-semibold">Declinando</span>
              </>
            )}
            {kpiData.improvementTrend.trend === 'STABLE' && (
              <>
                <Minus className="w-6 h-6 text-gray-500" />
                <span className="text-gray-600 font-semibold">Estable</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Eficiencia General</h4>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(
              (kpiData.findingResolutionRate +
                kpiData.exerciseSuccessRate +
                kpiData.biaCoverage.coveragePercentage +
                kpiData.planUpdateRate) /
                4
            )}
            %
          </div>
          <p className="text-xs text-gray-500 mt-1">Promedio de KPIs</p>
        </div>
      </div>

      {/* Indicadores de Alerta */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Áreas de Atención</h4>
        <ul className="space-y-1 text-sm text-yellow-700">
          {kpiData.findingResolutionRate < 80 && (
            <li>• Tasa de resolución por debajo del objetivo (80%)</li>
          )}
          {kpiData.exerciseSuccessRate < 80 && (
            <li>• Tasa de éxito de ejercicios requiere mejora</li>
          )}
          {kpiData.biaCoverage.coveragePercentage < 100 && (
            <li>
              • Completar BIA para {100 - kpiData.biaCoverage.coveragePercentage}% de procesos
              faltantes
            </li>
          )}
          {kpiData.planUpdateRate < 80 && (
            <li>• Actualizar planes desactualizados (objetivo: 80%)</li>
          )}
          {kpiData.avgActionClosureTime > 45 && (
            <li>• Reducir tiempo de cierre de acciones (actual: {kpiData.avgActionClosureTime} días)</li>
          )}
        </ul>
      </div>
    </div>
  );
}
