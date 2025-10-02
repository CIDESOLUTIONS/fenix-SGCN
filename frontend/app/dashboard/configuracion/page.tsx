"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Sparkles, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

export default function ConfiguracionPage() {
  const { t } = usePreferences();
  const [formData, setFormData] = useState({
    openaiApiKey: "",
    claudeApiKey: "",
    geminiApiKey: "",
    defaultProvider: "openai" as "openai" | "claude" | "gemini",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState({
    openai: false,
    claude: false,
    gemini: false,
  });
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const response = await fetch(`${API_URL}/api/settings/ai-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const config = await response.json();
        setFormData({
          openaiApiKey: config.openaiApiKey || "",
          claudeApiKey: config.claudeApiKey || "",
          geminiApiKey: config.geminiApiKey || "",
          defaultProvider: config.defaultProvider || "openai",
        });
      }
    } catch (err) {
      console.warn('No se pudo cargar configuración existente');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (provider: "openai" | "claude" | "gemini") => {
    setTestingConnection(provider);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const apiKey = provider === 'openai' ? formData.openaiApiKey : 
                    provider === 'claude' ? formData.claudeApiKey : formData.geminiApiKey;
      
      if (!apiKey) {
        alert('Ingrese la API key antes de probar');
        return;
      }

      const response = await fetch(`${API_URL}/api/ai/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider,
          apiKey,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message || 'Error de conexión'}`);
      }
    } catch (err: any) {
      alert(`❌ Error al probar conexión: ${err.message}`);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/settings/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar configuración de IA');
      }

      setSuccess('✅ Configuración de IA guardada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">{t('dashboard')}</Link>
          <span>/</span>
          <span>Configuración</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure las integraciones y ajustes del sistema
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configuración de IA
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure las API keys para los servicios de inteligencia artificial
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Alert sobre configuración */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  🔐 Seguridad de API Keys
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Las API keys se almacenan de forma segura y encriptada. Solo se utilizarán para los análisis FODA con IA dentro de la plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* Proveedor por defecto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proveedor por Defecto
            </label>
            <select
              value={formData.defaultProvider}
              onChange={(e) => setFormData({ ...formData, defaultProvider: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="claude">Anthropic (Claude)</option>
              <option value="gemini">Google (Gemini)</option>
            </select>
          </div>

          {/* OpenAI Configuration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">OpenAI (ChatGPT)</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Potente análisis de texto y estrategias</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={formData.openaiApiKey}
                  onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => testConnection('openai')}
                disabled={!formData.openaiApiKey || testingConnection === 'openai'}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {testingConnection === 'openai' ? 'Probando...' : 'Probar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Obtenga su API key en: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-purple-600 hover:underline">platform.openai.com</a>
            </p>
          </div>

          {/* Claude Configuration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Anthropic (Claude)</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Análisis profundo y razonamiento estructurado</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type={showKeys.claude ? "text" : "password"}
                  value={formData.claudeApiKey}
                  onChange={(e) => setFormData({ ...formData, claudeApiKey: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowKeys({ ...showKeys, claude: !showKeys.claude })}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.claude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => testConnection('claude')}
                disabled={!formData.claudeApiKey || testingConnection === 'claude'}
                className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
              >
                {testingConnection === 'claude' ? 'Probando...' : 'Probar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Obtenga su API key en: <a href="https://console.anthropic.com/" target="_blank" className="text-purple-600 hover:underline">console.anthropic.com</a>
            </p>
          </div>

          {/* Gemini Configuration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Google (Gemini)</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Análisis multimodal y procesamiento avanzado</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type={showKeys.gemini ? "text" : "password"}
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIza..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => testConnection('gemini')}
                disabled={!formData.geminiApiKey || testingConnection === 'gemini'}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {testingConnection === 'gemini' ? 'Probando...' : 'Probar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Obtenga su API key en: <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-purple-600 hover:underline">makersuite.google.com</a>
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              💡 Consejos para mejores resultados
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• Configure al menos una API key para usar análisis con IA</li>
              <li>• Claude es excelente para análisis estratégicos profundos</li>
              <li>• OpenAI es versátil para todo tipo de análisis</li>
              <li>• Gemini ofrece análisis multimodal avanzado</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Configuración
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          📌 Configuraciones Futuras
        </h3>
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          Próximamente podrás configurar integraciones con ITSM, notificaciones, webhooks y más opciones del sistema desde esta página.
        </p>
      </div>
    </div>
  );
}
