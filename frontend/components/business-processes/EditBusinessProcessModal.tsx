"use client";
import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface EditBusinessProcessModalProps {
  process: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBusinessProcessModal({ 
  process, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditBusinessProcessModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    highLevelCharacterization: "",
    processType: "CORE",
    criticalityLevel: "MEDIUM",
    includeInContinuityAnalysis: false,
    prioritizationCriteria: {
      strategic: 5,
      operational: 5,
      financial: 5,
      regulatory: 5,
    }
  });

  useEffect(() => {
    if (process && isOpen) {
      setFormData({
        name: process.name || "",
        description: process.description || "",
        highLevelCharacterization: process.highLevelCharacterization || "",
        processType: process.processType || "CORE",
        criticalityLevel: process.criticalityLevel || "MEDIUM",
        includeInContinuityAnalysis: process.includeInContinuityAnalysis || false,
        prioritizationCriteria: process.prioritizationCriteria || {
          strategic: 5,
          operational: 5,
          financial: 5,
          regulatory: 5,
        }
      });
    }
  }, [process, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const processData = {
        ...formData,
        priorityScore: parseFloat((
          formData.prioritizationCriteria.strategic * 0.30 +
          formData.prioritizationCriteria.operational * 0.30 +
          formData.prioritizationCriteria.financial * 0.25 +
          formData.prioritizationCriteria.regulatory * 0.15
        ).toFixed(2))
      };

      const response = await fetch(`/api/business-processes/${process.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(processData),
      });

      if (response.ok) {
        alert('Proceso actualizado exitosamente');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Error al actualizar proceso'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar proceso');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Proceso</h2>
            {process.processId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ID: <span className="font-mono font-semibold">{process.processId}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Proceso *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Proceso *
                </label>
                <select
                  value={formData.processType}
                  onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CORE">Misional (Core)</option>
                  <option value="STRATEGIC">Estratégico</option>
                  <option value="SUPPORT">Soporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nivel de Criticidad *
                </label>
                <select
                  value={formData.criticalityLevel}
                  onChange={(e) => setFormData({ ...formData, criticalityLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CRITICAL">Crítico</option>
                  <option value="HIGH">Alto</option>
                  <option value="MEDIUM">Medio</option>
                  <option value="LOW">Bajo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeInAnalysis"
                checked={formData.includeInContinuityAnalysis}
                onChange={(e) => setFormData({ ...formData, includeInContinuityAnalysis: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="includeInAnalysis" className="text-sm text-gray-700 dark:text-gray-300">
                Incluir en Análisis de Continuidad
              </label>
            </div>
          </div>

          {/* Criterios de Priorización */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Criterios de Priorización (0-10)</h3>
            
            {[
              { key: 'strategic', label: 'Impacto Estratégico' },
              { key: 'operational', label: 'Impacto Operacional' },
              { key: 'financial', label: 'Impacto Financiero' },
              { key: 'regulatory', label: 'Impacto Regulatorio' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {label}: {formData.prioritizationCriteria[key as keyof typeof formData.prioritizationCriteria]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.prioritizationCriteria[key as keyof typeof formData.prioritizationCriteria]}
                  onChange={(e) => setFormData({
                    ...formData,
                    prioritizationCriteria: {
                      ...formData.prioritizationCriteria,
                      [key]: parseInt(e.target.value)
                    }
                  })}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
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
        </form>
      </div>
    </div>
  );
}
