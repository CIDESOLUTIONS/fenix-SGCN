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
    const icons: Record<string, string> = {
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
        <h3 className="text-lg font-semibold mb-4">Comparación Visual de Estrategias</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Costo" fill="#8884d8" />
            <Bar dataKey="Tiempo (días)" fill="#82ca9d" />
            <Bar dataKey="Efectividad" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Estrategias */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estrategia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efectividad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score C/E
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {strategies.map((strategy) => (
              <tr 
                key={strategy.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectStrategy?.(strategy.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {strategy.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg">{getTypeIcon(strategy.type)}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {strategy.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${strategy.cost.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {strategy.implementationTime} días
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 mr-2">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-2"
                          style={{ width: `${strategy.effectiveness * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {(strategy.effectiveness * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {strategy.costEffectivenessScore.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(strategy.id)}`}>
                    {strategy.id === recommendation ? 'Recomendada' : 
                     strategy.id === bestOptions.leastExpensive.id ? 'Más Económica' :
                     strategy.id === bestOptions.fastestImplementation.id ? 'Más Rápida' :
                     strategy.id === bestOptions.mostEffective.id ? 'Más Efectiva' :
                     strategy.id === bestOptions.bestValue.id ? 'Mejor Valor' :
                     'Opción'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de Mejores Opciones */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Resumen de Análisis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Más Económica
            </div>
            <div className="text-sm font-bold text-blue-600">
              {bestOptions.leastExpensive.name}
            </div>
            <div className="text-xs text-gray-600">
              ${bestOptions.leastExpensive.cost.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Más Rápida
            </div>
            <div className="text-sm font-bold text-purple-600">
              {bestOptions.fastestImplementation.name}
            </div>
            <div className="text-xs text-gray-600">
              {bestOptions.fastestImplementation.implementationTime} días
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Más Efectiva
            </div>
            <div className="text-sm font-bold text-orange-600">
              {bestOptions.mostEffective.name}
            </div>
            <div className="text-xs text-gray-600">
              {(bestOptions.mostEffective.effectiveness * 100).toFixed(0)}% efectividad
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Mejor Valor
            </div>
            <div className="text-sm font-bold text-green-600">
              {bestOptions.bestValue.name}
            </div>
            <div className="text-xs text-gray-600">
              Score: {bestOptions.bestValue.costEffectivenessScore.toFixed(2)}
            </div>
          </div>
        </div>

        {recommendation && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Recomendación del Sistema
                </h4>
                <p className="text-sm text-green-700">
                  Basado en el análisis costo-efectividad y los requisitos de recuperación, 
                  se recomienda implementar la estrategia: <strong>{strategies.find(s => s.id === recommendation)?.name}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}