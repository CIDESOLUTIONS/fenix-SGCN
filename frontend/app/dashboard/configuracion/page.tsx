"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import { getExchangeRates, updateExchangeRates } from "../../../lib/i18n/useCurrency";

export default function ConfiguracionPage() {
  const { t } = useTranslation();
  const [rates, setRates] = useState({ COP: 4000, USD: 1, BRL: 5.30 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRates(getExchangeRates());
  }, []);

  const handleSave = () => {
    updateExchangeRates(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('modules.configuration')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configuración del sistema y preferencias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil de Usuario */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Perfil de Usuario</h3>
          <div className="space-y-4">
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
          </div>
        </div>

        {/* Información de Suscripción */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Suscripción</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Plan Actual:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Plan Profesional (Prueba)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Días Restantes:</span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">26 días</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">5 / 10</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Actualizar Plan
            </button>
          </div>
        </div>

        {/* Tasas de Conversión (Admin) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Tasas de Conversión</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Configuración de tasas de cambio para conversión de monedas</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">✓ Las tasas de conversión se han actualizado correctamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}