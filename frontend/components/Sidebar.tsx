'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target,
  AlertTriangle, 
  Activity, 
  Lightbulb,
  FileText, 
  TestTube, 
  TrendingUp,
  Home
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
    description: 'Cláusula 5: Liderazgo y Gobierno'
  },
  { 
    name: '2. Risk Analysis ARA', 
    path: '/dashboard/analisis-riesgos',
    icon: AlertTriangle,
    description: 'Cláusula 8.2.3: Evaluación de Riesgos'
  },
  { 
    name: '3. Impact Analysis BIA', 
    path: '/dashboard/analisis-impacto',
    icon: Activity,
    description: 'Cláusula 8.2.2: Análisis de Impacto'
  },
  { 
    name: '4. Escenarios y Estrategia', 
    path: '/dashboard/estrategia',
    icon: Lightbulb,
    description: 'Cláusula 8.3: Estrategias de Continuidad'
  },
  { 
    name: '5. Planes Continuidad', 
    path: '/dashboard/planes',
    icon: FileText,
    description: 'Cláusula 8.4: Procedimientos de Continuidad'
  },
  { 
    name: '6. Pruebas Continuidad', 
    path: '/dashboard/pruebas',
    icon: TestTube,
    description: 'Cláusula 8.5: Ejercicios y Pruebas'
  },
  { 
    name: '7. Mejora Continua', 
    path: '/dashboard/mantenimiento',
    icon: TrendingUp,
    description: 'Cláusula 10: Mejora'
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen">
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

      <nav className="p-4">
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
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
