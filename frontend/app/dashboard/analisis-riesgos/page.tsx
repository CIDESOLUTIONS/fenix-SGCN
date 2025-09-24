"use client";
import { useState } from "react";

export default function AnalisisRiesgosPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: '📊' },
    { id: 'identificacion', label: 'Identificación de Riesgos', icon: '🔍' },
    { id: 'evaluacion', label: 'Evaluación', icon: '📈' },
    { id: 'matriz', label: 'Matriz de Riesgos', icon: '📋' },
    { id: 'controles', label: 'Controles', icon: '🛡️' },
    { id: 'tratamiento', label: 'Plan de Tratamiento', icon: '📝' },
    { id: 'monitoreo', label: 'Monitoreo', icon: '👁️' },
  ];

  const stats = {
    riesgosIdentificados: 24,
    criticos: 3,
    altos: 8,
    tratados: 15,
    controlesActivos: 42
  };

  const riesgosRecientes = [
    { tipo: 'critico', titulo: 'Falla de infraestructura TI', probabilidad: 'Alta', impacto: 'Crítico', tiempo: 'Hace 1 día' },
    { tipo: 'alto', titulo: 'Pérdida de datos críticos', probabilidad: 'Media', impacto: 'Alto', tiempo: 'Hace 3 días' },
    { tipo: 'medio', titulo: 'Interrupción de suministro', probabilidad: 'Baja', impacto: 'Medio', tiempo: 'Hace 1 semana' },
  ];

  const accionesPendientes = [
    { titulo: 'Implementar backup redundante', responsable: 'TI', fecha: '15 de diciembre, 2025' },
    { titulo: 'Auditoría de seguridad', responsable: 'Seguridad', fecha: '20 de diciembre, 2025' },
    { titulo: 'Plan de contingencia energía', responsable: 'Operaciones', fecha: '30 de diciembre, 2025' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Riesgos (ARA)</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Identificación y evaluación de riesgos de continuidad</p>
      </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400">Total Riesgos</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.riesgosIdentificados}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">identificados</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-red-600 dark:text-red-400">Críticos</h3>
                </div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.criticos}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">requieren atención</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-orange-600 dark:text-orange-400">Altos</h3>
                </div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.altos}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">en seguimiento</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-green-600 dark:text-green-400">Tratados</h3>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.tratados}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">controles aplicados</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-indigo-600 dark:text-indigo-400">Controles</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.controlesActivos}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">activos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riesgos Recientes</h3>
                <div className="space-y-3">
                  {riesgosRecientes.map((riesgo, idx) => (
                    <div key={idx} className="border-l-4 pl-4 py-2" style={{ borderColor: riesgo.tipo === 'critico' ? '#EF4444' : riesgo.tipo === 'alto' ? '#F97316' : '#FCD34D' }}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{riesgo.titulo}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">Prob: {riesgo.probabilidad}</span>
                        <span className="text-xs text-gray-500">Impacto: {riesgo.impacto}</span>
                        <span className="text-xs text-gray-400">{riesgo.tiempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Pendientes</h3>
                <div className="space-y-3">
                  {accionesPendientes.map((accion, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{accion.titulo}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-gray-500">{accion.responsable}</span>
                          <span className="text-xs text-gray-400">{accion.fecha}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
