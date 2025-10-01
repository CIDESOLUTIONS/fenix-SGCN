"use client";
import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, FileText, Target } from "lucide-react";

export default function MantenimientoPage() {
  const [activeTab, setActiveTab] = useState<'findings' | 'capa' | 'review' | 'kpis'>('findings');

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 7: Mejora Continua</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mejora Continua
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 10 - Cierre del ciclo PDCA con CAPA y KPIs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hallazgos Abiertos</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Acciones en Curso</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Completadas</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Efectividad CAPA</span>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            {[
              { id: 'findings', icon: AlertCircle, label: 'Registro de Hallazgos' },
              { id: 'capa', icon: Target, label: 'Flujo CAPA' },
              { id: 'review', icon: FileText, label: 'Revisión Dirección' },
              { id: 'kpis', icon: BarChart3, label: 'KPIs y Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'findings' && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No hay hallazgos registrados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Los hallazgos se generan automáticamente desde Módulo 6 (Pruebas)
              </p>
            </div>
          )}
          {activeTab === 'capa' && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-12 text-center">
              <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sistema CAPA Automatizado</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Flujo estructurado: Análisis causa raíz → Plan acción → Verificación eficacia
              </p>
            </div>
          )}
          {activeTab === 'review' && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-8 text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Dashboard Revisión por la Dirección</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">ISO 22301 Cláusula 9.3 - Recopilación automática</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Generar Paquete de Revisión
              </button>
            </div>
          )}
          {activeTab === 'kpis' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Cobertura Programa', value: '0%', icon: TrendingUp, color: 'text-green-600' },
                { label: 'Tiempo Medio CAPA', value: '-', icon: Clock, color: 'text-orange-600' },
                { label: 'Tasa Éxito Ejercicios', value: '-', icon: CheckCircle, color: 'text-green-600' },
                { label: 'Madurez SGCN', value: 'Inicial', icon: BarChart3, color: 'text-indigo-600' },
                { label: 'Actualidad Planes', value: '0%', icon: FileText, color: 'text-blue-600' },
                { label: 'Cumplimiento Objetivos', value: '0%', icon: Target, color: 'text-purple-600' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{kpi.label}</h3>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          ✅ Ciclo PDCA Completado
        </h3>
        <p className="text-green-800 dark:text-green-200 mb-4">
          El Módulo 7 cierra el ciclo de mejora continua ISO 22301
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-bold text-green-600 mb-1">PLAN</p>
            <p className="text-gray-600 dark:text-gray-400">Módulos 1-4</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-bold text-blue-600 mb-1">DO</p>
            <p className="text-gray-600 dark:text-gray-400">Módulo 5</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-bold text-orange-600 mb-1">CHECK</p>
            <p className="text-gray-600 dark:text-gray-400">Módulo 6</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-bold text-purple-600 mb-1">ACT</p>
            <p className="text-gray-600 dark:text-gray-400">Módulo 7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
