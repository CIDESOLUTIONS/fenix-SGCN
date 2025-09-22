'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResilienceScore {
  processId: string;
  processName: string;
  totalRisks: number;
  criticalRisks: number;
  mitigatedRisks: number;
  resilienceScore: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ResilienceScoringPage() {
  const [scores, setScores] = useState<ResilienceScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      // Simulación de datos - reemplazar con API real
      const mockScores: ResilienceScore[] = [
        {
          processId: '1',
          processName: 'Gestión de TI',
          totalRisks: 12,
          criticalRisks: 3,
          mitigatedRisks: 7,
          resilienceScore: 68,
          trend: 'up'
        },
        {
          processId: '2',
          processName: 'Operaciones Financieras',
          totalRisks: 8,
          criticalRisks: 1,
          mitigatedRisks: 6,
          resilienceScore: 82,
          trend: 'up'
        },
        {
          processId: '3',
          processName: 'Cadena de Suministro',
          totalRisks: 15,
          criticalRisks: 5,
          mitigatedRisks: 8,
          resilienceScore: 55,
          trend: 'down'
        }
      ];
      
      setScores(mockScores);
      const avg = mockScores.reduce((acc, s) => acc + s.resilienceScore, 0) / mockScores.length;
      setOverallScore(Math.round(avg));
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Resiliencia</h1>
        <p className="text-gray-500 mt-1">Scoring y KRIs por proceso crítico</p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Score Global de Resiliencia</h2>
            <p className="text-blue-100">Promedio ponderado de todos los procesos críticos</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{overallScore}%</div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">+5% vs mes anterior</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Riesgos Totales</div>
              <div className="text-2xl font-bold">
                {scores.reduce((acc, s) => acc + s.totalRisks, 0)}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Riesgos Críticos</div>
              <div className="text-2xl font-bold text-red-600">
                {scores.reduce((acc, s) => acc + s.criticalRisks, 0)}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Riesgos Mitigados</div>
              <div className="text-2xl font-bold text-green-600">
                {scores.reduce((acc, s) => acc + s.mitigatedRisks, 0)}
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">% Mitigación</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((scores.reduce((acc, s) => acc + s.mitigatedRisks, 0) / 
                  scores.reduce((acc, s) => acc + s.totalRisks, 0)) * 100)}%
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Process Scores Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Resiliencia por Proceso</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Riesgos Totales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Críticos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitigados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Resiliencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : (
                scores.map((score) => (
                  <tr key={score.processId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {score.processName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.totalRisks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {score.criticalRisks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.mitigatedRisks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`text-lg font-bold ${getScoreColor(score.resilienceScore)}`}>
                          {score.resilienceScore}%
                        </div>
                        <div className={`ml-2 w-24 h-2 rounded-full ${getScoreBgColor(score.resilienceScore)}`}>
                          <div 
                            className={`h-full rounded-full ${
                              score.resilienceScore >= 80 ? 'bg-green-500' :
                              score.resilienceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score.resilienceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {score.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : score.trend === 'down' ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : (
                        <span className="text-gray-400">─</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
