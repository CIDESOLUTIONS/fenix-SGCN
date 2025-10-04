'use client';

import { useState } from 'react';
import { X, TrendingUp, DollarSign, Calculator } from 'lucide-react';

interface MonteCarloModalProps {
  riskId: string;
  riskName: string;
  onClose: () => void;
}

interface MonteCarloResult {
  statistics: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
  };
  percentiles: {
    p10: number;
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  distribution: Array<{ range: string; count: number; percentage: number }>;
}

export default function MonteCarloModal({ riskId, riskName, onClose }: MonteCarloModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [formData, setFormData] = useState({
    impactMin: 10000,
    impactMost: 50000,
    impactMax: 200000,
    probabilityMin: 0.1,
    probabilityMax: 0.5,
    iterations: 10000,
  });

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/risk-assessments/${riskId}/monte-carlo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.simulation);
      } else {
        alert('Error en la simulación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error ejecutando simulación');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Simulación Montecarlo</h2>
            <p className="text-sm text-gray-500">{riskName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">¿Qué es Montecarlo?</h3>
                <p className="text-sm text-indigo-800">
                  Simulación probabilística que ejecuta miles de escenarios para estimar el rango 
                  de impacto financiero del riesgo. Usa distribución triangular con valores mínimo, 
                  más probable y máximo.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impacto Mínimo (COP)
                  </label>
                  <input
                    type="number"
                    value={formData.impactMin}
                    onChange={(e) => setFormData({...formData, impactMin: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impacto Más Probable (COP)
                  </label>
                  <input
                    type="number"
                    value={formData.impactMost}
                    onChange={(e) => setFormData({...formData, impactMost: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impacto Máximo (COP)
                  </label>
                  <input
                    type="number"
                    value={formData.impactMax}
                    onChange={(e) => setFormData({...formData, impactMax: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Iteraciones
                  </label>
                  <select
                    value={formData.iterations}
                    onChange={(e) => setFormData({...formData, iterations: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={1000}>1,000</option>
                    <option value={5000}>5,000</option>
                    <option value={10000}>10,000</option>
                    <option value={50000}>50,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probabilidad Mínima (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.probabilityMin}
                    onChange={(e) => setFormData({...formData, probabilityMin: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probabilidad Máxima (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.probabilityMax}
                    onChange={(e) => setFormData({...formData, probabilityMax: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Ejecutando simulación...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Ejecutar Simulación Montecarlo
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Estadísticas Clave */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium">Media</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(result.statistics.mean)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium">Mediana</div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(result.statistics.median)}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 font-medium">Desv. Estándar</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {formatCurrency(result.statistics.stdDev)}
                  </div>
                </div>
              </div>

              {/* Percentiles */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Percentiles (Confianza)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P10 - 10% de confianza</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.percentiles.p10)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P50 - 50% de confianza</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.percentiles.p50)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P90 - 90% de confianza</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(result.percentiles.p90)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P95 - 95% de confianza</span>
                    <span className="font-semibold text-orange-700">{formatCurrency(result.percentiles.p95)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P99 - 99% de confianza</span>
                    <span className="font-semibold text-red-600">{formatCurrency(result.percentiles.p99)}</span>
                  </div>
                </div>
              </div>

              {/* Interpretación */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Interpretación
                </h3>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Hay un 90% de probabilidad de que el impacto sea menor a {formatCurrency(result.percentiles.p90)}</li>
                  <li>• El valor esperado (media) es {formatCurrency(result.statistics.mean)}</li>
                  <li>• En el peor escenario (P99), el impacto podría alcanzar {formatCurrency(result.percentiles.p99)}</li>
                </ul>
              </div>

              {/* Distribución */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Distribución de Probabilidad</h3>
                <div className="space-y-2">
                  {result.distribution.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-24 text-sm text-gray-600">{item.range}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-indigo-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${item.percentage}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-16 text-sm text-gray-600 text-right">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Nueva Simulación
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
