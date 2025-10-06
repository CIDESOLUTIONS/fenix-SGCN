"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SettingsMenu from "./settings/SettingsMenu";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import TrialBanner from "./dashboard/TrialBanner";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Fijo */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-64 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Izquierda: Logo CIDE + Empresa */}
            <div className="flex items-center gap-3">
              <Image 
                src="/cide-logo.png" 
                alt="CIDE SAS" 
                width={50} 
                height={50} 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.tenant?.name || 'CIDE SAS'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('header.company')}</p>
              </div>
            </div>

            {/* Derecha: Alertas + Preferencias + Usuario + Logout */}
            <div className="flex items-center gap-2">
              {/* Alertas */}
              <Link 
                href="/alerts"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title={t('header.alerts')}
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
                    {user?.fullName || t('header.profile')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.position || user?.role || '-'}
                  </p>
                </div>

                {/* Logout */}
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition group"
                  title={t('common.logout')}
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          <TrialBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
