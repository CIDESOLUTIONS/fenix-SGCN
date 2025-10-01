'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Home,
  LayoutDashboard,
  AlertTriangle, 
  Activity, 
  Lightbulb,
  FileText, 
  TestTube, 
  TrendingUp,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { preferences } = usePreferences();
  const { t } = useTranslation();

  const menuItems = [
    { 
      name: t('modules.dashboard'),
      path: '/dashboard', 
      icon: Home,
    },
    { 
      name: t('modules.planning'),
      path: '/dashboard/planeacion',
      icon: LayoutDashboard,
      description: t('modules.planning_desc')
    },
    { 
      name: t('modules.risk'),
      path: '/dashboard/analisis-riesgos',
      icon: AlertTriangle,
      description: t('modules.risk_desc')
    },
    { 
      name: t('modules.bia'),
      path: '/dashboard/analisis-impacto',
      icon: Activity,
      description: t('modules.bia_desc')
    },
    { 
      name: t('modules.strategies'),
      path: '/dashboard/estrategia',
      icon: Lightbulb,
      description: t('modules.strategies_desc')
    },
    { 
      name: t('modules.plans'),
      path: '/dashboard/planes',
      icon: FileText,
      description: t('modules.plans_desc')
    },
    { 
      name: t('modules.testing'),
      path: '/dashboard/pruebas',
      icon: TestTube,
      description: t('modules.testing_desc')
    },
    { 
      name: t('modules.improvement'),
      path: '/dashboard/mantenimiento',
      icon: TrendingUp,
      description: t('modules.improvement_desc')
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('sidebar.title')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sidebar.subtitle')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          {t('sidebar.modules')}
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{item.name}</span>
                  {item.description && !isActive && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">{item.description}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {t('sidebar.administration')}
          </div>
          <Link
            href="/dashboard/configuracion"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              pathname === '/dashboard/configuracion'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{t('common.settings')}</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
            {t('sidebar.tip')}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t('sidebar.tipMessage')}
          </p>
        </div>
      </div>
    </aside>
  );
}
