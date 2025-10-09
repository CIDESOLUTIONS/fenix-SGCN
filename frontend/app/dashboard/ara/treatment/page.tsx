'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Target, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface RiskControl {
  id: string;
  name: string;
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
  effectiveness: number;
}

interface RiskAssessment {
  id: string;
  riskId: string;
  name: string;
  category: string;
  scoreBefore: number;
  scoreAfter: number;
  treatmentStrategy?: 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';
  controls?: RiskControl[];
}

export default function TreatmentPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [filterStrategy, setFilterStrategy] = useState<string>('ALL');

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

  const getStrategyLabel = (strategy?: string): string => {
    const labels: Record<string, string> = {
      AVOID: 'Evitar',
      MITIGATE: 'Mitigar',
      TRANSFER: 'Transferir',
      ACCEPT: 'Aceptar'
    };
    return strategy ? labels[strategy] : 'Sin estrategia';
  };

  const getStrategyColor = (strategy?: string): string => {
    const colors: Record<string, string> = {
      AVOID: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      MITIGATE: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      TRANSFER: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      ACCEPT: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    };
    return strategy ? colors[strategy] : 'bg-gray-100 text-gray-500 border-gray-300';
  };

  const getControlTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      PREVENTIVE: 'Preventivo',
      DETECTIVE: 'Detectivo',
      CORRECTIVE: 'Correctivo'
    };
    return labels[type] || type;
  };

  const getRiskColor = (score: number): string => {
    if (score >= 15) return 'text-red-600 dark:text-red-400';
    if (score >= 9) return 'text-orange-600 dark:text-orange-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const filteredRisks = filterStrategy === 'ALL' 
    ? risks 
    : risks.filter(r => r.treatmentStrategy === filterStrategy);

  const criticalRisks = risks.filter(r => r.scoreBefore >= 15);
  const withoutTreatment = risks.filter(r => !r.treatmentStrategy);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tratamiento de Riesgos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estrategias y controles para gestionar los riesgos identificados
            </p>
          </div>

          {/* Filtro de estrategia */}
          <select
            value={filterStrategy}
            onChange={(e) => setFilterStrategy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todas las estrategias</option>
            <option value="AVOID">Evitar</option>
            <option value="MITIGATE">Mitigar</option>
            <option value="TRANSFER">Transferir</option>
            <option value="ACCEPT">Aceptar</option>
          </select>
        </div>
      </div>

      {/* Resumen de tratamiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalRisks.length}</p>
              <p className="text-sm text-red-700 dark:text-red-300">Riesgos Críticos</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{withoutTreatment.length}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Sin Tratamiento</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {risks.filter(r => r.treatmentStrategy).length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">Con Estrategia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guía de estrategias */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
          Estrategias de Tratamiento según ISO 31000
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Evitar</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Eliminar la actividad que genera el riesgo
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Mitigar</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Reducir probabilidad o impacto mediante controles
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Transferir</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Compartir con terceros (seguros, outsourcing)
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Aceptar</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Asumir el riesgo residual conscientemente
            </p>
          </div>
        </div>
      </div>

      {/* Lista de riesgos */}
      {filteredRisks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay riesgos con esta estrategia
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ajuste el filtro o defina estrategias de tratamiento
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRisks.map((risk) => {
            const isExpanded = expandedRisk === risk.id;
            const reduction = risk.scoreBefore > 0
              ? ((risk.scoreBefore - risk.scoreAfter) / risk.scoreBefore * 100)
              : 0;

            return (
              <div
                key={risk.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header del riesgo */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          {risk.riskId}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {risk.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {risk.category}
                        </span>
                        
                        {risk.treatmentStrategy && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStrategyColor(risk.treatmentStrategy)}`}>
                            {getStrategyLabel(risk.treatmentStrategy)}
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getRiskColor(risk.scoreBefore)}`}>
                            {risk.scoreBefore.toFixed(1)}
                          </span>
                          {reduction > 0 && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className={`font-bold ${getRiskColor(risk.scoreAfter)}`}>
                                {risk.scoreAfter.toFixed(1)}
                              </span>
                              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                                (↓{reduction.toFixed(0)}%)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                      className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
                    {risk.controls && risk.controls.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Controles Implementados ({risk.controls.length})
                        </h4>
                        <div className="space-y-2">
                          {risk.controls.map((control) => (
                            <div
                              key={control.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {control.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {getControlTypeLabel(control.type)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                  {control.effectiveness}% efectividad
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          No hay controles definidos para este riesgo
                        </p>
                        <Link
                          href={`/dashboard/ara/risks/${risk.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Controles
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
