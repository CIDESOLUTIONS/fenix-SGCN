'use client';

import { useState } from 'react';
import { Check, X, Clock, DollarSign, Calendar, Users } from 'lucide-react';

interface Subscription {
  id: string;
  companyName: string;
  plan: 'Basic' | 'Professional' | 'Enterprise' | 'Custom';
  status: 'Active' | 'Pending' | 'Cancelled' | 'Suspended';
  monthlyRevenue: number;
  users: number;
  startDate: string;
  renewalDate: string;
  autoRenew: boolean;
}

export default function SubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      plan: 'Enterprise',
      status: 'Active',
      monthlyRevenue: 2500,
      users: 45,
      startDate: '2025-01-15',
      renewalDate: '2026-01-15',
      autoRenew: true
    },
    {
      id: '2',
      companyName: 'HealthCare Plus',
      plan: 'Professional',
      status: 'Active',
      monthlyRevenue: 800,
      users: 32,
      startDate: '2025-03-10',
      renewalDate: '2026-03-10',
      autoRenew: true
    },
    {
      id: '3',
      companyName: 'FinanceGroup LLC',
      plan: 'Enterprise',
      status: 'Active',
      monthlyRevenue: 2500,
      users: 28,
      startDate: '2025-02-20',
      renewalDate: '2026-02-20',
      autoRenew: false
    },
    {
      id: '4',
      companyName: 'StartupXYZ',
      plan: 'Basic',
      status: 'Pending',
      monthlyRevenue: 0,
      users: 10,
      startDate: '2025-09-20',
      renewalDate: '2025-10-20',
      autoRenew: false
    }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'text-purple-600 font-bold';
      case 'Professional': return 'text-blue-600 font-semibold';
      case 'Basic': return 'text-gray-600';
      case 'Custom': return 'text-orange-600 font-bold';
      default: return 'text-gray-600';
    }
  };

  const filteredSubs = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(s => s.status === filter);

  const totalMRR = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((acc, s) => acc + s.monthlyRevenue, 0);

  const activeCount = subscriptions.filter(s => s.status === 'Active').length;
  const pendingCount = subscriptions.filter(s => s.status === 'Pending').length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Suscripciones</h1>
        <p className="text-gray-500 mt-1">Control de licencias y renovaciones</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">MRR Total</p>
          <p className="text-2xl font-bold text-green-600">${totalMRR.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Activas</p>
          <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-purple-600">{subscriptions.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'Active', 'Pending', 'Cancelled', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todas' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Suscripciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Renovación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Auto-Renovación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {sub.companyName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{sub.companyName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getPlanColor(sub.plan)}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${sub.monthlyRevenue.toLocaleString()}/mes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sub.users} usuarios
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.renewalDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sub.autoRenew ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Editar</button>
                      {sub.status === 'Pending' && (
                        <button className="text-green-600 hover:text-green-800">Aprobar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
