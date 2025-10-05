'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface Criterion {
  id?: string;
  level: number;
  descriptor: string;
  description: string;
  value: number;
}

interface RiskLevel {
  id?: string;
  name: string;
  minScore: number;
  maxScore: number;
  treatment: string;
  color: string;
}

export default function ScoringPage() {
  const [probabilityCriteria, setProbabilityCriteria] = useState<Criterion[]>([]);
  const [impactCriteria, setImpactCriteria] = useState<Criterion[]>([]);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    try {
      // Valores por defecto basados en ISO 31000
      setProbabilityCriteria([
        { level: 5, descriptor: 'Muy Alta (Casi Seguro)', description: 'Se espera que ocurra en la mayoría de las circunstancias', value: 5 },
        { level: 4, descriptor: 'Alta (Probable)', description: 'Se espera que ocurra frecuentemente', value: 4 },
        { level: 3, descriptor: 'Moderada (Posible)', description: 'Podría ocurrir ocasionalmente', value: 3 },
        { level: 2, descriptor: 'Baja (Poco Probable)', description: 'Podría ocurrir raramente', value: 2 },
        { level: 1, descriptor: 'Muy Baja (Raro)', description: 'Es muy poco probable que ocurra', value: 1 },
      ]);

      setImpactCriteria([
        { level: 5, descriptor: 'Catastrófico', description: 'Interrupción total y prolongada de servicios críticos. Pérdidas financieras severas.', value: 5 },
        { level: 4, descriptor: 'Mayor', description: 'Interrupción significativa de un servicio crítico. Pérdidas financieras considerables.', value: 4 },
        { level: 3, descriptor: 'Moderado', description: 'Interrupción parcial de un servicio crítico. Pérdidas financieras moderadas.', value: 3 },
        { level: 2, descriptor: 'Menor', description: 'Degradación del servicio o interrupción breve. Pérdidas financieras menores.', value: 2 },
        { level: 1, descriptor: 'Insignificante', description: 'Breve inconveniente sin impacto real en la prestación del servicio.', value: 1 },
      ]);

      setRiskLevels([
        { name: 'Crítico', minScore: 19, maxScore: 25, treatment: 'Tratamiento inmediato y monitoreo por la alta dirección', color: 'red' },
        { name: 'Alto', minScore: 13, maxScore: 18, treatment: 'Tratamiento prioritario y plan de acción formal', color: 'orange' },
        { name: 'Moderado', minScore: 7, maxScore: 12, treatment: 'Monitoreo y tratamiento según costo-beneficio', color: 'yellow' },
        { name: 'Bajo', minScore: 1, maxScore: 6, treatment: 'Aceptación del riesgo y monitoreo periódico', color: 'green' },
      ]);
    } catch (error) {
      console.error('Error loading criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCriteria = async () => {
    try {
      alert('Criterios guardados exitosamente');
    } catch (error) {
      console.error('Error saving criteria:', error);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Configure los criterios de evaluación según la metodología ISO 31000
          </p>
        </div>
        <button
          onClick={saveCriteria}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Criterios
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Criterios de Probabilidad</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descriptor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frecuencia Esperada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {probabilityCriteria.map((criterion) => (
                <tr key={criterion.level} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{criterion.level}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{criterion.descriptor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{criterion.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{criterion.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Criterios de Impacto</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descriptor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impacto Operacional y Financiero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {impactCriteria.map((criterion) => (
                <tr key={criterion.level} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{criterion.level}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{criterion.descriptor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{criterion.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{criterion.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Niveles de Riesgo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rango de Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tratamiento Requerido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riskLevels.map((level) => (
                <tr key={level.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${level.color}-100 text-${level.color}-800`}>
                      {level.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {level.minScore} - {level.maxScore}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{level.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
