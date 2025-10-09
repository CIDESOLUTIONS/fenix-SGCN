'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calculator, Info } from 'lucide-react';
import Link from 'next/link';

interface RiskAssessment {
  id: string;
  riskId: string;
  name: string;
  category: string;
  probability: number;
  impact: number;
  scoreBefore: number;
  scoreAfter: number;
  process?: {
    id: string;
    name: string;
  };
}

export default function QualitativeEvaluationPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'inherent' | 'residual'>('inherent');

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await fetch('/api/risk-assessments');
      if (response.ok) {
        const data = await response.json();
        setRisks(data);
      }
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number): string => {
    if (score >= 15) return 'Crítico';
    if (score >= 9) return 'Alto';
    if (score >= 5) return 'Medio';
    return 'Bajo';
  };

  const getRiskColor = (score: number): string => {
    if (score >= 15) return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
    if (score >= 9) return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
    return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
  };

  const currentScore = viewMode === 'inherent' ? 'scoreBefore' : 'scoreAfter';
  const sortedRisks = [...risks].sort((a, b) => b[currentScore] - a[currentScore]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con selector de vista */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Evaluación Cualitativa de Riesgos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Análisis basado en matriz probabilidad × impacto según ISO 31000
            </p>
          </div>

          {/* Selector de vista */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('inherent')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'inherent'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Riesgo Inherente
            </button>
            <button
              onClick={() => setViewMode('residual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'residual'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-1" />
              Riesgo Residual
            </button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {viewMode === 'inherent' ? 'Riesgo Inherente' : 'Riesgo Residual'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {viewMode === 'inherent'
                ? 'Nivel de riesgo antes de aplicar controles de mitigación. Representa la exposición natural de la organización.'
                : 'Nivel de riesgo después de implementar controles. Muestra la exposición efectiva tras las medidas de mitigación.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de riesgos */}
      {sortedRisks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay riesgos registrados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comience registrando riesgos para realizar la evaluación cualitativa
          </p>
          <Link
            href="/dashboard/ara/risks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ir a Registro de Riesgos
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Riesgo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Probabilidad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Impacto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Puntuación
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nivel
                  </th>
                  {viewMode === 'residual' && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reducción
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedRisks.map((risk) => {
                  const score = viewMode === 'inherent' ? risk.scoreBefore : risk.scoreAfter;
                  const reduction = risk.scoreBefore > 0 
                    ? ((risk.scoreBefore - risk.scoreAfter) / risk.scoreBefore * 100)
                    : 0;

                  return (
                    <tr key={risk.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                        {risk.riskId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {risk.name}
                        </div>
                        {risk.process && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {risk.process.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {risk.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 font-semibold text-sm">
                          {risk.probability}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-semibold text-sm">
                          {risk.impact}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calculator className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-900 dark:text-white text-lg">
                            {score.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(score)}`}>
                          {getRiskLevel(score)}
                        </span>
                      </td>
                      {viewMode === 'residual' && (
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {reduction > 0 ? (
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              ↓ {reduction.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-600">
                              Sin tratamiento
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Niveles de Riesgo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700"></div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Crítico</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">≥ 15</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700"></div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Alto</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">9-14</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700"></div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Medio</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">5-8</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"></div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Bajo</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">&lt; 5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
