"use client";
import { useState } from "react";

export default function PlanesPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'bcp', label: 'Plan de Continuidad (BCP)' },
    { id: 'drp', label: 'Plan de Recuperación (DRP)' },
    { id: 'irp', label: 'Respuesta a Incidentes (IRP)' },
    { id: 'crisis', label: 'Gestión de Crisis' },
    { id: 'comunicacion', label: 'Plan de Comunicación' },
    { id: 'documentos', label: 'Documentos' },
  ];

  const stats = {
    planesActivos: 8,
    enDesarrollo: 3,
    aprobados: 5,
    ultimaRevision: '15/11/25',
    cumplimiento: 85
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planes de Continuidad</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Documentación y gestión de planes de continuidad del negocio</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Planes Activos</h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.planesActivos}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">En Desarrollo</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.enDesarrollo}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-sm text-green-600 dark:text-green-400 mb-2">Aprobados</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.aprobados}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm text-blue-600 dark:text-blue-400 mb-2">Última Revisión</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.ultimaRevision}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-sm text-purple-600 dark:text-purple-400 mb-2">Cumplimiento</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.cumplimiento}%</p>
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