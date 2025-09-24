'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Rocket, 
  Target, 
  Building, 
  AlertTriangle, 
  Activity, 
  Shield, 
  FileText, 
  AlertCircle, 
  TestTube, 
  TrendingUp,
  Briefcase,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: "/cide-icono.png",
    section: 'main'
  },
  { 
    name: '1. CONFIGURACIÓN INICIAL', 
    icon: Rocket,
    section: 'fundacional',
    submenu: [
      { name: 'Kick-off y Setup', path: '/dashboard/setup', icon: Rocket },
      { name: 'Contexto Organizacional', path: '/dashboard/context', icon: Target },
      { name: 'Identificación de Procesos', path: '/dashboard/processes', icon: Building },
    ]
  },
  { 
    name: '2. ANÁLISIS DE RIESGOS (ARA)', 
    icon: AlertTriangle,
    section: 'analisis',
    submenu: [
      { name: 'Gestión de Riesgos', path: '/dashboard/ara/risks', icon: AlertTriangle },
      { name: 'Matriz de Evaluación', path: '/dashboard/ara/matrix', icon: Activity },
      { name: 'Dashboard Resiliencia', path: '/dashboard/ara/scoring', icon: TrendingUp },
    ]
  },
  { 
    name: '3. ANÁLISIS DE IMPACTO (BIA)', 
    icon: Activity,
    section: 'analisis',
    submenu: [
      { name: 'Evaluaciones BIA', path: '/dashboard/bia/assessments', icon: Activity },
      { name: 'Asistente BIA con IA', path: '/dashboard/bia/wizard', icon: Rocket },
    ]
  },
  { 
    name: '4. ESTRATEGIAS Y PLANES', 
    icon: Shield,
    section: 'planes',
    submenu: [
      { name: 'Escenarios de Contingencia', path: '/dashboard/scenarios', icon: AlertCircle },
      { name: 'Planes de Continuidad', path: '/dashboard/plans', icon: FileText },
      { name: 'Gestión de Crisis', path: '/dashboard/crisis', icon: AlertTriangle },
    ]
  },
  { 
    name: '5. PRUEBAS Y MEJORA', 
    icon: TestTube,
    section: 'mejora',
    submenu: [
      { name: 'Ejercicios y Simulacros', path: '/dashboard/exercises', icon: TestTube },
      { name: 'Mejora Continua', path: '/dashboard/improvements', icon: TrendingUp },
    ]
  },
  { 
    name: '6. GESTIÓN EMPRESARIAL', 
    icon: Briefcase,
    section: 'gestion',
    submenu: [
      { name: 'Portafolio Multi-tenant', path: '/dashboard/portfolio', icon: Briefcase },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'fundacional', 'analisis', 'planes', 'mejora', 'gestion'
  ]);

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">FENIX SGCN</h1>
        <p className="text-xs text-gray-400 mt-1">ISO 22301 Platform</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = item.section && expandedSections.includes(item.section);
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          if (hasSubmenu) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => item.section && toggleSection(item.section)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subitem) => {
                      const SubIcon = subitem.icon;
                      const isActive = pathname === subitem.path;
                      
                      return (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-gray-800 text-gray-300'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subitem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path!}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
