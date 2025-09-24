"use client";
import { useState } from "react";

export default function EstrategiaPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'escenarios', label: 'Escenarios de Riesgo' },
    { id: 'estrategias', label: 'Estrategias de Continuidad' },
    { id: 'recursos', label: 'Recursos Necesarios' },
    { id: 'proveedores', label: 'Proveedores Alternos' },
    { id: 'ubicaciones', label: 'Sitios Alternos' },
    { id: 'validacion', label: 'Validación' },
  ];

  const stats = {
    estrategiasDefinidas: 8,
    escenariosCubiertos: 6,
    recursosAsignados: 15,
    sitiosAlternos: 3,
    proveedores: 5
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estrategia de Continuidad</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Definición de estrategias de recuperación y continuidad</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-sm text-green-600 dark:text-green-400 mb-2">Estrategias Definidas</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.estrategiasDefinidas}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Escenarios</h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.escenariosCubiertos}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm text-blue-600 dark:text-blue-400 mb-2">Recursos</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.recursosAsignados}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-sm text-purple-600 dark:text-purple-400 mb-2">Sitios Alternos</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sitiosAlternos}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="text-sm text-orange-600 dark:text-orange-400 mb-2">Proveedores</h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.proveedores}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'resumen' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
          <p className="text-gray-600 dark:text-gray-400">Módulo en desarrollo</p>
        </div>
      )}
    </div>
  );
}