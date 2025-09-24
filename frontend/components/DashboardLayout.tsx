"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SettingsMenu from "./settings/SettingsMenu";
import { useTranslation } from "../lib/i18n/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { Bell, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Módulos del SGCN",
      items: [
        { icon: "📋", label: `1. ${t('modules.planning') || 'Planeación'}`, href: "/dashboard/planeacion" },
        { icon: "📊", label: `2. ${t('modules.riskAnalysis') || 'Análisis de Riesgos'} ARA`, href: "/dashboard/analisis-riesgos" },
        { icon: "🎯", label: `3. ${t('modules.impactAnalysis') || 'Análisis de Impacto'} BIA`, href: "/dashboard/analisis-impacto" },
        { icon: "🔄", label: `4. ${t('modules.strategy') || 'Estrategia de Continuidad'}`, href: "/dashboard/estrategia" },
        { icon: "📝", label: `5. ${t('modules.plans') || 'Planes de Continuidad'}`, href: "/dashboard/planes" },
        { icon: "✅", label: `6. ${t('modules.tests') || 'Pruebas de Continuidad'}`, href: "/dashboard/pruebas" },
        { icon: "🔧", label: `7. ${t('modules.maintenance') || 'Mantenimiento SGCN'}`, href: "/dashboard/mantenimiento" },
      ]
    },
    {
      title: "COMMON.TOOLS",
      items: [
        { icon: "📂", label: t('modules.criteria') || 'Criterios de Estrategia', href: "/dashboard/criterios" },
        { icon: "⚙️", label: t('modules.configuration') || 'Configuración', href: "/dashboard/configuracion" },
      ]
    }
  ];

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Fijo */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Izquierda: Menú Hamburguesa */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Centro: Logo/Nombre Tenant */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              {user?.tenant?.logo ? (
                <Image 
                  src={user.tenant.logo} 
                  alt={user.tenant.name} 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
              ) : (
                getInitials(user?.tenant?.name || 'FX')
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.tenant?.name || 'Fenix-SGCN'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sistema de Continuidad
              </p>
            </div>
          </div>

          {/* Derecha: Notificaciones + Settings + Perfil */}
          <div className="flex items-center gap-2">
            {/* Notificaciones */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings Menu */}
            <SettingsMenu />

            {/* Usuario */}
            <div className="flex items-center gap-2 ml-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullName || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'Usuario'}
                </p>
              </div>
              <button 
                onClick={logout}
                className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-semibold text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition"
              >
                {user ? getInitials(user.fullName) : 'U'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'}`}>
        {/* Logo Fenix en Sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🔥</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fenix</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">SGCN ISO 22301</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
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
            <span className="text-sm font-medium">Panel de Control</span>
          </Link>

          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
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
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
