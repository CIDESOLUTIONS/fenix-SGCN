"use client";
import React, { useState } from "react";
import { X, Save, Plus, Trash2, Lightbulb } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

interface SwotEditorProps {
  contextId: string;
  onSuccess: () => void;
}

export default function SwotEditor({ contextId, onSuccess }: SwotEditorProps) {
  const { t } = usePreferences();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    facilitator: "",
    participants: [] as string[],
    strengths: [""] as string[],
    weaknesses: [""] as string[],
    opportunities: [""] as string[],
    threats: [""] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState("");

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

      const response = await fetch(`${API_URL}/api/business-context/swot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error('Error al crear análisis FODA');
      }

      onSuccess();
      alert('Análisis FODA creado exitosamente');
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
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
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
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('swot_analysis')}
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('title')} *
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
            {t('description')}
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
          {renderCategory('strengths', t('strengths'), 'border-green-500', 'bg-green-50 dark:bg-green-900/20')}
          {renderCategory('weaknesses', t('weaknesses'), 'border-red-500', 'bg-red-50 dark:bg-red-900/20')}
          {renderCategory('opportunities', t('opportunities'), 'border-blue-500', 'bg-blue-50 dark:bg-blue-900/20')}
          {renderCategory('threats', t('threats'), 'border-orange-500', 'bg-orange-50 dark:bg-orange-900/20')}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('save')} Análisis FODA
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
