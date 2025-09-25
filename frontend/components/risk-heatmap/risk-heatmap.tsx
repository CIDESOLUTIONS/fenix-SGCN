'use client';

import React from 'react';

interface RiskHeatmapProps {
  data: {
    HIGH_HIGH: any[];
    HIGH_MEDIUM: any[];
    HIGH_LOW: any[];
    MEDIUM_HIGH: any[];
    MEDIUM_MEDIUM: any[];
    MEDIUM_LOW: any[];
    LOW_HIGH: any[];
    LOW_MEDIUM: any[];
    LOW_LOW: any[];
  };
  onRiskClick?: (riskId: string) => void;
}

const impactLabels = ['Alto', 'Medio', 'Bajo'];
const likelihoodLabels = ['Bajo', 'Medio', 'Alto'];

const getColorClass = (impact: string, likelihood: string) => {
  const key = `${impact}_${likelihood}`;
  const colors = {
    'HIGH_HIGH': 'bg-red-600',
    'HIGH_MEDIUM': 'bg-red-500',
    'HIGH_LOW': 'bg-orange-500',
    'MEDIUM_HIGH': 'bg-orange-500',
    'MEDIUM_MEDIUM': 'bg-yellow-500',
    'MEDIUM_LOW': 'bg-yellow-400',
    'LOW_HIGH': 'bg-yellow-400',
    'LOW_MEDIUM': 'bg-green-400',
    'LOW_LOW': 'bg-green-500',
  };
  return colors[key] || 'bg-gray-300';
};

export function RiskHeatmap({ data, onRiskClick }: RiskHeatmapProps) {
  const impactLevels = ['HIGH', 'MEDIUM', 'LOW'];
  const likelihoodLevels = ['LOW', 'MEDIUM', 'HIGH'];

  const getRiskCount = (impact: string, likelihood: string) => {
    const key = `${impact}_${likelihood}`;
    return data[key]?.length || 0;
  };

  const handleCellClick = (impact: string, likelihood: string) => {
    const key = `${impact}_${likelihood}`;
    const risks = data[key] || [];
    if (risks.length > 0 && onRiskClick) {
      // Si solo hay un riesgo, abrir directamente
      if (risks.length === 1) {
        onRiskClick(risks[0].id);
      } else {
        // Mostrar lista de riesgos en modal (implementar según necesidad)
        console.log('Riesgos en esta celda:', risks);
      }
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No hay datos de riesgos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Leyenda */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold">Leyenda:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span>Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Alto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Moderado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Bajo</span>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100"></th>
              {likelihoodLabels.map((label, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-3 bg-gray-100 font-semibold text-sm"
                >
                  {label}
                  <br />
                  <span className="text-xs text-gray-500">Probabilidad</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {impactLevels.map((impact, impactIndex) => (
              <tr key={impact}>
                <td className="border border-gray-300 p-3 bg-gray-100 font-semibold text-sm">
                  {impactLabels[impactIndex]}
                  <br />
                  <span className="text-xs text-gray-500">Impacto</span>
                </td>
                {likelihoodLevels.map((likelihood) => {
                  const count = getRiskCount(impact, likelihood);
                  const colorClass = getColorClass(impact, likelihood);
                  return (
                    <td
                      key={`${impact}-${likelihood}`}
                      className={`border border-gray-300 p-4 text-center cursor-pointer transition-opacity hover:opacity-80 ${colorClass}`}
                      onClick={() => handleCellClick(impact, likelihood)}
                      title={`${count} riesgo(s) - Click para ver detalles`}
                    >
                      <div className="text-white font-bold text-2xl">
                        {count}
                      </div>
                      {count > 0 && (
                        <div className="text-white text-xs mt-1">
                          riesgo{count > 1 ? 's' : ''}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-sm text-red-600 font-semibold">Riesgos Críticos</div>
          <div className="text-3xl font-bold text-red-700 mt-2">
            {(data.HIGH_HIGH?.length || 0) + (data.HIGH_MEDIUM?.length || 0)}
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-semibold">Riesgos Altos</div>
          <div className="text-3xl font-bold text-orange-700 mt-2">
            {(data.HIGH_LOW?.length || 0) + (data.MEDIUM_HIGH?.length || 0)}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-semibold">Riesgos Bajos</div>
          <div className="text-3xl font-bold text-green-700 mt-2">
            {(data.LOW_MEDIUM?.length || 0) + (data.LOW_LOW?.length || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
