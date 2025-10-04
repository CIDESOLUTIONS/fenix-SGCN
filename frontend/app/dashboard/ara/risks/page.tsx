'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, Calculator } from 'lucide-react';
import MonteCarloModal from '@/components/MonteCarloModal';

interface BusinessProcess {
  id: string;
  name: string;
  processType: string;
  includeInContinuityAnalysis: boolean;
  priorityScore: number;
}

interface RiskAssessment {
  id: string;
  processId: string;
  name: string;
  description: string;
  category: string;
  probabilityBefore: number;
  impactBefore: number;
  scoreBefore: number;
  controls: string[];
  probabilityAfter: number;
  impactAfter: number;
  scoreAfter: number;
  status?: string;
  owner?: string;
}

export default function RisksPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRiskModal, setShowNewRiskModal] = useState(false);
  const [selectedRiskForMontecarlo, setSelectedRiskForMontecarlo] = useState<{id: string, name: string} | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'OPERATIONAL',
    probabilityBefore: 3,
    impactBefore: 3,
    controls: '',
    probabilityAfter: 2,
    impactAfter: 2,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const procResponse = await fetch('/api/business-processes/continuity/selected');
      const procData = await procResponse.json();
      setProcesses(procData);

      const riskResponse = await fetch('/api/risk-assessments');
      const riskData = await riskResponse.json();
      setRisks(riskData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-800';
    if (score >= 9) return 'bg-orange-100 text-orange-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleCreateRisk = async () => {
    if (!selectedProcess) {
      alert('Seleccione un proceso');
      return;
    }

    try {
      const response = await fetch('/api/risk-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processId: selectedProcess,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          probabilityBefore: formData.probabilityBefore,
          impactBefore: formData.impactBefore,
          controls: formData.controls.split(',').map(c => c.trim()).filter(c => c),
          probabilityAfter: formData.probabilityAfter,
          impactAfter: formData.impactAfter,
        }),
      });

      if (response.ok) {
        await fetchData();
        setShowNewRiskModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating risk:', error);
    }
  };

  const resetForm = () => {
    setSelectedProcess('');
    setFormData({
      name: '',
      description: '',
      category: 'OPERATIONAL',
      probabilityBefore: 3,
      impactBefore: 3,
      controls: '',
      probabilityAfter: 2,
      impactAfter: 2,
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluación de Riesgos (ARA)</h1>
          <p className="text-gray-500 mt-1">ISO 22301 Cláusula 8.2.3 & ISO 31000</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button 
            onClick={() => setShowNewRiskModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Riesgo
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Total Riesgos</div>
          <div className="text-2xl font-bold text-gray-900">{risks.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Riesgos Críticos</div>
          <div className="text-2xl font-bold text-red-600">
            {risks.filter(r => r.scoreBefore >= 15).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Riesgos Altos</div>
          <div className="text-2xl font-bold text-orange-600">
            {risks.filter(r => r.scoreBefore >= 9 && r.scoreBefore < 15).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Score Promedio</div>
          <div className="text-2xl font-bold text-gray-900">
            {(risks.reduce((acc, r) => acc + r.scoreAfter, 0) / (risks.length || 1)).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prob. Inicial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imp. Inicial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Inicial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Residual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Cargando riesgos...
                  </td>
                </tr>
              ) : risks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay riesgos registrados. Haz clic en "Nuevo Riesgo" para comenzar.
                  </td>
                </tr>
              ) : (
                risks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      <div className="text-sm font-medium">{risk.name}</div>
                      <div className="text-xs text-gray-500">{risk.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {risk.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{risk.probabilityBefore}/5</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{risk.impactBefore}/5</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(risk.scoreBefore)}`}>
                        {risk.scoreBefore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(risk.scoreAfter)}`}>
                        {risk.scoreAfter.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedRiskForMontecarlo({ id: risk.id, name: risk.name })}
                        className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center gap-1"
                      >
                        <Calculator className="w-4 h-4" /> Montecarlo
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Riesgo */}
      {showNewRiskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuevo Riesgo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proceso de Negocio</label>
                <select
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Seleccionar proceso...</option>
                  {processes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.processType}) - Prioridad: {p.priorityScore}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Riesgo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="OPERATIONAL">Operacional</option>
                  <option value="TECHNOLOGICAL">Tecnológico</option>
                  <option value="NATURAL">Natural</option>
                  <option value="HUMAN">Humano</option>
                  <option value="EXTERNAL">Externo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad Inicial (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.probabilityBefore}
                    onChange={(e) => setFormData({...formData, probabilityBefore: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impacto Inicial (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.impactBefore}
                    onChange={(e) => setFormData({...formData, impactBefore: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Controles (separados por coma)</label>
                <input
                  type="text"
                  value={formData.controls}
                  onChange={(e) => setFormData({...formData, controls: e.target.value})}
                  placeholder="Ej: Monitoreo 24/7, Backups automáticos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad Residual (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.probabilityAfter}
                    onChange={(e) => setFormData({...formData, probabilityAfter: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impacto Residual (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.impactAfter}
                    onChange={(e) => setFormData({...formData, impactAfter: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowNewRiskModal(false); resetForm(); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRisk}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear Riesgo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Montecarlo */}
      {selectedRiskForMontecarlo && (
        <MonteCarloModal
          riskId={selectedRiskForMontecarlo.id}
          riskName={selectedRiskForMontecarlo.name}
          onClose={() => setSelectedRiskForMontecarlo(null)}
        />
      )}
    </div>
  );
}
