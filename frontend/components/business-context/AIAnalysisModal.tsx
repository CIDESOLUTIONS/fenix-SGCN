"use client";
import React, { useState } from 'react';
import { X, Sparkles, Send, Loader } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextContent: string;
  contextTitle: string;
  swotData: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  onAnalysisComplete: (analysis: string) => void;
}

export default function AIAnalysisModal({
  isOpen,
  onClose,
  contextContent,
  contextTitle,
  swotData,
  onAnalysisComplete
}: AIAnalysisModalProps) {
  const [prompt, setPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      // Generar prompt inicial
      const initialPrompt = `Contexto Organizacional: "${contextTitle}"

${contextContent}

Análisis FODA identificado:

FORTALEZAS:
${swotData.strengths.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

DEBILIDADES:
${swotData.weaknesses.filter(w => w.trim()).map((w, i) => `${i + 1}. ${w}`).join('\n')}

OPORTUNIDADES:
${swotData.opportunities.filter(o => o.trim()).map((o, i) => `${i + 1}. ${o}`).join('\n')}

AMENAZAS:
${swotData.threats.filter(t => t.trim()).map((t, i) => `${i + 1}. ${t}`).join('\n')}

---

Por favor, analiza este FODA y genera estrategias de cruzamiento:
- Estrategias FO (Fortalezas-Oportunidades): Cómo usar fortalezas para aprovechar oportunidades
- Estrategias FA (Fortalezas-Amenazas): Cómo usar fortalezas para mitigar amenazas
- Estrategias DO (Debilidades-Oportunidades): Cómo superar debilidades aprovechando oportunidades
- Estrategias DA (Debilidades-Amenazas): Cómo reducir debilidades y evitar amenazas

Proporciona al menos 2 estrategias para cada cuadrante, siendo específico y accionable.`;

      setPrompt(initialPrompt);
      setResult('');
      setError(null);
    }
  }, [isOpen, contextTitle, contextContent, swotData]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setResult('');

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          context: 'swot_analysis'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al analizar con IA');
      }

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setResult(data.analysis);
      } else {
        throw new Error(data.message || 'No se recibió análisis de la IA');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error en análisis IA:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onAnalysisComplete(result);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Análisis FODA con Inteligencia Artificial
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Edita el prompt y genera estrategias de cruzamiento
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Prompt Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt para la IA (editable)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={12}
              disabled={analyzing}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm disabled:opacity-50"
              placeholder="Edita el prompt para ajustar el análisis..."
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 Puedes editar este prompt para personalizar el análisis según tus necesidades
            </p>
          </div>

          {/* Analyze Button */}
          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {analyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generar Análisis con IA
                </>
              )}
            </button>
          )}

          {/* Result */}
          {result && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Resultado del Análisis
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-indigo-800 dark:text-indigo-200 font-sans">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={analyzing}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          {result && (
            <>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Re-analizar
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Aplicar Análisis
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
