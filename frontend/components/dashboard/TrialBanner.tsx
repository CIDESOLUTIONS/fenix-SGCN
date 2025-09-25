"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function TrialBanner() {
  const { user } = useAuth();

  // Calcular días restantes (esto debería venir del backend)
  const daysRemaining = 26; // Ejemplo

  if (!user?.tenant?.subscriptionStatus || user.tenant.subscriptionStatus !== 'trial') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.tenant?.subscriptionPlan || 'Plan Profesional'} (Prueba)
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {daysRemaining} días restantes en tu prueba gratuita
            </p>
          </div>
        </div>

        <Link
          href="/plans"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Ver Planes
        </Link>
      </div>
    </div>
  );
}
