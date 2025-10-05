'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, AlertTriangle, Calculator, Grid3x3, TrendingUp } from 'lucide-react';

export default function ARALayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard/ara', icon: TrendingUp },
    { id: 'risks', label: 'Registro de Riesgos', path: '/dashboard/ara/risks', icon: AlertTriangle },
    { id: 'matrix', label: 'Matriz de Evaluación', path: '/dashboard/ara/matrix', icon: Grid3x3 },
    { id: 'scoring', label: 'Criterios de Puntuación', path: '/dashboard/ara/scoring', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Análisis de Riesgos (ARA)
              </h1>
              <p className="text-sm text-gray-500">
                ISO 22301 Cláusula 8.2.3 & ISO 31000
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                    ${isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
