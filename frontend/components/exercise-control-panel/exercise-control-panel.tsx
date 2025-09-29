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
    const statusConfig: Record<string, { color: string; label: string }> = {
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
    setShowInjectionModal(false);
    setInjectionData({ title: '', description: '', severity: 'MEDIUM' });
    onLogEvent({
      type: 'INJECTION',
      description: `Inyección: ${injectionData.title}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
          <p className="text-sm text-gray-600 mt-1">Tipo: {exercise.type}</p>
        </div>
        <div className="flex items-center space-x-4">
          {getStatusBadge()}
          {exercise.status === 'IN_PROGRESS' && (
            <div className="flex items-center text-blue-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-semibold">{elapsedTime}h transcurridas</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-4 mb-6">
        {exercise.status === 'PLANNED' && (
          <button
            onClick={onStart}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Play className="h-5 w-5 mr-2" />
            Iniciar Ejercicio
          </button>
        )}

        {exercise.status === 'IN_PROGRESS' && (
          <>
            <button
              onClick={() => setShowInjectionModal(true)}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Inyectar Evento
            </button>
            <button
              onClick={onFinish}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Square className="h-5 w-5 mr-2" />
              Finalizar Ejercicio
            </button>
          </>
        )}

        {exercise.status === 'COMPLETED' && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="font-semibold">Ejercicio Completado</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      {exercise.status !== 'PLANNED' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tiempo Objetivo (RTO)</p>
            <p className="text-2xl font-bold text-gray-900">{exercise.targetRto || 0}h</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tiempo Actual</p>
            <p className="text-2xl font-bold text-blue-600">{elapsedTime}h</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <p className="text-xl font-bold">
              {elapsedTime > (exercise.targetRto || 0) ? (
                <span className="text-red-600">Excedido</span>
              ) : (
                <span className="text-green-600">En Tiempo</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Event Log */}
      {exercise.executionLog && exercise.executionLog.events.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            <Activity className="inline-block h-5 w-5 mr-2" />
            Registro de Eventos
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {exercise.executionLog.events.map((event, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{event.type}</span>
                  <span className="text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-600 mt-1">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1">Por: {event.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Injection Modal */}
      {showInjectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Inyectar Evento No Planificado</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={injectionData.title}
                  onChange={(e) => setInjectionData({ ...injectionData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Fallo en sistema de respaldo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={injectionData.description}
                  onChange={(e) => setInjectionData({ ...injectionData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe el evento inyectado..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severidad
                </label>
                <select
                  value={injectionData.severity}
                  onChange={(e) => setInjectionData({ ...injectionData, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInjectionModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleInjectEvent}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                Inyectar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}