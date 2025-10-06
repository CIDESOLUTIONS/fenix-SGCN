'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditRiskModalProps {
  show: boolean;
  onClose: () => void;
  risk: any;
  processes: any[];
  onSuccess: () => void;
}

export default function EditRiskModal({ show, onClose, risk, processes, onSuccess }: EditRiskModalProps) {
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
  const [saving, setSaving] = useState(false);
  const [showProcessSelector, setShowProcessSelector] = useState(false);

  useEffect(() => {
    if (risk) {
      setFormData({
        riskId: risk.riskId || '',
        name: risk.name || '',
        cause: risk.cause || '',
        event: risk.event || '',
        consequence: risk.consequence || '',
        category: risk.category || 'OPERATIONAL',
        affectedProcesses: risk.processId ? [risk.processId] : [],
        probabilityBefore: risk.probabilityBefore || 3,
        impactBefore: risk.impactBefore || 3,
      });
    }
  }, [risk]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/risk-assessments/${risk.id}`, {
        method: 'PATCH',
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
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Error al actualizar'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el riesgo');
    } finally {
      setSaving(false);
    }
  };

  const toggleProcess = (processId: string) => {
    setFormData(prev => ({
      ...prev,
      affectedProcesses: prev.affectedProcesses.includes(processId)
        ? prev.affectedProcesses.filter(id => id !== processId)
        : [...prev.affectedProcesses, processId]
    }));
  };

  if (!show) return null;

  const selectedProcessNames = formData.affectedProcesses
    .map(id => processes.find(p => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Editar Riesgo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Metodología de Análisis de Riesgo</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Complete los siguientes campos según la metodología de análisis causa-evento-consecuencia:
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Causa</label>
              <textarea
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                rows={2}
                placeholder="Describa la causa del riesgo..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
              <textarea
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                rows={2}
                placeholder="Describa el evento que podría ocurrir..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consecuencia</label>
              <textarea
                value={formData.consequence}
                onChange={(e) => setFormData({ ...formData, consequence: e.target.value })}
                rows={2}
                placeholder="Describa las consecuencias del evento..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Procesos Afectados <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProcessSelector(!showProcessSelector)}
                className="w-full px-3 py-2 border rounded-lg text-left flex justify-between items-center"
              >
                <span className={selectedProcessNames.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedProcessNames.length > 0 
                    ? `${selectedProcessNames.length} proceso(s) seleccionado(s)` 
                    : 'Seleccione procesos'}
                </span>
              </button>
              
              {showProcessSelector && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {processes.map(proc => (
                    <label key={proc.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.affectedProcesses.includes(proc.id)}
                        onChange={() => toggleProcess(proc.id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{proc.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probabilidad Inherente
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impacto Inherente
              </label>
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

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Riesgo Inherente:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {formData.probabilityBefore * formData.impactBefore}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name || formData.affectedProcesses.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
