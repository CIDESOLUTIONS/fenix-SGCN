'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Strategy {
  id: string;
  name: string;
  type: string;
  cost: number;
  implementationTime: number;
  effectiveness: number;
  costEffectivenessScore: number;
}

interface StrategyComparisonProps {
  strategies: Strategy[];
  bestOptions: {
    leastExpensive: Strategy;
    fastestImplementation: Strategy;
    mostEffective: Strategy;
    bestValue: Strategy;
  };
  recommendation: string;
  onSelectStrategy?: (strategyId: string) => void;
}

export function StrategyComparison({
  strategies,
  bestOptions,
  recommendation,
  onSelectStrategy,
}: StrategyComparisonProps) {
  if (!strategies || strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No hay estrategias para comparar</p>
      </div>
    );
  }

  const chartData = strategies.map((s) => ({
    name: s.name.substring(0, 20) + '...',
    Costo: s.cost / 1000, // En miles
    'Tiempo (días)': s.implementationTime,
    Efectividad: s.effectiveness * 10, // Escalar para visualización
  }));

  const getBadgeColor = (strategyId: string) => {
    if (strategyId === recommendation) return 'bg-green-100 text-green-800 border-green-300';
    if (strategyId === bestOptions.leastExpensive.id) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (strategyId === bestOptions.fastestImplementation.id) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (strategyId === bestOptions.mostEffective.id) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      PREVENTION: '🛡️',
      MITIGATION: '⚠️',
      RECOVERY: '🔄',
      REDUNDANCY: '🔁',
    };
    return icons[type] || '📋';
  };

  return (
    <div className="space-y-6">
      {/* Gráfico Comparativo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Comparación Visual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Costo" fill="#3b82f6" name="Costo (miles USD)" />
            <Bar dataKey="Tiempo (días)" fill="#8b5cf6" name="Tiempo (días)" />
            <Bar dataKey="Efectividad" fill="#f59e0b" name="Efectividad (×10)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla Comparativa */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Estrategia</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Costo (USD)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Tiempo (días)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Efectividad</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Score</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((strategy) => (
              <tr
                key={strategy.id}
                className={`border-t hover:bg-gray-50 ${
                  strategy.id === recommendation ? 'bg-green-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(strategy.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{strategy.name}</div>
                      {strategy.id === recommendation && (
                        <span className="text-xs text-green-600 font-semibold">
                          ⭐ Recomendada
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs border ${getBadgeColor(strategy.id)}`}>
                    {strategy.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  ${strategy.cost?.toLocaleString() || 'N/A'}
                </td>
                <td className="px-4 py-3 text-right">{strategy.implementationTime || 'N/A'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < strategy.effectiveness ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {strategy.costEffectivenessScore?.toFixed(2) || 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  {onSelectStrategy && (
                    <button
                      onClick={() => onSelectStrategy(strategy.id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                    >
                      Seleccionar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mejores Opciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">💰 Más Económica</div>
          <div className="text-lg font-bold text-blue-900">{bestOptions.leastExpensive.name}</div>
          <div className="text-sm text-blue-700 mt-1">
            ${bestOptions.leastExpensive.cost?.toLocaleString()}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-semibold mb-1">⚡ Más Rápida</div>
          <div className="text-lg font-bold text-purple-900">{bestOptions.fastestImplementation.name}</div>
          <div className="text-sm text-purple-700 mt-1">
            {bestOptions.fastestImplementation.implementationTime} días
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-semibold mb-1">🎯 Más Efectiva</div>
          <div className="text-lg font-bold text-orange-900">{bestOptions.mostEffective.name}</div>
          <div className="text-sm text-orange-700 mt-1">
            {bestOptions.mostEffective.effectiveness}/5 estrellas
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-semibold mb-1">⭐ Mejor Valor</div>
          <div className="text-lg font-bold text-green-900">{bestOptions.bestValue.name}</div>
          <div className="text-sm text-green-700 mt-1">
            Score: {bestOptions.bestValue.costEffectivenessScore?.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
