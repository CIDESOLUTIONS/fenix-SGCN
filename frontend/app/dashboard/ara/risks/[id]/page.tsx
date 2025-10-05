'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function RiskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [risk, setRisk] = useState<any>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchRiskDetail();
    }
  }, [params.id]);

  const fetchRiskDetail = async () => {
    try {
      const [riskRes, controlsRes] = await Promise.all([
        fetch(`/api/risk-assessments/${params.id}`),
        fetch(`/api/risk-controls/risk/${params.id}`)
      ]);

      if (riskRes.ok) setRisk(await riskRes.json());
      if (controlsRes.ok) setControls(await controlsRes.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!risk) return <div>Riesgo no encontrado</div>;

  const getRiskColor = (score: number) => {
    if (score >= 19) return 'bg-red-100 text-red-800';
    if (score >= 13) return 'bg-orange-100 text-orange-800';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/ara/risks"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Riesgos
        </Link>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm font-mono text-gray-500">{risk.riskId}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{risk.name}</h1>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {risk.category}
          </span>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-3 mb-6">
          <h3 className="font-semibold text-blue-900">Análisis Causa → Evento → Consecuencia</h3>
          
          <div>
            <span className="text-sm font-medium text-blue-700">Causa:</span>
            <p className="text-gray-700 mt-1">{risk.cause || 'No especificada'}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-blue-700">Evento:</span>
            <p className="text-gray-700 mt-1">{risk.event || 'No especificado'}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-blue-700">Consecuencia:</span>
            <p className="text-gray-700 mt-1">{risk.consequence || 'No especificada'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-3">Riesgo Inherente</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Probabilidad:</span>
                <span className="font-bold">{risk.probabilityBefore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Impacto:</span>
                <span className="font-bold">{risk.impactBefore}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Score:</span>
                  <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRiskColor(risk.scoreBefore)}`}>
                    {risk.scoreBefore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {risk.scoreAfter && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Riesgo Residual</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Probabilidad:</span>
                  <span className="font-bold">{risk.probabilityAfter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impacto:</span>
                  <span className="font-bold">{risk.impactAfter}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Score:</span>
                    <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRiskColor(risk.scoreAfter)}`}>
                      {risk.scoreAfter}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Controles Aplicados ({controls.length})</h3>
          <div className="space-y-3">
            {controls.map((control) => (
              <div key={control.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium mb-2">{control.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {control.controlType}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {control.effectiveness}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {control.automation}
                  </span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded font-semibold">
                    Score: {control.score} pts
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-semibold">
                    Reduce: {control.reductionQuadrants} cuadrantes
                  </span>
                </div>
              </div>
            ))}

            {controls.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay controles registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
