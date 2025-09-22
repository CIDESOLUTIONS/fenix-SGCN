'use client';

import { useState, useEffect } from 'react';

interface Risk {
  id: string;
  riskDescription: string;
  likelihood: number;
  impact: number;
  riskScore: number;
}

export default function RiskMatrixPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await fetch('/api/risk-assessments');
      const data = await response.json();
      setRisks(data);
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRisksInCell = (likelihood: number, impact: number) => {
    return risks.filter(r => r.likelihood === likelihood && r.impact === impact);
  };

  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 15) return 'bg-red-500';
    if (score >= 9) return 'bg-orange-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCellText = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 15) return 'text-white';
    if (score >= 9) return 'text-white';
    return 'text-gray-900';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Matriz de Evaluación de Riesgos</h1>
        <p className="text-gray-500 mt-1">Visualización de riesgos por probabilidad e impacto</p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Crítico (≥15)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm">Alto (9-14)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Medio (5-8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Bajo (&lt;5)</span>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-6 gap-2">
          {/* Header */}
          <div className="col-span-1"></div>
          <div className="text-center font-semibold">1<br/>Insignificante</div>
          <div className="text-center font-semibold">2<br/>Menor</div>
          <div className="text-center font-semibold">3<br/>Moderado</div>
          <div className="text-center font-semibold">4<br/>Mayor</div>
          <div className="text-center font-semibold">5<br/>Catastrófico</div>

          {/* Rows */}
          {[5, 4, 3, 2, 1].map((likelihood) => (
            <>
              <div key={`label-${likelihood}`} className="flex items-center justify-center font-semibold">
                {likelihood}<br/>
                {likelihood === 5 && 'Casi Seguro'}
                {likelihood === 4 && 'Probable'}
                {likelihood === 3 && 'Posible'}
                {likelihood === 2 && 'Improbable'}
                {likelihood === 1 && 'Raro'}
              </div>
              {[1, 2, 3, 4, 5].map((impact) => {
                const cellRisks = getRisksInCell(likelihood, impact);
                const score = likelihood * impact;
                return (
                  <div
                    key={`cell-${likelihood}-${impact}`}
                    className={`${getCellColor(likelihood, impact)} ${getCellText(likelihood, impact)} p-4 rounded min-h-[100px] relative`}
                  >
                    <div className="text-xs font-bold mb-1">Score: {score}</div>
                    <div className="text-xs">
                      {cellRisks.length > 0 ? (
                        <div>
                          <div className="font-semibold mb-1">{cellRisks.length} riesgo{cellRisks.length > 1 ? 's' : ''}</div>
                          {cellRisks.slice(0, 2).map(risk => (
                            <div key={risk.id} className="truncate" title={risk.riskDescription}>
                              • {risk.riskDescription}
                            </div>
                          ))}
                          {cellRisks.length > 2 && (
                            <div className="text-xs opacity-75">+{cellRisks.length - 2} más</div>
                          )}
                        </div>
                      ) : (
                        <div className="opacity-50">Sin riesgos</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Y-axis label */}
        <div className="mt-4 text-center text-sm font-semibold text-gray-600">
          Probabilidad →
        </div>
      </div>

      {/* X-axis label */}
      <div className="text-center text-sm font-semibold text-gray-600 mt-2">
        ← Impacto
      </div>
    </div>
  );
}
