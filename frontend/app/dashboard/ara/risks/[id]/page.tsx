'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import MonteCarloSimulation from '@/components/risk/MonteCarloSimulation';

export default function RiskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [risk, setRisk] = useState<any>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'montecarlo'>('details');

  useEffect(() => {
    if (params.id) {
      fetchRiskDetail();
    }
  }, [params.id]);

  const fetchRiskDetail = async () => {
    try {
      const [riskRes, controlsRes] = await Promise.all([
        fetch(`/api/risk-assessments/${params.id}`),
        fetch(`/api/risk-controls/risk/${params.id}`)
      ]);

      if (riskRes.ok) setRisk(await riskRes.json());
      if (controlsRes.ok) setControls(await controlsRes.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!risk) return <div>Riesgo no encontrado</div>;

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (score >= 9) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/ara/risks"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Riesgos
        </Link>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              Detalles del Riesgo
            </button>
            <button
              onClick={() => setActiveTab('montecarlo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'montecarlo'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Simulación Montecarlo
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{risk.riskId}</span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{risk.name}</h1>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {risk.category}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300">{risk.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Causa:</span>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{risk.cause || 'No especificada'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Evento:</span>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{risk.event || 'No especificado'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Consecuencia:</span>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{risk.consequence || 'No especificada'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">Riesgo Inherente</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Probabilidad:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{risk.probability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Impacto:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{risk.impact}</span>
                    </div>
                    <div className="border-t border-red-200 dark:border-red-800 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Score:</span>
                        <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRiskColor(risk.scoreBefore)}`}>
                          {risk.scoreBefore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {risk.scoreAfter && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Riesgo Residual</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Después de controles</span>
                      </div>
                      <div className="border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">Score:</span>
                          <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRiskColor(risk.scoreAfter)}`}>
                            {risk.scoreAfter.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {risk.scoreBefore > risk.scoreAfter && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                          Reducción: {(((risk.scoreBefore - risk.scoreAfter) / risk.scoreBefore) * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Controles Aplicados ({controls.length})</h3>
                <div className="space-y-3">
                  {controls.map((control) => (
                    <div key={control.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">{control.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                          {control.type}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded font-semibold">
                          {control.effectiveness}% efectividad
                        </span>
                      </div>
                    </div>
                  ))}

                  {controls.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hay controles registrados</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'montecarlo' && (
            <MonteCarloSimulation
              riskId={risk.riskId}
              riskName={risk.name}
              baseImpact={risk.impact}
              baseProbability={risk.probability}
            />
          )}
        </div>
      </div>
    </div>
  );
}
