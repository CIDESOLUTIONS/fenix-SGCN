"use client";
import React, { useState } from "react";
import { Upload, Save, X } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useTranslation } from '@/hooks/useTranslation';

interface BusinessProcessEditorProps {
  onSuccess: () => void;
}

export default function BusinessProcessEditor({ onSuccess }: BusinessProcessEditorProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Si hay archivo, subirlo primero
      if (uploadedFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', uploadedFile);
        formDataFile.append('category', 'business-process');

        const uploadRes = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataFile,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileUrl = uploadData.fileUrl;
          fileName = uploadedFile.name;
          fileSize = uploadedFile.size;
        }
      }

      // Crear el proceso
      const processData = {
        ...formData,
        fileUrl,
        fileName,
        fileSize,
        // Calcular priorityScore en el frontend
        priorityScore: parseFloat((
          formData.prioritizationCriteria.strategic * 0.30 +
          formData.prioritizationCriteria.operational * 0.30 +
          formData.prioritizationCriteria.financial * 0.25 +
          formData.prioritizationCriteria.regulatory * 0.15
        ).toFixed(2))
      };

      const response = await fetch('/api/business-processes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(processData),
      });

      if (response.ok) {
        alert('Proceso creado exitosamente');
        setShowForm(false);
        setFormData({
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
        setUploadedFile(null);
        onSuccess(); // Llamar inmediatamente
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Error al crear proceso'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear proceso');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Nuevo Proceso de Negocio
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nuevo Proceso de Negocio</h3>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del Proceso *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Ej: Gestión de Ventas"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Descripción breve del proceso"
          />
        </div>

        {/* Caracterización de Alto Nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Caracterización de Alto Nivel
          </label>
          <textarea
            value={formData.highLevelCharacterization}
            onChange={(e) => setFormData({ ...formData, highLevelCharacterization: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Describa el proceso a alto nivel: objetivo, entradas, salidas, recursos clave..."
          />
        </div>

        {/* Tipo de Proceso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Proceso *
          </label>
          <select
            required
            value={formData.processType}
            onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="STRATEGIC">Estratégico</option>
            <option value="CORE">Misional</option>
            <option value="SUPPORT">Soporte</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <strong>Estratégico:</strong> Dirección y estrategia | <strong>Misional:</strong> Generación de valor | <strong>Soporte:</strong> Apoyo y recursos
          </p>
        </div>

        {/* Nivel de Criticidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nivel de Criticidad *
          </label>
          <select
            required
            value={formData.criticalityLevel}
            onChange={(e) => setFormData({ ...formData, criticalityLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="CRITICAL">Crítico</option>
            <option value="HIGH">Alto</option>
            <option value="MEDIUM">Medio</option>
            <option value="LOW">Bajo</option>
          </select>
        </div>

        {/* Incluir en Análisis */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <input
            type="checkbox"
            id="includeInAnalysis"
            checked={formData.includeInContinuityAnalysis}
            onChange={(e) => setFormData({ ...formData, includeInContinuityAnalysis: e.target.checked })}
            className="w-5 h-5 text-indigo-600 rounded"
          />
          <label htmlFor="includeInAnalysis" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
            Incluir en Análisis de Continuidad (ARA, BIA, Estrategias, Planes)
          </label>
        </div>

        {/* Criterios de Priorización */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Criterios de Priorización</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Valore cada criterio de 0 a 10 según su importancia</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estratégico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Impacto Estratégico: {formData.prioritizationCriteria.strategic}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.prioritizationCriteria.strategic}
                onChange={(e) => setFormData({
                  ...formData,
                  prioritizationCriteria: {
                    ...formData.prioritizationCriteria,
                    strategic: parseInt(e.target.value)
                  }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Operacional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Impacto Operacional: {formData.prioritizationCriteria.operational}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.prioritizationCriteria.operational}
                onChange={(e) => setFormData({
                  ...formData,
                  prioritizationCriteria: {
                    ...formData.prioritizationCriteria,
                    operational: parseInt(e.target.value)
                  }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Financiero */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Impacto Financiero: {formData.prioritizationCriteria.financial}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.prioritizationCriteria.financial}
                onChange={(e) => setFormData({
                  ...formData,
                  prioritizationCriteria: {
                    ...formData.prioritizationCriteria,
                    financial: parseInt(e.target.value)
                  }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Regulatorio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Impacto Regulatorio: {formData.prioritizationCriteria.regulatory}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.prioritizationCriteria.regulatory}
                onChange={(e) => setFormData({
                  ...formData,
                  prioritizationCriteria: {
                    ...formData.prioritizationCriteria,
                    regulatory: parseInt(e.target.value)
                  }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Score Estimado:</strong> {(
                formData.prioritizationCriteria.strategic * 0.30 +
                formData.prioritizationCriteria.operational * 0.30 +
                formData.prioritizationCriteria.financial * 0.25 +
                formData.prioritizationCriteria.regulatory * 0.15
              ).toFixed(2)} / 10
            </p>
          </div>
        </div>

        {/* Upload de Archivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Archivo de Caracterización (Opcional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {uploadedFile && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Proceso
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
