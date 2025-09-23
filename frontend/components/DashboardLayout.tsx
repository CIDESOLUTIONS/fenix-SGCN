"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SettingsMenu from "./settings/SettingsMenu";
import { useTranslation } from "../lib/i18n/useTranslation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('common.systemModules') || "Módulos del Sistema",
      items: [
        { icon: "📋", label: `1. ${t('modules.planning')}`, href: "/dashboard/planeacion" },
        { icon: "📊", label: `2. ${t('modules.riskAnalysis')} ARA`, href: "/dashboard/analisis-riesgos" },
        { icon: "🎯", label: `3. ${t('modules.impactAnalysis')} BIA`, href: "/dashboard/analisis-impacto" },
        { icon: "🔄", label: `4. ${t('modules.strategy')}`, href: "/dashboard/estrategia" },
        { icon: "📝", label: `5. ${t('modules.plans')}`, href: "/dashboard/planes" },
        { icon: "✅", label: `6. ${t('modules.tests')}`, href: "/dashboard/pruebas" },
        { icon: "🔧", label: `7. ${t('modules.maintenance')}`, href: "/dashboard/mantenimiento" },
      ]
    },
    {
      title: t('common.tools') || "Herramientas",
      items: [
        { icon: "📂", label: t('modules.criteria'), href: "/dashboard/criterios" },
        { icon: "⚙️", label: t('modules.configuration'), href: "/dashboard/configuracion" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">SGCN</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">CIDE SAS</div>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto">S</div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Menu */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Panel de Control Link */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              pathname === '/dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">🏠</span>
            {sidebarOpen && <span className="text-sm font-medium">{t('common.controlPanel') || 'Panel de Control'}</span>}
          </Link>

          {menuItems.map((section, idx) => (
            <div key={idx}>
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Image src="/fenix-logo.png" alt="Fenix" width={32} height={32} className="w-8 h-8" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Fenix-SGCN</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">CIDE SAS</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Settings Menu */}
            <SettingsMenu />

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Juan Perez</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.systemAdmin') || 'Administrador de Sistema'}</p>
              </div>
              <button className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-semibold">
                JP
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.href = '/auth/login';
              }}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {t('common.logout')}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
