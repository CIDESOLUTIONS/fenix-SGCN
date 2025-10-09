'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskAssessment {
  id: string;
  name: string;
  description: string;
  category: string;
  probabilityBefore: number;
  impactBefore: number;
  scoreBefore: number;
  scoreAfter: number;
}

export default function RiskMatrixPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getRisksInCell = (probability: number, impact: number) => {
    return risks.filter(r => r.probabilityBefore === probability && r.impactBefore === impact);
  };

  const getCellColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 15) return 'bg-red-500';
    if (score >= 9) return 'bg-orange-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCellTextColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 5) return 'text-white';
    return 'text-gray-900';
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
      <div>
        <p className="text-gray-600">
          Visualización de riesgos según probabilidad e impacto
        </p>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm font-medium">Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm font-medium">Alto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm font-medium">Medio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm font-medium">Bajo</span>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          Total: <span className="font-bold text-gray-900">{risks.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="grid grid-cols-6 gap-2">
          <div className="flex items-center justify-center">
            <div className="text-sm font-bold text-gray-600 transform -rotate-90">
              PROBABILIDAD
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((impact) => (
            <div key={impact} className="text-center font-semibold text-sm p-2">
              <div className="text-lg font-bold">{impact}</div>
            </div>
          ))}

          {[5, 4, 3, 2, 1].map((probability) => (
            <>
              <div key={`label-${probability}`} className="flex flex-col items-center justify-center font-semibold text-sm p-2">
                <div className="text-lg font-bold">{probability}</div>
              </div>
              {[1, 2, 3, 4, 5].map((impact) => {
                const cellRisks = getRisksInCell(probability, impact);
                const score = probability * impact;
                return (
                  <div key={`cell-${probability}-${impact}`} className={`${getCellColor(probability, impact)} ${getCellTextColor(probability, impact)} p-3 rounded-lg min-h-[100px]`}>
                    <div className="text-xs font-bold mb-2">Score: {score}</div>
                    <div className="text-xs">
                      {cellRisks.length > 0 ? (
                        <div>
                          <div className="font-semibold mb-1">
                            {cellRisks.length} riesgo{cellRisks.length > 1 ? 's' : ''}
                          </div>
                          {cellRisks.slice(0, 2).map(risk => (
                            <div key={risk.id} className="truncate text-xs" title={risk.name}>
                              • {risk.name}
                            </div>
                          ))}
                          {cellRisks.length > 2 && (
                            <div className="text-xs">+{cellRisks.length - 2} más</div>
                          )}
                        </div>
                      ) : (
                        <div className="opacity-50 text-center mt-4">Sin riesgos</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ))}
        </div>
        <div className="mt-6 text-center text-sm font-bold text-gray-600">
          IMPACTO
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm font-medium text-red-800">Críticos</div>
          <div className="text-2xl font-bold text-red-600">
            {risks.filter(r => r.scoreBefore >= 15).length}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm font-medium text-orange-800">Altos</div>
          <div className="text-2xl font-bold text-orange-600">
            {risks.filter(r => r.scoreBefore >= 9 && r.scoreBefore < 15).length}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">Medios</div>
          <div className="text-2xl font-bold text-yellow-600">
            {risks.filter(r => r.scoreBefore >= 5 && r.scoreBefore < 9).length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800">Bajos</div>
          <div className="text-2xl font-bold text-green-600">
            {risks.filter(r => r.scoreBefore < 5).length}
          </div>
        </div>
      </div>
    </div>
  );
}
