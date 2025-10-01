"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface RaciAssignment {
  role: string;
  responsibility: string;
  raciType: 'RESPONSIBLE' | 'ACCOUNTABLE' | 'CONSULTED' | 'INFORMED';
}

interface RaciEditorProps {
  onSuccess: () => void;
  existingMatrix?: {
    id: string;
    processOrActivity: string;
    assignments: RaciAssignment[];
  };
}

export default function RaciMatrixEditor({ onSuccess, existingMatrix }: RaciEditorProps) {
  const [processOrActivity, setProcessOrActivity] = useState("");
  const [assignments, setAssignments] = useState<RaciAssignment[]>([
    { role: "", responsibility: "", raciType: 'RESPONSIBLE' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (existingMatrix) {
      setProcessOrActivity(existingMatrix.processOrActivity);
      setAssignments(existingMatrix.assignments.length > 0 ? existingMatrix.assignments : [
        { role: "", responsibility: "", raciType: 'RESPONSIBLE' }
      ]);
      setIsEditMode(true);
    }
  }, [existingMatrix]);

  const addRow = () => {
    setAssignments([...assignments, { role: "", responsibility: "", raciType: 'RESPONSIBLE' }]);
  };

  const removeRow = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof RaciAssignment, value: string) => {
    const updated = [...assignments];
    updated[index] = { ...updated[index], [field]: value };
    setAssignments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const url = isEditMode && existingMatrix 
        ? `${API_URL}/api/governance/raci-matrix/${existingMatrix.id}` 
        : `${API_URL}/api/governance/raci-matrix`;
      
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          processOrActivity,
          assignments: assignments.filter(a => a.role && a.responsibility),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditMode ? 'actualizar' : 'guardar'} la matriz RACI`);
      }

      onSuccess();
      if (!isEditMode) {
        setProcessOrActivity("");
        setAssignments([{ role: "", responsibility: "", raciType: 'RESPONSIBLE' }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📋 Matriz RACI
        </h4>
        <div className="grid grid-cols-4 gap-4 text-xs text-blue-800 dark:text-blue-200">
          <div>
            <strong>R</strong>esponsible: Ejecuta la tarea
          </div>
          <div>
            <strong>A</strong>ccountable: Responsable final
          </div>
          <div>
            <strong>C</strong>onsulted: Consultado antes
          </div>
          <div>
            <strong>I</strong>nformed: Informado después
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proceso o Actividad *
          </label>
          <input
            type="text"
            required
            value={processOrActivity}
            onChange={(e) => setProcessOrActivity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ej: Gestión de Incidentes Críticos"
          />
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Responsabilidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tipo RACI
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((assignment, index) => (
                <tr key={index} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={assignment.role}
                      onChange={(e) => updateRow(index, 'role', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Ej: Gerente de TI"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={assignment.responsibility}
                      onChange={(e) => updateRow(index, 'responsibility', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Ej: Coordinar respuesta técnica"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={assignment.raciType}
                      onChange={(e) => updateRow(index, 'raciType', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value="RESPONSIBLE">R - Responsible</option>
                      <option value="ACCOUNTABLE">A - Accountable</option>
                      <option value="CONSULTED">C - Consulted</option>
                      <option value="INFORMED">I - Informed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {assignments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Agregar Fila
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditMode ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? 'Actualizar Matriz' : 'Guardar Matriz'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
