'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CreditCard, 
  DollarSign, 
  Package, 
  Building2, 
  Activity,
  Settings,
  AlertCircle
} from 'lucide-react';

const adminMenuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Suscripciones', path: '/admin/subscriptions', icon: CreditCard },
  { name: 'Facturación', path: '/admin/billing', icon: DollarSign },
  { name: 'Planes y Precios', path: '/admin/plans', icon: Package },
  { name: 'Empresas (Tenants)', path: '/admin/tenants', icon: Building2 },
  { name: 'Solicitudes', path: '/admin/requests', icon: AlertCircle },
  { name: 'Analytics', path: '/admin/analytics', icon: Activity },
  { name: 'Configuración', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400">ADMIN PORTAL</h1>
          <p className="text-xs text-gray-400 mt-1">Fenix-SGCN SaaS</p>
        </div>

        <nav className="px-4 space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
