'use client';

import { useState } from 'react';
import { Plus, Trash2, Server } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  description: string;
  department: string;
  owner: string;
  category: 'Misional' | 'Apoyo' | 'Estratégico';
  financialImpact: number;
  operationalImpact: number;
  reputationalImpact: number;
  legalImpact: number;
  strategicImpact: number;
  totalScore: number;
}

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [weights] = useState({
    financial: 30,
    operational: 25,
    reputational: 20,
    legal: 15,
    strategic: 10
  });

  const addProcess = () => {
    const newProcess: Process = {
      id: Date.now().toString(),
      name: '',
      description: '',
      department: '',
      owner: '',
      category: 'Misional',
      financialImpact: 0,
      operationalImpact: 0,
      reputationalImpact: 0,
      legalImpact: 0,
      strategicImpact: 0,
      totalScore: 0
    };
    setProcesses([...processes, newProcess]);
  };

  const calculateScore = (process: Process) => {
    return (
      (process.financialImpact * weights.financial / 100) +
      (process.operationalImpact * weights.operational / 100) +
      (process.reputationalImpact * weights.reputational / 100) +
      (process.legalImpact * weights.legal / 100) +
      (process.strategicImpact * weights.strategic / 100)
    );
  };

  const updateProcess = (index: number, field: string, value: any) => {
    const updated = [...processes];
    (updated[index] as any)[field] = value;
    updated[index].totalScore = calculateScore(updated[index]);
    setProcesses(updated);
  };

  const deleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const sortedProcesses = [...processes].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Identificación y Ponderación de Procesos</h1>
        <p className="text-gray-500 mt-1">Mapeo de procesos críticos y servicios tecnológicos de soporte</p>
      </div>

      {/* Criterios */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 className="font-semibold text-blue-900">Criterios de Ponderación Configurados</h3>
        <div className="flex gap-4 mt-2 text-sm text-blue-800">
          <span>💰 Financiero: {weights.financial}%</span>
          <span>⚙️ Operacional: {weights.operational}%</span>
          <span>🏆 Reputacional: {weights.reputational}%</span>
          <span>⚖️ Legal: {weights.legal}%</span>
          <span>🎯 Estratégico: {weights.strategic}%</span>
        </div>
      </div>

      {/* Tabla de Procesos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Procesos Identificados ({processes.length})</h2>
          <button
            onClick={addProcess}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Proceso
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Proceso</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Depto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Responsable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Categoría</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Financiero</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Operacional</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Reputacional</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Legal</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Estratégico</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Score Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProcesses.map((process, idx) => {
                const originalIndex = processes.findIndex(p => p.id === process.id);
                return (
                  <tr key={process.id} className={idx < 3 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={process.name}
                        onChange={(e) => updateProcess(originalIndex, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Nombre del proceso"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={process.department}
                        onChange={(e) => updateProcess(originalIndex, 'department', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={process.owner}
                        onChange={(e) => updateProcess(originalIndex, 'owner', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={process.category}
                        onChange={(e) => updateProcess(originalIndex, 'category', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option>Misional</option>
                        <option>Apoyo</option>
                        <option>Estratégico</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={process.financialImpact}
                        onChange={(e) => updateProcess(originalIndex, 'financialImpact', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={process.operationalImpact}
                        onChange={(e) => updateProcess(originalIndex, 'operationalImpact', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={process.reputationalImpact}
                        onChange={(e) => updateProcess(originalIndex, 'reputationalImpact', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={process.legalImpact}
                        onChange={(e) => updateProcess(originalIndex, 'legalImpact', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={process.strategicImpact}
                        onChange={(e) => updateProcess(originalIndex, 'strategicImpact', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                        process.totalScore >= 70 ? 'bg-red-100 text-red-800' :
                        process.totalScore >= 50 ? 'bg-orange-100 text-orange-800' :
                        process.totalScore >= 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {process.totalScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => deleteProcess(process.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {processes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Server className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No hay procesos registrados</p>
            <p className="text-sm mt-2">Agrega procesos para identificar los críticos del SGCN</p>
          </div>
        )}
      </div>

      {/* Resumen */}
      {processes.length > 0 && (
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4">
          <h3 className="font-semibold text-green-900">Procesos Críticos Identificados</h3>
          <p className="text-sm text-green-800 mt-2">
            Los procesos con score ≥ 70 se consideran CRÍTICOS para el SGCN (resaltados en verde).
            Total de procesos críticos: {sortedProcesses.filter(p => p.totalScore >= 70).length}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Exportar Lista
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Guardar y Continuar
        </button>
      </div>
    </div>
  );
}
