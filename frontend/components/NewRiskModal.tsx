'use client';

import { useState } from 'react';
import { Plus, X, Save, Check } from 'lucide-react';
import RiskControlsManager from '@/components/risk-controls/RiskControlsManager';

interface RiskControl {
  id?: string;
  description: string;
  controlType: string;
  applicationCriteria: string;
  isDocumented: string;
  effectiveness: string;
  automation: string;
  score?: number;
  reductionQuadrants?: number;
}

interface NewRiskModalProps {
  show: boolean;
  onClose: () => void;
  processes: any[];
  onSuccess: () => void;
}

export default function NewRiskModal({ show, onClose, processes, onSuccess }: NewRiskModalProps) {
  const [step, setStep] = useState(1);
  const [riskId, setRiskId] = useState('');
  const [controls, setControls] = useState<RiskControl[]>([]);
  const [showProcessSelector, setShowProcessSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    riskId: '',
    name: '',
    cause: '',
    event: '',
    consequence: '',
    category: 'OPERATIONAL',
    affectedProcesses: [] as string[],
    probabilityBefore: 3,
    impactBefore: 3,
  });

  const toggleProcess = (processId: string) => {
    setFormData(prev => ({
      ...prev,
      affectedProcesses: prev.affectedProcesses.includes(processId)
        ? prev.affectedProcesses.filter(id => id !== processId)
        : [...prev.affectedProcesses, processId]
    }));
  };

  const selectAllProcesses = () => {
    setFormData(prev => ({
      ...prev,
      affectedProcesses: processes.map(p => p.id)
    }));
  };

  const clearAllProcesses = () => {
    setFormData(prev => ({
      ...prev,
      affectedProcesses: []
    }));
  };

  const handleSaveBasicInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/risk-assessments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          processId: formData.affectedProcesses[0] || null,
          scoreBefore: formData.probabilityBefore * formData.impactBefore,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setRiskId(created.id);
        setStep(2);
      } else {
        const error = await response.json();
        alert(`Error al crear riesgo: ${error.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear riesgo');
    }
  };

  const handleFinish = async () => {
    await fetch(`/api/risk-controls/calculate-residual/${riskId}`, {
      method: 'POST',
    });
    
    onSuccess();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setRiskId('');
    setControls([]);
    setShowProcessSelector(false);
    setFormData({
      riskId: '',
      name: '',
      cause: '',
      event: '',
      consequence: '',
      category: 'OPERATIONAL',
      affectedProcesses: [],
      probabilityBefore: 3,
      impactBefore: 3,
    });
  };

  if (!show) return null;

  const selectedProcessNames = formData.affectedProcesses
    .map(id => processes.find(p => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Nuevo Riesgo - Información Básica' : 'Controles de Riesgo'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Riesgo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.riskId}
                    onChange={(e) => setFormData({ ...formData, riskId: e.target.value })}
                    placeholder="Ej: RC-001"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Procesos Afectados <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowProcessSelector(!showProcessSelector)}
                      className="w-full px-3 py-2 border rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-600">
                        {formData.affectedProcesses.length === 0 
                          ? 'Seleccione procesos...' 
                          : `${formData.affectedProcesses.length} proceso(s) seleccionado(s)`}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showProcessSelector && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-gray-50 px-3 py-2 border-b flex gap-2">
                          <button
                            onClick={selectAllProcesses}
                            className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                          >
                            Todos
                          </button>
                          <button
                            onClick={clearAllProcesses}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            Limpiar
                          </button>
                        </div>
                        
                        {processes.map(process => (
                          <div
                            key={process.id}
                            onClick={() => toggleProcess(process.id)}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              formData.affectedProcesses.includes(process.id) 
                                ? 'bg-indigo-600 border-indigo-600' 
                                : 'border-gray-300'
                            }`}>
                              {formData.affectedProcesses.includes(process.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm">{process.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedProcessNames.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedProcessNames.map((name, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Riesgo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="OPERATIONAL">Operacional</option>
                  <option value="TECHNOLOGICAL">Tecnológico</option>
                  <option value="NATURAL">Natural</option>
                  <option value="HUMAN">Humano</option>
                  <option value="EXTERNAL">Externo</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-900">Análisis Causa → Evento → Consecuencia</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Causa</label>
                  <textarea
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    placeholder="Debido a..."
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
                  <textarea
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    placeholder="Podría ocurrir..."
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consecuencia</label>
                  <textarea
                    value={formData.consequence}
                    onChange={(e) => setFormData({ ...formData, consequence: e.target.value })}
                    placeholder="Resultando en..."
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad</label>
                  <select
                    value={formData.probabilityBefore}
                    onChange={(e) => setFormData({ ...formData, probabilityBefore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="1">1 - Muy Baja</option>
                    <option value="2">2 - Baja</option>
                    <option value="3">3 - Moderada</option>
                    <option value="4">4 - Alta</option>
                    <option value="5">5 - Muy Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impacto</label>
                  <select
                    value={formData.impactBefore}
                    onChange={(e) => setFormData({ ...formData, impactBefore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="1">1 - Insignificante</option>
                    <option value="2">2 - Menor</option>
                    <option value="3">3 - Moderado</option>
                    <option value="4">4 - Mayor</option>
                    <option value="5">5 - Catastrófico</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Riesgo Inherente:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formData.probabilityBefore * formData.impactBefore}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveBasicInfo}
                  disabled={!formData.name || formData.affectedProcesses.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Siguiente: Controles
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <RiskControlsManager
                riskId={riskId}
                controls={controls}
                onControlsChange={setControls}
              />

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Finalizar y Calcular Riesgo Residual
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
