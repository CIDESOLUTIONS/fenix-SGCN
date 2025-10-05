'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  processType: string;
  description?: string;
  includeInContinuityAnalysis: boolean;
  priorityScore: number;
}

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    processType: 'MISIONAL',
    description: '',
    includeInContinuityAnalysis: false,
  });

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const response = await fetch('/api/business-processes');
      if (response.ok) {
        const data = await response.json();
        setProcesses(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/business-processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProcesses();
        setFormData({
          name: '',
          processType: 'MISIONAL',
          description: '',
          includeInContinuityAnalysis: false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proceso?')) return;
    
    try {
      const response = await fetch(`/api/business-processes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProcesses();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleContinuity = async (process: Process) => {
    try {
      const response = await fetch(`/api/business-processes/${process.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeInContinuityAnalysis: !process.includeInContinuityAnalysis,
        }),
      });

      if (response.ok) {
        await fetchProcesses();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Procesos de Negocio</h1>
        <p className="text-gray-600">Gestione los procesos críticos de su organización</p>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Proceso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Nombre del proceso"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.processType}
              onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="MISIONAL">Misional</option>
              <option value="APOYO">Apoyo</option>
              <option value="ESTRATEGICO">Estratégico</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Breve descripción"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeInContinuityAnalysis}
              onChange={(e) => setFormData({ ...formData, includeInContinuityAnalysis: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Incluir en Análisis de Continuidad</span>
          </label>
          <button
            onClick={handleCreate}
            disabled={!formData.name}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de procesos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Procesos Registrados ({processes.length})</h2>
        </div>
        <div className="divide-y">
          {processes.map((process) => (
            <div key={process.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{process.name}</h3>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                      {process.processType}
                    </span>
                    {process.includeInContinuityAnalysis && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓ En Continuidad
                      </span>
                    )}
                  </div>
                  {process.description && (
                    <p className="text-gray-600 text-sm mt-1">{process.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleContinuity(process)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      process.includeInContinuityAnalysis
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {process.includeInContinuityAnalysis ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(process.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {processes.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No hay procesos registrados</p>
              <p className="text-sm mt-1">Agregue el primer proceso usando el formulario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
