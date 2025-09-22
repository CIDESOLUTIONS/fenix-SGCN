'use client';

import { useState } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface Request {
  id: string;
  type: 'License' | 'Upgrade' | 'Support' | 'Feature';
  company: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  requestedBy: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'License',
      company: 'TechCorp Solutions',
      description: 'Solicitud de 20 licencias adicionales',
      priority: 'High',
      status: 'Pending',
      date: '2025-09-21',
      requestedBy: 'John Doe'
    },
    {
      id: '2',
      type: 'Upgrade',
      company: 'HealthCare Plus',
      description: 'Upgrade de Professional a Enterprise',
      priority: 'Medium',
      status: 'Pending',
      date: '2025-09-20',
      requestedBy: 'Jane Smith'
    },
    {
      id: '3',
      type: 'Support',
      company: 'FinanceGroup LLC',
      description: 'Soporte técnico urgente - integración API',
      priority: 'High',
      status: 'Approved',
      date: '2025-09-19',
      requestedBy: 'Mike Johnson'
    },
    {
      id: '4',
      type: 'Feature',
      company: 'StartupXYZ',
      description: 'Solicitud de módulo personalizado de reportes',
      priority: 'Low',
      status: 'Pending',
      date: '2025-09-18',
      requestedBy: 'Sarah Wilson'
    }
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'Approved' as const } : r
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'Rejected' as const } : r
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Solicitudes y Aprobaciones</h1>
        <p className="text-gray-500 mt-1">Gestión de peticiones de clientes</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Solicitudes</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alta Prioridad</p>
              <p className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.priority === 'High' && r.status === 'Pending').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{request.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.requestedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Aprobar"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Rechazar"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
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
