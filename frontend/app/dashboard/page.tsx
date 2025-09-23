"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useTranslation } from "../../lib/i18n/useTranslation";
import { useCurrency } from "../../lib/i18n/useCurrency";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  
  const [stats, setStats] = useState({
    procesosCriticos: 12,
    riesgosAltosCriticos: 5,
    planesDesarrollados: 8,
    ultimaPrueba: '15/11/25',
    planActivo: 'Plan Profesional (Prueba) - 26 días restantes'
  });

  return (
    <DashboardLayout>
      {/* Banner de Plan */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span className="text-sm text-indigo-900 dark:text-indigo-100">
            🎯 {stats.planActivo}
          </span>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">
          Ver Planes
        </button>
      </div>

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fenix SGCN</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.systemActive')}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.welcome')}, Juan</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('dashboard.viewConsolidated')}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.criticalProcesses')}</h3>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.procesosCriticos}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.identifiedInBIA')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.highCriticalRisks')}</h3>
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.riesgosAltosCriticos}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.treatmentAreas')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.developedPlans')}</h3>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.planesDesarrollados}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.pendingApproval')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.lastTest')}</h3>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.ultimaPrueba}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.nextIn90Days')}</p>
        </div>
      </div>

      {/* Charts - resto del código igual... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Criticidad de Procesos por RTO</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Tiempo objetivo de recuperación por área</p>
          <div className="h-64 flex items-end justify-around gap-2">
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '75%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">Comercial</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '60%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">TI</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '65%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">Operaciones</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '55%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">RRHH</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '70%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">Financiero</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full bg-indigo-600 rounded-t" style={{height: '30%'}}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 rotate-45 origin-left">Legal</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Matriz de Riesgos (Residual)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Probabilidad vs Impacto</p>
          <div className="relative h-64">
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="absolute" style={{left: '20%', top: '60%'}}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="absolute" style={{left: '40%', top: '30%'}}>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="absolute" style={{left: '70%', top: '20%'}}>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="absolute" style={{left: '80%', top: '40%'}}>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advisor - resto igual... */}
    </DashboardLayout>
  );
}
