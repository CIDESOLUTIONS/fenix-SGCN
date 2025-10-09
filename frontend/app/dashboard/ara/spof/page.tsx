'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Network, TrendingUp, Info, Shield } from 'lucide-react';

interface SPOFAsset {
  id: string;
  name: string;
  nodeType: string;
  criticality: string;
  requiredByCount: number;
  riskCount: number;
  highestRisk: number;
  relatedRisks: Array<{
    id: string;
    riskId: string;
    name: string;
    score: number;
  }>;
  requiredBy: Array<{
    id: string;
    name: string;
    criticality: string;
  }>;
}

interface SPOFAnalysis {
  summary: {
    totalSPOFs: number;
    criticalSPOFs: number;
    highRiskSPOFs: number;
    spofRiskLevel: string;
  };
  criticalAssets: SPOFAsset[];
  recommendations: string[];
}

export default function SPOFAnalysisPage() {
  const [analysis, setAnalysis] = useState<SPOFAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  useEffect(() => {
    fetchSPOFAnalysis();
  }, []);

  const fetchSPOFAnalysis = async () => {
    try {
      const response = await fetch('/api/risk-assessments/spof-analysis');
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching SPOF analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'text-red-600 bg-red-50 border-red-300 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700';
    if (score >= 9) return 'text-orange-600 bg-orange-50 border-orange-300 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-700';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-700';
    return 'text-green-600 bg-green-50 border-green-300 dark:text-green-400 dark:bg-green-900/20 dark:border-green-700';
  };

  const getCriticalityColor = (criticality: string) => {
    if (criticality === 'CRITICAL') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (criticality === 'HIGH') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No se pudo cargar el análisis SPOF</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              Análisis de Puntos Únicos de Fallo (SPOF)
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Identifica activos críticos cuya falla afectaría múltiples procesos. 
              Utiliza análisis de grafos de Dgraph para mapear dependencias complejas.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.summary.totalSPOFs}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total SPOF</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.summary.criticalSPOFs}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Críticos</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.summary.highRiskSPOFs}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alto Riesgo</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className={`text-2xl font-bold ${
                analysis.summary.spofRiskLevel === 'HIGH' ? 'text-red-600 dark:text-red-400' :
                analysis.summary.spofRiskLevel === 'MEDIUM' ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {analysis.summary.spofRiskLevel}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nivel Global</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recomendaciones
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lista de activos críticos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activos Críticos Identificados
        </h3>

        {analysis.criticalAssets.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No se detectaron SPOF críticos</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              La arquitectura actual tiene buena redundancia
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysis.criticalAssets.map((asset) => (
              <div
                key={asset.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {asset.name}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCriticalityColor(asset.criticality)}`}>
                        {asset.criticality}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs">
                        {asset.nodeType}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Procesos Dependientes:</span>
                        <span className="font-semibold text-gray-900 dark:text-white ml-2">
                          {asset.requiredByCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Riesgos Asociados:</span>
                        <span className="font-semibold text-gray-900 dark:text-white ml-2">
                          {asset.riskCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Mayor Riesgo:</span>
                        <span className={`font-bold ml-2 px-2 py-1 rounded text-xs ${getRiskColor(asset.highestRisk)}`}>
                          {asset.highestRisk.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {asset.relatedRisks.length > 0 && (
                      <button
                        onClick={() => setExpandedAsset(expandedAsset === asset.id ? null : asset.id)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {expandedAsset === asset.id ? 'Ocultar detalles' : 'Ver riesgos y dependencias'}
                      </button>
                    )}

                    {expandedAsset === asset.id && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Riesgos Relacionados:</h5>
                          <div className="space-y-2">
                            {asset.relatedRisks.map(risk => (
                              <div key={risk.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-sm">
                                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{risk.riskId}</span>
                                  {' - '}
                                  {risk.name}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(risk.score)}`}>
                                  {risk.score.toFixed(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {asset.requiredBy && asset.requiredBy.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Procesos que Dependen:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {asset.requiredBy.map(proc => (
                                <div key={proc.id} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                                  {proc.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
