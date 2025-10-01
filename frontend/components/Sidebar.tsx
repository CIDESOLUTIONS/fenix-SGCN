'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
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

const menuItems = [
  { 
    name: 'Panel de Control', 
    path: '/dashboard', 
    icon: Home,
  },
  { 
    name: '1. Planning', 
    path: '/dashboard/planeacion',
    icon: LayoutDashboard,
    description: 'Cláusula 5: Liderazgo'
  },
  { 
    name: '2. Risk Analysis', 
    path: '/dashboard/analisis-riesgos',
    icon: AlertTriangle,
    description: 'ISO 31000'
  },
  { 
    name: '3. Impact Analysis', 
    path: '/dashboard/analisis-impacto',
    icon: Activity,
    description: 'BIA ISO 22317'
  },
  { 
    name: '4. Strategies', 
    path: '/dashboard/estrategia',
    icon: Lightbulb,
    description: 'Cláusula 8.3'
  },
  { 
    name: '5. Continuity Plans', 
    path: '/dashboard/planes',
    icon: FileText,
    description: 'BCP/DRP/IRP'
  },
  { 
    name: '6. Testing', 
    path: '/dashboard/pruebas',
    icon: TestTube,
    description: 'Cláusula 8.5'
  },
  { 
    name: '7. Improvement', 
    path: '/dashboard/mantenimiento',
    icon: TrendingUp,
    description: 'CAPA & KPIs'
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Fenix</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">SGCN ISO 22301</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          MÓDULOS DEL SGCN
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
            ADMINISTRACIÓN
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
            <span className="text-sm font-medium">Configuración</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
            💡 Consejo
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Complete los módulos en orden para aprovechar la integración automática de datos
          </p>
        </div>
      </div>
    </aside>
  );
}
