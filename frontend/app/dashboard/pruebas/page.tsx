"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TestTube, Calendar, Play, FileText, Camera, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  type: string;
  planId: string;
  planName: string;
  scheduledDate: string;
  status: string;
  score: string | null;
  participants: number;
  duration: number | null;
}

export default function PruebasPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'execute' | 'reports'>('schedule');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const response = await fetch(`${API_URL}/api/exercises`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'DESKTOP': 'Ejercicio de Mesa',
      'FUNCTIONAL': 'Prueba Funcional',
      'SIMULATION': 'Simulación Completa',
      'FULL_RECOVERY': 'Recuperación Total'
    };
    return types[type] || type;
  };

  const getScoreColor = (score: string | null) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    switch (score) {
      case 'PASS': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PASS_WITH_OBSERVATIONS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'FAIL': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreIcon = (score: string | null) => {
    if (!score) return AlertCircle;
    switch (score) {
      case 'PASS': return CheckCircle;
      case 'FAIL': return XCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 6: Pruebas</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pruebas de Continuidad
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 8.5 - Valide planes con ejercicios y scoring automático
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ejercicios Realizados</span>
            <TestTube className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {exercises.filter(e => e.status === 'COMPLETED').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de Éxito</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {exercises.length > 0 
              ? Math.round((exercises.filter(e => e.score === 'PASS').length / exercises.filter(e => e.score).length) * 100) || 0
              : 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Próximo Ejercicio</span>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {exercises.filter(e => e.status === 'SCHEDULED').length > 0 ? 'Programado' : 'Sin programar'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hallazgos Abiertos</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'schedule'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendario de Pruebas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('execute')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'execute'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Ejecución en Vivo
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reportes y Analytics
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Programa Anual de Ejercicios
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Planifique y programe pruebas de continuidad de forma sistemática
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  + Programar Ejercicio
                </button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay ejercicios programados
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cree su primer ejercicio para validar la efectividad de sus planes
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Crear Primer Ejercicio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise) => {
                    const ScoreIcon = getScoreIcon(exercise.score);
                    return (
                      <div key={exercise.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {exercise.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {getTypeLabel(exercise.type)} • {exercise.planName}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                📅 {new Date(exercise.scheduledDate).toLocaleDateString()}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                👥 {exercise.participants} participantes
                              </span>
                              {exercise.duration && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  ⏱️ {exercise.duration} min
                                </span>
                              )}
                            </div>
                          </div>
                          {exercise.score && (
                            <div className="flex items-center gap-2">
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(exercise.score)}`}>
                                <ScoreIcon className="w-4 h-4" />
                                {exercise.score === 'PASS' ? 'APROBADO' : exercise.score === 'FAIL' ? 'FALLIDO' : 'CON OBSERVACIONES'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Ver Detalles →
                          </button>
                          {exercise.status === 'SCHEDULED' && (
                            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                              Ejecutar Ahora
                            </button>
                          )}
                          {exercise.status === 'COMPLETED' && (
                            <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                              Ver Reporte
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EXECUTE TAB */}
          {activeTab === 'execute' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Orquestación de Ejercicios en Vivo
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Panel de control para facilitar y documentar ejercicios en tiempo real
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-12 text-center">
                <Play className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Modo Ejercicio - Panel en Vivo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Durante la ejecución de un ejercicio, este panel proporciona control total 
                  sobre el flujo, registro de eventos y captura de evidencias.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Play className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Cronómetro
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Registro automático de tiempos
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Evidencias
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Captura foto/video
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Bitácora
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Log de eventos
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Scoring
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Evaluación automática
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  El scoring automático compara tiempos reales vs RTO/RPO objetivos
                </p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Iniciar Modo Ejercicio
                </button>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Reportes Post-Ejercicio
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generación automática de informes y análisis de tendencias
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-8">
                <div className="text-center mb-8">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analytics y Reportes Automáticos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Al finalizar cada ejercicio, el sistema genera automáticamente un reporte 
                    completo con scoring, observaciones, evidencias y recomendaciones.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      📊 Contenido del Reporte
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Objetivos vs Resultados alcanzados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Cronología completa de eventos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Comparación RTO real vs objetivo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Evidencias multimedia adjuntas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Hallazgos y brechas identificadas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      📈 Analytics de Tendencias
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Evolución de la tasa de éxito</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Mejora en tiempos de recuperación</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Comparativo entre iteraciones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Indicadores de madurez del programa</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Los hallazgos se integran automáticamente con el <Link href="/dashboard/mantenimiento" className="underline font-semibold">Módulo 7: Mejora Continua</Link>
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Ver Historial de Reportes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          💡 Tipos de Ejercicios ISO 22301
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800 dark:text-indigo-200">
          <div>
            <p className="font-semibold mb-2">Ejercicios Teóricos:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong>Mesa (Tabletop):</strong> Discusión de escenarios sin ejecución real</li>
              <li><strong>Walkthrough:</strong> Revisión paso a paso de procedimientos</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Ejercicios Prácticos:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong>Funcional:</strong> Prueba de sistemas/procesos específicos</li>
              <li><strong>Simulación:</strong> Activación completa sin afectar producción</li>
              <li><strong>Recuperación Total:</strong> Validación real con failover</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            <strong>Siguiente:</strong> Los hallazgos generan acciones automáticas en el{' '}
            <Link href="/dashboard/mantenimiento" className="underline font-semibold">
              Módulo 7: Mejora Continua
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
