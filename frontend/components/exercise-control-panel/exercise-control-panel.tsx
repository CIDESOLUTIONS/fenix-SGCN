'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  type: string;
  status: string;
  actualStartTime?: Date;
  actualDuration?: number;
  targetRto?: number;
  executionLog?: {
    events: Event[];
    completedTasks: Task[];
  };
}

interface Event {
  timestamp: string;
  type: string;
  user: string;
  description: string;
  metadata?: any;
}

interface Task {
  taskId: string;
  completedBy: string;
  completedAt: string;
  notes?: string;
  evidence?: string[];
}

interface ExerciseControlPanelProps {
  exercise: Exercise;
  onStart: () => void;
  onFinish: () => void;
  onLogEvent: (event: { type: string; description: string }) => void;
  onInjectEvent: (injection: { title: string; description: string; severity: string }) => void;
  onCompleteTask: (task: { taskId: string; notes?: string }) => void;
}

export function ExerciseControlPanel({
  exercise,
  onStart,
  onFinish,
  onLogEvent,
  onInjectEvent,
  onCompleteTask,
}: ExerciseControlPanelProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showInjectionModal, setShowInjectionModal] = useState(false);
  const [injectionData, setInjectionData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
  });

  useEffect(() => {
    if (exercise.status === 'IN_PROGRESS' && exercise.actualStartTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const start = new Date(exercise.actualStartTime!);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60 / 60); // horas
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [exercise.status, exercise.actualStartTime]);

  const getStatusBadge = () => {
    const statusConfig = {
      PLANNED: { color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Planificado' },
      IN_PROGRESS: { color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'En Progreso' },
      COMPLETED: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Completado' },
      CANCELLED: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Cancelado' },
    };

    const config = statusConfig[exercise.status] || statusConfig.PLANNED;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleInjectEvent = () => {
    onInjectEvent(injectionData);
    setInjectionData({ title: '', description: '', severity: 'MEDIUM' });
    setShowInjectionModal(false);
  };

  const events = exercise.executionLog?.events || [];
  const completedTasks = exercise.executionLog?.completedTasks || [];
  const isActive = exercise.status === 'IN_PROGRESS';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
            <p className="text-gray-600 mt-1">Tipo: {exercise.type}</p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {exercise.status === 'PLANNED' && (
              <button
                onClick={onStart}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Play className="w-5 h-5" />
                Iniciar Ejercicio
              </button>
            )}
            {isActive && (
              <button
                onClick={onFinish}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Square className="w-5 h-5" />
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-600">Tiempo Transcurrido</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{elapsedTime}h</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-600">RTO Objetivo</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{exercise.targetRto || 24}h</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold text-gray-600">Tareas Completadas</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{completedTasks.length}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold text-gray-600">Eventos Totales</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{events.length}</div>
          </div>
        </div>
      )}

      {/* Controles del Ejercicio */}
      {isActive && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Controles del Facilitador</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() =>
                onLogEvent({
                  type: 'DECISION',
                  description: 'Decisión crítica tomada por el equipo',
                })
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold"
            >
              📝 Registrar Decisión
            </button>

            <button
              onClick={() => setShowInjectionModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold"
            >
              🔴 Inyectar Evento
            </button>

            <button
              onClick={() =>
                onLogEvent({
                  type: 'OBSERVATION',
                  description: 'Observación del facilitador',
                })
              }
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold"
            >
              👁️ Registrar Observación
            </button>
          </div>
        </div>
      )}

      {/* Log de Eventos en Tiempo Real */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Log de Eventos</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay eventos registrados aún</p>
          ) : (
            events
              .slice()
              .reverse()
              .map((event, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    event.type === 'INJECTION'
                      ? 'bg-red-50 border-red-500'
                      : event.type === 'TASK_COMPLETED'
                      ? 'bg-green-50 border-green-500'
                      : event.type === 'DECISION'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {event.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{event.description}</p>
                      {event.user && (
                        <p className="text-xs text-gray-500 mt-1">Por: {event.user}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Tareas Completadas */}
      {completedTasks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tareas Completadas</h3>
          <div className="space-y-2">
            {completedTasks.map((task, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.taskId}</div>
                  {task.notes && <p className="text-xs text-gray-600 mt-1">{task.notes}</p>}
                  <div className="text-xs text-gray-500 mt-1">
                    Completado por {task.completedBy} -{' '}
                    {new Date(task.completedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Inyección de Eventos */}
      {showInjectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Inyectar Evento No Planificado</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título del Evento</label>
                <input
                  type="text"
                  value={injectionData.title}
                  onChange={(e) =>
                    setInjectionData({ ...injectionData, title: e.target.value })
                  }
                  placeholder="Ej: Fallo en sistema de respaldo"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  value={injectionData.description}
                  onChange={(e) =>
                    setInjectionData({ ...injectionData, description: e.target.value })
                  }
                  placeholder="Describe el evento imprevisto..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Severidad</label>
                <select
                  value={injectionData.severity}
                  onChange={(e) =>
                    setInjectionData({ ...injectionData, severity: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInjectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleInjectEvent}
                disabled={!injectionData.title || !injectionData.description}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inyectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
