'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Play, CheckCircle, Clock, FileText } from 'lucide-react';

interface TestExercise {
  id: string;
  name: string;
  type: 'Tabletop' | 'Walkthrough' | 'Simulation' | 'FullScale';
  scheduledDate: string;
  status: 'Planned' | 'InProgress' | 'Completed' | 'Cancelled';
  facilitator?: string;
  participants?: string[];
  results?: string;
  score?: number;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<TestExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/test-exercises');
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Planned': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tabletop': return '📋';
      case 'Walkthrough': return '🚶';
      case 'Simulation': return '🎮';
      case 'FullScale': return '🎯';
      default: return '📝';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ejercicios y Simulacros</h1>
          <p className="text-gray-500 mt-1">Programación y ejecución de pruebas de continuidad</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Programar Ejercicio
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Ejercicios</div>
          <div className="text-2xl font-bold">{exercises.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Completados</div>
          <div className="text-2xl font-bold text-green-600">
            {exercises.filter(e => e.status === 'Completed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Programados</div>
          <div className="text-2xl font-bold text-yellow-600">
            {exercises.filter(e => e.status === 'Planned').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Score Promedio</div>
          <div className="text-2xl font-bold text-blue-600">
            {exercises.filter(e => e.score).length > 0
              ? Math.round(exercises.filter(e => e.score).reduce((acc, e) => acc + (e.score || 0), 0) / exercises.filter(e => e.score).length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Exercises Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ejercicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Programada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facilitador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Cargando ejercicios...
                  </td>
                </tr>
              ) : exercises.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No hay ejercicios programados. Haz clic en "Programar Ejercicio" para comenzar.
                  </td>
                </tr>
              ) : (
                exercises.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <span>{getTypeIcon(exercise.type)}</span>
                        <span className="text-sm">{exercise.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exercise.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.facilitator || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.participants?.length || 0} personas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exercise.status)}`}>
                        {exercise.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exercise.score ? (
                        <span className="text-sm font-medium">{exercise.score}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {exercise.status === 'Planned' && (
                          <button className="text-green-600 hover:text-green-900" title="Iniciar">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {exercise.status === 'Completed' && (
                          <button className="text-blue-600 hover:text-blue-900" title="Ver Resultados">
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
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
