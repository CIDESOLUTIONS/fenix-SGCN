"use client";
import { useState } from "react";

export default function PlaneacionPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: '📋' },
    { id: 'politicas', label: 'Políticas y Procedimientos', icon: '📜' },
    { id: 'objetivos', label: 'Objetivos Estratégicos', icon: '🎯' },
    { id: 'estructura', label: 'Estructura Organizacional', icon: '👥' },
    { id: 'procesos', label: 'Procesos Críticos', icon: '⚙️' },
    { id: 'recursos', label: 'Recursos y Presupuesto', icon: '💰' },
    { id: 'cronograma', label: 'Cronograma', icon: '📅' },
  ];

  const stats = {
    politicasActivas: 1,
    objetivosPendientes: 1,
    rolesDefinidos: 1,
    progresoGeneral: 35
  };

  const actividadesRecientes = [
    { tipo: 'success', titulo: 'Política actualizada', tiempo: 'Hace 2 horas' },
    { tipo: 'info', titulo: 'Nuevo objetivo creado', tiempo: 'Hace 1 día' },
    { tipo: 'warning', titulo: 'Rol asignado', tiempo: 'Hace 3 días' },
  ];

  const proximasFechas = [
    { titulo: 'Revisión de políticas', fecha: '31 de diciembre, 2024', tipo: 'politica' },
    { titulo: 'Objetivo: SGCN completo', fecha: '31 de diciembre, 2024', tipo: 'objetivo' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Módulo de Planeación</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Planificación Estratégica de Continuidad de Negocio</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Políticas Activas</h3>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.politicasActivas}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">de 1 totales</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Objetivos Pendientes</h3>
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.objetivosPendientes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">de 1 totales</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Roles Definidos</h3>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rolesDefinidos}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">roles configurados</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Progreso General</h3>
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.progresoGeneral}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">completado</p>
            </div>
          </div>

          {/* Activities and Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividades Recientes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividades Recientes</h3>
              <div className="space-y-3">
                {actividadesRecientes.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      act.tipo === 'success' ? 'bg-green-500' : 
                      act.tipo === 'info' ? 'bg-blue-500' : 
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{act.titulo}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{act.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas Fechas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximas Fechas Importantes</h3>
              <div className="space-y-3">
                {proximasFechas.map((fecha, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 ${fecha.tipo === 'politica' ? 'text-red-500' : 'text-orange-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{fecha.titulo}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{fecha.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs - Placeholder */}
      {activeTab !== 'resumen' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-4xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Módulo en desarrollo</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Comenzar Configuración
          </button>
        </div>
      )}
    </div>
  );
}
