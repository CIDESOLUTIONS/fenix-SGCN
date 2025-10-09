'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Download, Play, Edit, Trash2 } from 'lucide-react';

interface ContinuityPlan {
  id: string;
  processId: string;
  processName?: string;
  name: string;
  type: 'BCP' | 'DRP' | 'IRP' | 'Crisis';
  status: 'Draft' | 'Active' | 'Review' | 'Archived';
  description?: string;
  reviewDate?: string;
  approvedBy?: string;
  lastTested?: string;
  version: string;
}

const planTemplates = [
  {
    type: 'BCP',
    name: 'Plan de Continuidad de Negocio',
    description: 'Plan integral para mantener operaciones críticas durante interrupciones',
    color: 'bg-blue-500'
  },
  {
    type: 'DRP',
    name: 'Plan de Recuperación ante Desastres',
    description: 'Procedimientos específicos para recuperación de TI y datos',
    color: 'bg-purple-500'
  },
  {
    type: 'IRP',
    name: 'Plan de Respuesta a Incidentes',
    description: 'Guía para respuesta inmediata a incidentes de seguridad',
    color: 'bg-orange-500'
  },
  {
    type: 'Crisis',
    name: 'Plan de Gestión de Crisis',
    description: 'Estructura de comunicación y toma de decisiones en crisis',
    color: 'bg-red-500'
  }
];

export default function ContinuityPlansPage() {
  const [plans, setPlans] = useState<ContinuityPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/continuity-plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BCP': return 'bg-blue-100 text-blue-800';
      case 'DRP': return 'bg-purple-100 text-purple-800';
      case 'IRP': return 'bg-orange-100 text-orange-800';
      case 'Crisis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planes de Continuidad</h1>
          <p className="text-gray-500 mt-1">Gestión de BCP, DRP, IRP y planes de crisis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Planes</div>
          <div className="text-2xl font-bold">{plans.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Planes Activos</div>
          <div className="text-2xl font-bold text-green-600">
            {plans.filter(p => p.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">En Revisión</div>
          <div className="text-2xl font-bold text-yellow-600">
            {plans.filter(p => p.status === 'Review').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Borradores</div>
          <div className="text-2xl font-bold text-gray-600">
            {plans.filter(p => p.status === 'Draft').length}
          </div>
        </div>
      </div>

      {/* Plan Templates Selection */}
      {showTemplates && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Selecciona una Plantilla</h2>
          <div className="grid grid-cols-2 gap-4">
            {planTemplates.map((template) => (
              <div
                key={template.type}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => window.location.href = `/dashboard/plans/editor?template=${template.type}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {template.type}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Prueba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Cargando planes...
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay planes creados. Haz clic en "Nuevo Plan" para comenzar.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                          {plan.description && (
                            <div className="text-xs text-gray-500">{plan.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(plan.type)}`}>
                        {plan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.processName || 'No asignado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{plan.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.lastTested || 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Activar">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
