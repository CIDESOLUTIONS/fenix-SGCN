'use client';

import { useState, useEffect } from 'react';
import { Link2, Check, X } from 'lucide-react';

interface LinkProcessModalProps {
  riskId: string;
  currentProcessId?: string;
  onClose: () => void;
  onLinked: () => void;
}

export default function LinkProcessModal({ riskId, currentProcessId, onClose, onLinked }: LinkProcessModalProps) {
  const [processes, setProcesses] = useState<any[]>([]);
  const [selectedProcess, setSelectedProcess] = useState(currentProcessId || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      console.error('Error fetching processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (!selectedProcess) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/risk-assessments/${riskId}/link-process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processId: selectedProcess }),
      });

      if (response.ok) {
        onLinked();
        onClose();
      } else {
        alert('Error al vincular proceso');
      }
    } catch (error) {
      console.error('Error linking process:', error);
      alert('Error al vincular proceso');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Vincular Riesgo con Proceso
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Seleccione el proceso de negocio afectado por este riesgo:
              </p>

              {processes.map((process) => (
                <label
                  key={process.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProcess === process.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="process"
                    value={process.id}
                    checked={selectedProcess === process.id}
                    onChange={(e) => setSelectedProcess(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{process.name}</p>
                    {process.processId && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{process.processId}</p>
                    )}
                    {process.criticalityLevel && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                        process.criticalityLevel === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : process.criticalityLevel === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {process.criticalityLevel}
                      </span>
                    )}
                  </div>
                </label>
              ))}

              {processes.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay procesos disponibles
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleLink}
            disabled={!selectedProcess || saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4" />
            {saving ? 'Vinculando...' : 'Vincular Proceso'}
          </button>
        </div>
      </div>
    </div>
  );
}
