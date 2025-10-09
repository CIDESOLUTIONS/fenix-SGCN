'use client';

import { useState } from 'react';
import { BarChart3, Play, Download, Info } from 'lucide-react';

interface MonteCarloSimulationProps {
  riskId: string;
  riskName: string;
  baseImpact: number;
  baseProbability: number;
}

interface SimulationResult {
  mean: number;
  median: number;
  p10: number;
  p50: number;
  p90: number;
  min: number;
  max: number;
  histogram: { range: string; count: number }[];
}

export default function MonteCarloSimulation({ riskId, riskName, baseImpact, baseProbability }: MonteCarloSimulationProps) {
  const [iterations, setIterations] = useState(10000);
  const [impactMin, setImpactMin] = useState(baseImpact * 0.7);
  const [impactMax, setImpactMax] = useState(baseImpact * 1.3);
  const [impactMode, setImpactMode] = useState(baseImpact);
  const [probMin, setProbMin] = useState(baseProbability * 0.7);
  const [probMax, setProbMax] = useState(baseProbability * 1.3);
  const [probMode, setProbMode] = useState(baseProbability);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Distribución triangular
  const triangularDistribution = (min: number, max: number, mode: number): number => {
    const u = Math.random();
    const F = (mode - min) / (max - min);
    
    if (u < F) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
  };

  const runSimulation = async () => {
    setRunning(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const simulatedImpact = triangularDistribution(impactMin, impactMax, impactMode);
      const simulatedProb = triangularDistribution(probMin, probMax, probMode);
      const score = simulatedImpact * simulatedProb;
      results.push(score);
    }
    
    results.sort((a, b) => a - b);
    
    const mean = results.reduce((acc, val) => acc + val, 0) / results.length;
    const median = results[Math.floor(results.length / 2)];
    const p10 = results[Math.floor(results.length * 0.1)];
    const p50 = median;
    const p90 = results[Math.floor(results.length * 0.9)];
    const min = results[0];
    const max = results[results.length - 1];
    
    const bins = 20;
    const binSize = (max - min) / bins;
    const histogram: { range: string; count: number }[] = [];
    
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const count = results.filter(r => r >= binStart && r < binEnd).length;
      histogram.push({
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        count
      });
    }
    
    setResult({
      mean,
      median,
      p10,
      p50,
      p90,
      min,
      max,
      histogram
    });
    
    setRunning(false);
  };

  const exportResults = () => {
    if (!result) return;
    
    const csvContent = [
      ['Métrica', 'Valor'],
      ['Media', result.mean.toFixed(2)],
      ['Mediana', result.median.toFixed(2)],
      ['Percentil 10', result.p10.toFixed(2)],
      ['Percentil 50', result.p50.toFixed(2)],
      ['Percentil 90', result.p90.toFixed(2)],
      ['Mínimo', result.min.toFixed(2)],
      ['Máximo', result.max.toFixed(2)],
      [''],
      ['Rango', 'Frecuencia'],
      ...result.histogram.map(h => [h.range, h.count.toString()])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Simulacion_Montecarlo_${riskId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              Simulación Montecarlo
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Análisis cuantitativo mediante simulación probabilística. Define rangos de variabilidad usando distribuciones triangulares.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Parámetros de Simulación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número de Iteraciones
            </label>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={1000}>1,000</option>
              <option value={5000}>5,000</option>
              <option value={10000}>10,000</option>
              <option value={50000}>50,000</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Distribución de Impacto (Triangular)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mínimo
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={impactMin}
                  onChange={(e) => setImpactMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Más Probable
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={impactMode}
                  onChange={(e) => setImpactMode(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Máximo
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={impactMax}
                  onChange={(e) => setImpactMax(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Distribución de Probabilidad (Triangular)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mínimo
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={probMin}
                  onChange={(e) => setProbMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Más Probable
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={probMode}
                  onChange={(e) => setProbMode(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Máximo
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={probMax}
                  onChange={(e) => setProbMax(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={runSimulation}
            disabled={running}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            {running ? 'Ejecutando...' : 'Ejecutar Simulación'}
          </button>

          {result && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resultados Estadísticos
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Media</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {result.mean.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mediana</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {result.median.toFixed(2)}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mínimo</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {result.min.toFixed(2)}
                </p>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Máximo</p>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                  {result.max.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Percentil 10</p>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                  {result.p10.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  10% de los casos están por debajo
                </p>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Percentil 50</p>
                <p className="text-xl font-bold text-teal-900 dark:text-teal-100">
                  {result.p50.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  50% de los casos están por debajo
                </p>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Percentil 90</p>
                <p className="text-xl font-bold text-cyan-900 dark:text-cyan-100">
                  {result.p90.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  90% de los casos están por debajo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribución de Resultados
            </h3>
            
            <div className="space-y-2">
              {result.histogram.map((bin, index) => {
                const maxCount = Math.max(...result.histogram.map(h => h.count));
                const widthPercent = (bin.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-32">
                      {bin.range}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${widthPercent}%` }}
                      >
                        {bin.count > 0 && (
                          <span className="text-xs text-white font-semibold">
                            {bin.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
