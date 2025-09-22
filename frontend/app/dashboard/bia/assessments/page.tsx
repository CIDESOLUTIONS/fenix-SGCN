'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Download, AlertCircle } from 'lucide-react';

interface BIAAssessment {
  id: string;
  processId: string;
  processName?: string;
  rto: number;
  rpo: number;
  mtpd: number;
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  financialImpact?: string;
  operationalImpact?: string;
  reputationalImpact?: string;
}

export default function BIAAssessmentsPage() {
  const [assessments, setAssessments] = useState<BIAAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/bia-assessments');
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error('Error fetching BIA assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${hours * 60} min`;
    if (hours < 24) return `${hours} hrs`;
    return `${Math.round(hours / 24)} días`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Impacto al Negocio (BIA)</h1>
          <p className="text-gray-500 mt-1">Evaluación de criticidad y objetivos de recuperación</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Plantillas
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Evaluación BIA
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Evaluaciones</div>
          <div className="text-2xl font-bold">{assessments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Procesos Críticos</div>
          <div className="text-2xl font-bold text-red-600">
            {assessments.filter(a => a.impactLevel === 'Critical').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">RTO Promedio</div>
          <div className="text-2xl font-bold text-blue-600">
            {assessments.length > 0 
              ? formatTime(assessments.reduce((acc, a) => acc + a.rto, 0) / assessments.length)
              : '0 hrs'
            }
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">RPO Promedio</div>
          <div className="text-2xl font-bold text-purple-600">
            {assessments.length > 0
              ? formatTime(assessments.reduce((acc, a) => acc + a.rpo, 0) / assessments.length)
              : '0 hrs'
            }
          </div>
        </div>
      </div>

      {/* Alert for missing assessments */}
      {assessments.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">No hay evaluaciones BIA registradas</h3>
            <p className="text-sm text-yellow-700 mt-1">
              El BIA es fundamental para identificar procesos críticos y establecer objetivos de recuperación. 
              Comienza creando tu primera evaluación.
            </p>
          </div>
        </div>
      )}

      {/* Assessments Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel de Impacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RTO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RPO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MTPD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impacto Financiero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Cargando evaluaciones BIA...
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay evaluaciones. Haz clic en "Nueva Evaluación BIA" para comenzar.
                  </td>
                </tr>
              ) : (
                assessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assessment.processName || `Proceso ${assessment.processId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactColor(assessment.impactLevel)}`}>
                        {assessment.impactLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatTime(assessment.rto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatTime(assessment.rpo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatTime(assessment.mtpd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assessment.financialImpact || 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                      <button className="text-blue-600 hover:text-blue-900">Editar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
