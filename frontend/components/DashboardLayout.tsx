"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SettingsMenu from "./settings/SettingsMenu";
import { useTranslation } from "../lib/i18n/useTranslation";
import { useAuth } from "../hooks/useAuth";
import TrialBanner from "./dashboard/TrialBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const menuSections = [
    {
      title: "MÓDULOS DEL SGCN",
      items: [
        { href: "/dashboard", label: "Panel de Control", icon: "🏠" },
        { href: "/planning", label: "1. Planning", icon: "📋" },
        { href: "/risk-analysis", label: "2. Risk Analysis ARA", icon: "⚠️" },
        { href: "/impact-analysis", label: "3. Impact Analysis BIA", icon: "📊" },
        { href: "/continuity-strategy", label: "4. Continuity Strategy", icon: "🎯" },
        { href: "/continuity-plans", label: "5. Continuity Plans", icon: "📝" },
        { href: "/continuity-tests", label: "6. Continuity Tests", icon: "✅" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Fijo */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Izquierda: Logo CIDE + Empresa */}
          <div className="flex items-center gap-3">
            <Image 
              src="/cide-logo.png" 
              alt="CIDE SAS" 
              width={40} 
              height={40} 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.tenant?.name || 'Empresa'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">CIDE SAS</p>
            </div>
          </div>

          {/* Centro: Vacío */}
          <div></div>

          {/* Derecha: Alertas + Preferencias + Usuario + Logout */}
          <div className="flex items-center gap-2">
            {/* Alertas */}
            <Link 
              href="/alerts"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Preferencias */}
            <SettingsMenu />

            {/* Usuario + Cargo */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullName || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.position || user?.role || 'Cargo'}
                </p>
              </div>

              {/* Logout */}
              <button 
                onClick={logout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition group"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Logo Fenix + Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/fenix-icono.ico" 
              alt="Fenix SGCN" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fenix</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">SGCN ISO 22301</p>
              </div>
            )}
          </div>
          
          {/* Botón Toggle Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <svg 
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-5rem)]">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      pathname === item.href
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <main className="p-6">
          <TrialBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
