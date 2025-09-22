'use client';

import { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function BillingPage() {
  const [period, setPeriod] = useState('month');

  const revenue = {
    total: 125450,
    growth: 12.5,
    mrr: 125450,
    arr: 1505400,
    costs: 45200,
    profit: 80250
  };

  const transactions = [
    { id: '1', company: 'TechCorp', amount: 2500, date: '2025-09-20', status: 'Completed' },
    { id: '2', company: 'HealthCare Plus', amount: 800, date: '2025-09-19', status: 'Completed' },
    { id: '3', company: 'FinanceGroup', amount: 2500, date: '2025-09-18', status: 'Pending' },
    { id: '4', company: 'StartupXYZ', amount: 299, date: '2025-09-17', status: 'Failed' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facturación e Ingresos</h1>
        <p className="text-gray-500 mt-1">Control financiero y pasarelas de pago</p>
      </div>

      {/* KPIs Financieros */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos Totales</p>
              <p className="text-3xl font-bold text-green-600">${revenue.total.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {revenue.growth}% vs mes anterior
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">ARR (Annual)</p>
          <p className="text-3xl font-bold text-blue-600">${(revenue.arr / 1000000).toFixed(1)}M</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Costos</p>
          <p className="text-3xl font-bold text-red-600">${revenue.costs.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Ganancia Neta</p>
          <p className="text-3xl font-bold text-purple-600">${revenue.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Pasarelas de Pago */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Pasarelas de Pago Configuradas</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Stripe</p>
              <p className="text-sm text-green-600">Activo</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">PayPal</p>
              <p className="text-sm text-green-600">Activo</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>

          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Transferencia</p>
              <p className="text-sm text-green-600">Activo</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Transacciones Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Transacciones Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4">{tx.company}</td>
                  <td className="px-6 py-4 font-semibold">${tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tx.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
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
