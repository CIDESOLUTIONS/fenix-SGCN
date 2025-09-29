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
  const colors: Record<string, string> = {
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
    const key = `${impact}_${likelihood}` as keyof typeof data;
    return data[key]?.length || 0;
  };

  const getRisks = (impact: string, likelihood: string) => {
    const key = `${impact}_${likelihood}` as keyof typeof data;
    return data[key] || [];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Mapa de Calor de Riesgos</h3>
      
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-gray-600">
          Impacto
        </div>
        
        {/* X-axis label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-600">
          Probabilidad
        </div>
        
        {/* Grid container */}
        <div className="grid grid-cols-4 gap-2">
          {/* Empty cell for axis labels */}
          <div></div>
          
          {/* Likelihood labels */}
          {likelihoodLabels.map((label, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-700 pb-2">
              {label}
            </div>
          ))}
          
          {/* Impact levels with risk cells */}
          {impactLevels.map((impact, impactIndex) => (
            <React.Fragment key={impact}>
              {/* Impact label */}
              <div className="text-right text-sm font-medium text-gray-700 pr-2 flex items-center justify-end">
                {impactLabels[impactIndex]}
              </div>
              
              {/* Risk cells */}
              {likelihoodLevels.map((likelihood) => {
                const risks = getRisks(impact, likelihood);
                const count = getRiskCount(impact, likelihood);
                const colorClass = getColorClass(impact, likelihood);
                
                return (
                  <div
                    key={`${impact}_${likelihood}`}
                    className={`
                      ${colorClass} 
                      h-24 
                      rounded-lg 
                      flex 
                      flex-col 
                      items-center 
                      justify-center 
                      cursor-pointer 
                      hover:opacity-90 
                      transition-opacity
                      relative
                      group
                    `}
                    onClick={() => risks.forEach(risk => onRiskClick?.(risk.id))}
                  >
                    <span className="text-2xl font-bold text-white">{count}</span>
                    <span className="text-xs text-white/90 mt-1">
                      {count === 1 ? 'Riesgo' : 'Riesgos'}
                    </span>
                    
                    {/* Tooltip on hover */}
                    {count > 0 && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {risks.slice(0, 3).map(risk => risk.title || risk.name).join(', ')}
                        {count > 3 && ` +${count - 3} más`}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600">Crítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Alto</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Medio</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Bajo</span>
          </div>
        </div>
      </div>
    </div>
  );
}