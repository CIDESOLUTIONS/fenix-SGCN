"use client";
import { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function PruebasPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'planificacion', label: 'Planificación' },
    { id: 'ejercicios', label: 'Ejercicios y Simulacros' },
    { id: 'resultados', label: 'Resultados' },
    { id: 'lecciones', label: 'Lecciones Aprendidas' },
    { id: 'mejoras', label: 'Plan de Mejora' },
    { id: 'reportes', label: 'Reportes' },
  ];

  const stats = {
    pruebasRealizadas: 12,
    proximaPrueba: '15 Ene 2026',
    exitosas: 10,
    leccionesAprendidas: 18,
    mejorasImplementadas: 15
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pruebas de Continuidad</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ejercicios y simulacros de continuidad del negocio</p>
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
                <h3 className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Pruebas Realizadas</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.pruebasRealizadas}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm text-blue-600 dark:text-blue-400 mb-2">Próxima Prueba</h3>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.proximaPrueba}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-sm text-green-600 dark:text-green-400 mb-2">Exitosas</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.exitosas}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">Lecciones</h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.leccionesAprendidas}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm text-purple-600 dark:text-purple-400 mb-2">Mejoras</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.mejorasImplementadas}</p>
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
    </DashboardLayout>
  );
}
