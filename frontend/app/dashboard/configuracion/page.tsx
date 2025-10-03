"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  CreditCard, 
  DollarSign, 
  Sparkles,
  Save,
  Eye,
  EyeOff,
  AlertTriangle 
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getExchangeRates, updateExchangeRates } from "@/lib/i18n/useCurrency";

export default function ConfiguracionPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'currencies' | 'ai'>('profile');
  
  // Estados para tasas de cambio
  const [rates, setRates] = useState({ COP: 4000, USD: 1, BRL: 5.30 });
  const [saved, setSaved] = useState(false);

  // Estados para IA
  const [aiFormData, setAiFormData] = useState({
    openaiApiKey: "",
    claudeApiKey: "",
    geminiApiKey: "",
    defaultProvider: "openai" as "openai" | "claude" | "gemini",
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [savingAI, setSavingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState({
    openai: false,
    claude: false,
    gemini: false,
  });
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    setRates(getExchangeRates());
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') {
      fetchAIConfig();
    }
  }, [activeTab]);

  const handleSave = () => {
    updateExchangeRates(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fetchAIConfig = async () => {
    setLoadingAI(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const response = await fetch(`${API_URL}/api/settings/ai-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const config = await response.json();
        setAiFormData({
          openaiApiKey: config.openaiApiKey || "",
          claudeApiKey: config.claudeApiKey || "",
          geminiApiKey: config.geminiApiKey || "",
          defaultProvider: config.defaultProvider || "openai",
        });
      }
    } catch (err) {
      console.warn('No se pudo cargar configuración de IA');
    } finally {
      setLoadingAI(false);
    }
  };

  const testConnection = async (provider: "openai" | "claude" | "gemini") => {
    setTestingConnection(provider);
    setAiError(null);
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const apiKey = provider === 'openai' ? aiFormData.openaiApiKey : 
                    provider === 'claude' ? aiFormData.claudeApiKey : aiFormData.geminiApiKey;
      
      if (!apiKey || apiKey.includes('***')) {
        alert('Por favor ingrese una API key válida antes de probar');
        setTestingConnection(null);
        return;
      }

      const response = await fetch(`${API_URL}/api/ai/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ provider, apiKey }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message || 'Error de conexión'}`);
      }
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleSubmitAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAI(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/settings/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(aiFormData),
      });

      if (!response.ok) throw new Error('Error al guardar configuración de IA');

      setAiSuccess('✅ Configuración de IA guardada exitosamente');
      setTimeout(() => setAiSuccess(null), 3000);
      await fetchAIConfig();
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setSavingAI(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Configuración</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configuración del sistema y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil de Usuario
              </div>
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'subscription' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Suscripción
              </div>
            </button>
            <button
              onClick={() => setActiveTab('currencies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'currencies' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Tasas de Conversión
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'ai' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Inteligencia Artificial
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content - Profile */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Perfil de Usuario</h3>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                <input type="text" defaultValue="Juan Perez" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" defaultValue="juan@empresa.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                <input type="text" defaultValue="Administrador de Sistema" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Tab Content - Subscription */}
        {activeTab === 'subscription' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Suscripción</h3>
            <div className="space-y-3 max-w-2xl">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plan Actual:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Plan Profesional (Prueba)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Días Restantes:</span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">26 días</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">5 / 10</span>
              </div>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Actualizar Plan
              </button>
            </div>
          </div>
        )}

        {/* Tab Content - Currencies */}
        {activeTab === 'currencies' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">⚙️ Tasas de Conversión</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Configuración de tasas de cambio para conversión de monedas
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 max-w-4xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pesos Colombianos (COP) por USD
                </label>
                <input
                  type="number"
                  value={rates.COP}
                  onChange={(e) => setRates({...rates, COP: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dólar USD (Base)
                </label>
                <input
                  type="number"
                  value={rates.USD}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reales Brasileños (BRL) por USD
                </label>
                <input
                  type="number"
                  value={rates.BRL}
                  onChange={(e) => setRates({...rates, BRL: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {saved ? '✓ Guardado' : 'Guardar Tasas'}
            </button>

            {saved && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg max-w-4xl">
                <p className="text-sm text-green-800 dark:text-green-200">✓ Las tasas de conversión se han actualizado correctamente</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content - AI */}
        {activeTab === 'ai' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Configuración de Inteligencia Artificial
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Configure las API keys para los servicios de IA
            </p>

            {loadingAI ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmitAI} className="space-y-6">
                {aiError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
                  </div>
                )}

                {aiSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400">{aiSuccess}</p>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        🔐 Seguridad de API Keys
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Las API keys se almacenan de forma segura y encriptada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proveedor por Defecto
                  </label>
                  <select
                    value={aiFormData.defaultProvider}
                    onChange={(e) => setAiFormData({ ...aiFormData, defaultProvider: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="openai">OpenAI (ChatGPT)</option>
                    <option value="claude">Anthropic (Claude)</option>
                    <option value="gemini">Google (Gemini)</option>
                  </select>
                </div>

                {/* OpenAI */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">OpenAI (ChatGPT)</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Análisis de texto y estrategias</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.openai ? "text" : "password"}
                      value={aiFormData.openaiApiKey}
                      onChange={(e) => setAiFormData({ ...aiFormData, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
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
                      disabled={!aiFormData.openaiApiKey || testingConnection === 'openai' || aiFormData.openaiApiKey.includes('***')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                      {testingConnection === 'openai' ? 'Probando...' : 'Probar'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Obtener API key</a>
                  </p>
                </div>

                {/* Claude */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Anthropic (Claude)</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Análisis profundo</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.claude ? "text" : "password"}
                      value={aiFormData.claudeApiKey}
                      onChange={(e) => setAiFormData({ ...aiFormData, claudeApiKey: e.target.value })}
                      placeholder="sk-ant-..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
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
                      disabled={!aiFormData.claudeApiKey || testingConnection === 'claude' || aiFormData.claudeApiKey.includes('***')}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                      {testingConnection === 'claude' ? 'Probando...' : 'Probar'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Obtener API key</a>
                  </p>
                </div>

                {/* Gemini */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Google (Gemini)</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Análisis multimodal</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.gemini ? "text" : "password"}
                      value={aiFormData.geminiApiKey}
                      onChange={(e) => setAiFormData({ ...aiFormData, geminiApiKey: e.target.value })}
                      placeholder="AIza..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
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
                      disabled={!aiFormData.geminiApiKey || testingConnection === 'gemini' || aiFormData.geminiApiKey.includes('***')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                      {testingConnection === 'gemini' ? 'Probando...' : 'Probar'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Obtener API key</a>
                  </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={savingAI}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {savingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
