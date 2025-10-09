'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, FileText, Edit2, Trash2 } from 'lucide-react';
import NewRiskModal from '@/components/NewRiskModal';
import EditRiskModal from '@/components/EditRiskModal';
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
  cause?: string;
  event?: string;
  consequence?: string;
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
  const [showEditRiskModal, setShowEditRiskModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [procResponse, riskResponse] = await Promise.all([
        fetch('/api/business-processes/continuity/selected', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/risk-assessments', {
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

  const handleEdit = (risk: RiskAssessment) => {
    setSelectedRisk(risk);
    setShowEditRiskModal(true);
  };

  const handleDelete = async (riskId: string) => {
    if (!confirm('¿Está seguro de eliminar este riesgo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/risk-assessments/${riskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setRisks(risks.filter(r => r.id !== riskId));
      } else {
        alert('Error al eliminar el riesgo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el riesgo');
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
              {/* Header con título y categoría */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{risk.riskId}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{risk.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {risk.category}
                  </span>
                </div>
              </div>

              {/* Información resumida */}
              <div className="space-y-2 mb-4 text-sm">
                {risk.cause && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 min-w-[110px]">Causa:</span>
                    <p className="text-gray-600">{risk.cause.substring(0, 150)}{risk.cause.length > 150 ? '...' : ''}</p>
                  </div>
                )}
                {risk.event && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 min-w-[110px]">Evento:</span>
                    <p className="text-gray-600">{risk.event.substring(0, 150)}{risk.event.length > 150 ? '...' : ''}</p>
                  </div>
                )}
                {risk.consequence && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 min-w-[110px]">Consecuencia:</span>
                    <p className="text-gray-600">{risk.consequence.substring(0, 150)}{risk.consequence.length > 150 ? '...' : ''}</p>
                  </div>
                )}
              </div>

              {/* Scores y Acciones */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Riesgo Inherente</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(risk.scoreBefore)}`}>
                      {getRiskLevel(risk.scoreBefore)} ({risk.scoreBefore})
                    </span>
                  </div>
                  
                  {risk.scoreAfter && risk.scoreAfter !== risk.scoreBefore && (
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

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/ara/risks/${risk.id}`}
                    className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
                    title="Ver detalle completo"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalle
                  </Link>
                  <button
                    onClick={() => handleEdit(risk)}
                    className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                    title="Editar riesgo"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(risk.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    title="Eliminar riesgo"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
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

      {selectedRisk && (
        <EditRiskModal
          show={showEditRiskModal}
          onClose={() => {
            setShowEditRiskModal(false);
            setSelectedRisk(null);
          }}
          risk={selectedRisk}
          processes={processes}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
