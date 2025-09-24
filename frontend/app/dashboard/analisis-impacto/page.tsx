"use client";
import { useState } from "react";

export default function AnalisisImpactoPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: '📊' },
    { id: 'procesos', label: 'Procesos de Negocio', icon: '⚙️' },
    { id: 'evaluacion', label: 'Evaluación BIA', icon: '📈' },
    { id: 'criticidad', label: 'Análisis de Criticidad', icon: '🎯' },
    { id: 'recursos', label: 'Recursos Críticos', icon: '💼' },
    { id: 'dependencias', label: 'Dependencias', icon: '🔗' },
    { id: 'rto-rpo', label: 'RTO/RPO', icon: '⏱️' },
  ];

  const stats = {
    procesosCriticos: 12,
    procesosEvaluados: 28,
    recursosCriticos: 45,
    rtoPromedio: '4h',
    rpoPromedio: '2h'
  };

  const procesosTop = [
    { nombre: 'Procesamiento de Pagos', criticidad: 'Crítico', rto: '2h', rpo: '30min', impacto: 'Muy Alto' },
    { nombre: 'Atención al Cliente', criticidad: 'Alto', rto: '4h', rpo: '1h', impacto: 'Alto' },
    { nombre: 'Producción Principal', criticidad: 'Alto', rto: '6h', rpo: '2h', impacto: 'Alto' },
  ];

  const evaluacionesPendientes = [
    { proceso: 'Gestión de Inventario', responsable: 'Logística', fecha: '10 de enero, 2026' },
    { proceso: 'Marketing Digital', responsable: 'Marketing', fecha: '15 de enero, 2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Impacto al Negocio (BIA)</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Business Impact Analysis - Identificación de procesos críticos</p>
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <h3 className="text-sm text-red-600 dark:text-red-400 mb-2">Procesos Críticos</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.procesosCriticos}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">identificados</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Evaluados</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.procesosEvaluados}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">procesos totales</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Recursos Críticos</h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.recursosCriticos}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">identificados</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-sm text-green-600 dark:text-green-400 mb-2">RTO Promedio</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.rtoPromedio}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">tiempo objetivo</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm text-blue-600 dark:text-blue-400 mb-2">RPO Promedio</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.rpoPromedio}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">punto de recuperación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Procesos Más Críticos</h3>
              <div className="space-y-3">
                {procesosTop.map((proceso, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{proceso.nombre}</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <span className="text-xs text-gray-500">RTO: {proceso.rto}</span>
                      <span className="text-xs text-gray-500">RPO: {proceso.rpo}</span>
                      <span className="text-xs text-red-600">Impacto: {proceso.impacto}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evaluaciones Pendientes</h3>
              <div className="space-y-3">
                {evaluacionesPendientes.map((evaluacion, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{evaluacion.proceso}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">{evaluacion.responsable}</span>
                        <span className="text-xs text-gray-400">{evaluacion.fecha}</span>
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