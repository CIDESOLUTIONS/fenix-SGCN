'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, FileText } from 'lucide-react';
import NewRiskModal from '@/components/NewRiskModal';
import Link from 'next/link';

interface BusinessProcess {
  id: string;
  name: string;
}

interface RiskAssessment {
  id: string;
  riskId: string;
  name: string;
  category: string;
  probabilityBefore: number;
  impactBefore: number;
  scoreBefore: number;
  probabilityAfter: number;
  impactAfter: number;
  scoreAfter: number;
}

export default function RisksPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRiskModal, setShowNewRiskModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const [procResponse, riskResponse] = await Promise.all([
        fetch(`${API_URL}/api/business-processes/continuity/selected`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/risk-assessments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (procResponse.ok) {
        setProcesses(await procResponse.json());
      }

      if (riskResponse.ok) {
        setRisks(await riskResponse.json());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      const response = await fetch('/api/reports/risk-summary', {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resumen_Riesgos_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 19) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 13) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 19) return 'Crítico';
    if (score >= 13) return 'Alto';
    if (score >= 7) return 'Moderado';
    return 'Bajo';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Gestione y evalúe riesgos según metodología ISO 31000
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF || risks.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {generatingPDF ? 'Generando...' : 'Generar Resumen PDF'}
          </button>
          <Link 
            href="/dashboard/ara/scoring"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Criterios de Evaluación
          </Link>
          <button 
            onClick={() => setShowNewRiskModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Riesgo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {risks.map((risk) => (
            <div key={risk.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">{risk.riskId}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{risk.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Riesgo Inherente</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(risk.scoreBefore)}`}>
                        {getRiskLevel(risk.scoreBefore)} ({risk.scoreBefore})
                      </span>
                    </div>
                    
                    {risk.scoreAfter && (
                      <>
                        <div className="text-gray-400">→</div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Riesgo Residual</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(risk.scoreAfter)}`}>
                            {getRiskLevel(risk.scoreAfter)} ({risk.scoreAfter})
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  href={`/dashboard/ara/risks/${risk.id}`}
                  className="ml-4 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}

          {risks.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay riesgos registrados</p>
              <button
                onClick={() => setShowNewRiskModal(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Crear el primer riesgo
              </button>
            </div>
          )}
        </div>
      )}

      <NewRiskModal
        show={showNewRiskModal}
        onClose={() => setShowNewRiskModal(false)}
        processes={processes}
        onSuccess={fetchData}
      />
    </div>
  );
}
