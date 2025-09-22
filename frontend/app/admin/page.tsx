'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Activity,
  Package,
  Settings,
  AlertCircle
} from 'lucide-react';

interface SaaSMetrics {
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  totalTenants: number;
  activeUsers: number;
  churnRate: number;
  ltv: number;
  cac: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SaaSMetrics>({
    mrr: 125000,
    arr: 1500000,
    activeSubscriptions: 487,
    totalTenants: 512,
    activeUsers: 8945,
    churnRate: 2.3,
    ltv: 45000,
    cac: 3500
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Portal de Administración SaaS</h1>
        <p className="text-gray-500 mt-1">Panel de control para el propietario de Fenix-SGCN</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">MRR (Monthly)</p>
              <p className="text-3xl font-bold text-green-600">
                ${(metrics.mrr / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-green-600 mt-1">↑ 12% vs mes anterior</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ARR (Anual)</p>
              <p className="text-3xl font-bold text-blue-600">
                ${(metrics.arr / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-blue-600 mt-1">↑ 24% YoY</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Empresas Activas</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.totalTenants}</p>
              <p className="text-xs text-purple-600 mt-1">{metrics.activeSubscriptions} con suscripción</p>
            </div>
            <Building2 className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Usuarios Activos</p>
              <p className="text-3xl font-bold text-orange-600">{metrics.activeUsers}</p>
              <p className="text-xs text-orange-600 mt-1">↑ 18% este mes</p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Métricas SaaS */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <p className="text-sm text-green-700 font-medium">LTV (Lifetime Value)</p>
          <p className="text-2xl font-bold text-green-900">${(metrics.ltv / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6">
          <p className="text-sm text-red-700 font-medium">CAC (Cost Acquisition)</p>
          <p className="text-2xl font-bold text-red-900">${(metrics.cac / 1000).toFixed(1)}K</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <p className="text-sm text-blue-700 font-medium">LTV / CAC Ratio</p>
          <p className="text-2xl font-bold text-blue-900">
            {(metrics.ltv / metrics.cac).toFixed(1)}x
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <p className="text-sm text-purple-700 font-medium">Churn Rate</p>
          <p className="text-2xl font-bold text-purple-900">{metrics.churnRate}%</p>
        </div>
      </div>

      {/* Navegación Rápida */}
      <div className="grid grid-cols-3 gap-6">
        <a
          href="/admin/subscriptions"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <CreditCard className="w-10 h-10 text-blue-600" />
            <div>
              <h3 className="font-semibold text-lg">Suscripciones</h3>
              <p className="text-sm text-gray-500">Gestionar planes y licencias</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/billing"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <DollarSign className="w-10 h-10 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg">Facturación</h3>
              <p className="text-sm text-gray-500">Ingresos y costos</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/plans"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Package className="w-10 h-10 text-purple-600" />
            <div>
              <h3 className="font-semibold text-lg">Planes</h3>
              <p className="text-sm text-gray-500">Configurar planes y precios</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/tenants"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Building2 className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg">Empresas</h3>
              <p className="text-sm text-gray-500">Gestionar tenants</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/requests"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-lg">Solicitudes</h3>
              <p className="text-sm text-gray-500">Aprobaciones pendientes</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/analytics"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Activity className="w-10 h-10 text-red-600" />
            <div>
              <h3 className="font-semibold text-lg">Analytics</h3>
              <p className="text-sm text-gray-500">Métricas detalladas</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/settings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Settings className="w-10 h-10 text-gray-600" />
            <div>
              <h3 className="font-semibold text-lg">Configuración</h3>
              <p className="text-sm text-gray-500">Pasarelas y ajustes</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
