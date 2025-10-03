"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Lightbulb, Sparkles, Loader } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AIAnalysisModal from "./AIAnalysisModal";

interface SwotEditorProps {
  contextId: string;
  onSuccess: () => void;
  existingSwot?: {
    id: string;
    contextId?: string;
    title: string;
    description: string;
    facilitator: string;
    participants: string[];
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    crossingAnalysis?: string;
  };
}

export default function SwotEditor({ contextId, onSuccess, existingSwot }: SwotEditorProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    facilitator: "",
    participants: [] as string[],
    strengths: [""] as string[],
    weaknesses: [""] as string[],
    opportunities: [""] as string[],
    threats: [""] as string[],
    crossingAnalysis: "",
  });
  const [loading, setLoading] = useState(false);
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [contextData, setContextData] = useState<any>(null);

  useEffect(() => {
    if (existingSwot) {
      setFormData({
        title: existingSwot.title || "",
        description: existingSwot.description || "",
        facilitator: existingSwot.facilitator || "",
        participants: existingSwot.participants || [],
        strengths: (existingSwot.strengths && existingSwot.strengths.length) ? existingSwot.strengths : [""],
        weaknesses: (existingSwot.weaknesses && existingSwot.weaknesses.length) ? existingSwot.weaknesses : [""],
        opportunities: (existingSwot.opportunities && existingSwot.opportunities.length) ? existingSwot.opportunities : [""],
        threats: (existingSwot.threats && existingSwot.threats.length) ? existingSwot.threats : [""],
        crossingAnalysis: existingSwot.crossingAnalysis || "",
      });
      setIsEditMode(true);
    } else {
      // Reset form cuando no hay existingSwot
      setFormData({
        title: "",
        description: "",
        facilitator: "",
        participants: [],
        strengths: [""],
        weaknesses: [""],
        opportunities: [""],
        threats: [""],
        crossingAnalysis: "",
      });
      setIsEditMode(false);
    }
  }, [existingSwot]);

  const addItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], ""]
    }));
  };

  const updateItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant("");
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const analyzeWithAI = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      // Obtener el contexto de negocio
      const contextRes = await fetch(`${API_URL}/api/business-context/contexts/${contextId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!contextRes.ok) throw new Error('Error al obtener contexto');
      const context = await contextRes.json();

      setContextData(context);
      setShowAIModal(true);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contexto para análisis IA');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const cleanedData = {
        ...formData,
        contextId,
        strengths: formData.strengths.filter(s => s.trim()),
        weaknesses: formData.weaknesses.filter(w => w.trim()),
        opportunities: formData.opportunities.filter(o => o.trim()),
        threats: formData.threats.filter(t => t.trim()),
      };

      let response;
      if (isEditMode && existingSwot) {
        response = await fetch(`${API_URL}/api/business-context/swot/${existingSwot.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedData),
        });
      } else {
        response = await fetch(`${API_URL}/api/business-context/swot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedData),
        });
      }

      if (!response.ok) {
        throw new Error(`Error al ${isEditMode ? 'actualizar' : 'crear'} análisis FODA`);
      }

      onSuccess();
      alert(`Análisis FODA ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (
    category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
    label: string,
    color: string,
    bgColor: string
  ) => (
    <div className={`${bgColor} border-2 ${color} rounded-lg p-4`}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{label}</h4>
      <div className="space-y-2">
        {formData[category].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(category, index, e.target.value)}
              placeholder={`${label} #${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(category, index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(category)}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Agregar {label.toLowerCase()}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Editar' : 'Crear'} Análisis FODA
          </h3>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Análisis FODA 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facilitador *
            </label>
            <input
              type="text"
              required
              value={formData.facilitator}
              onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nombre del facilitador"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Participantes
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              placeholder="Nombre del participante"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={addParticipant}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.participants.map((p, idx) => (
              <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {p}
                <button type="button" onClick={() => removeParticipant(idx)} className="text-red-600 hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>💡 Matriz FODA:</strong> Identifique factores internos (Fortalezas/Debilidades) 
            y externos (Oportunidades/Amenazas) para desarrollar estrategias efectivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCategory('strengths', 'Fortalezas', 'border-green-500', 'bg-green-50 dark:bg-green-900/20')}
          {renderCategory('weaknesses', 'Debilidades', 'border-red-500', 'bg-red-50 dark:bg-red-900/20')}
          {renderCategory('opportunities', 'Oportunidades', 'border-blue-500', 'bg-blue-50 dark:bg-blue-900/20')}
          {renderCategory('threats', 'Amenazas', 'border-orange-500', 'bg-orange-50 dark:bg-orange-900/20')}
        </div>

        {/* Sección de Análisis con IA */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                ✨ Análisis de Cruzamientos FODA
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilice IA para identificar estrategias basadas en los cruzamientos FODA
              </p>
            </div>
            <button
              type="button"
              onClick={analyzeWithAI}
              disabled={analyzingWithAI || !formData.strengths.some(s => s.trim()) || !formData.weaknesses.some(w => w.trim())}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {analyzingWithAI ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analizar con IA
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Análisis de Cruzamientos
            </label>
            <textarea
              rows={8}
              value={formData.crossingAnalysis}
              onChange={(e) => setFormData({ ...formData, crossingAnalysis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="El análisis de cruzamientos aparecerá aquí después de usar la IA, o puede ingresarlo manualmente..."
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 Estrategias FO (Fortalezas-Oportunidades), FA (Fortalezas-Amenazas), 
              DO (Debilidades-Oportunidades), DA (Debilidades-Amenazas)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? 'Actualizar' : 'Guardar'} Análisis FODA
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal de Análisis IA */}
      {showAIModal && contextData && (
        <AIAnalysisModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          contextContent={contextData.content}
          contextTitle={contextData.title}
          swotData={{
            strengths: formData.strengths.filter(s => s.trim()),
            weaknesses: formData.weaknesses.filter(w => w.trim()),
            opportunities: formData.opportunities.filter(o => o.trim()),
            threats: formData.threats.filter(t => t.trim()),
          }}
          onAnalysisComplete={(analysis) => {
            setFormData(prev => ({ ...prev, crossingAnalysis: analysis }));
            setShowAIModal(false);
          }}
        />
      )}
    </div>
  );
}
