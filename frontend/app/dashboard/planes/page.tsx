"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Play, CheckCircle, Clock, Users, AlertTriangle, Zap, Database } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  type: string;
  processId: string;
  processName: string;
  status: string;
  lastActivated: string | null;
  lastTested: string | null;
  coverage: number;
  rtoTarget: number;
}

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'editor' | 'activation'>('plans');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const response = await fetch(`${API_URL}/api/continuity-plans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BCP': return FileText;
      case 'DRP': return Database;
      case 'IRP': return AlertTriangle;
      default: return FileText;
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 5: Planes</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Planes de Continuidad
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 8.4 - BCP, DRP e IRP dinámicos y accionables
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Planes Activos</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {plans.filter(p => p.status === 'ACTIVE').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cobertura de Procesos</span>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.coverage, 0) / plans.length) : 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Última Activación</span>
            <Play className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {plans.filter(p => p.lastActivated).length > 0 ? 'Reciente' : 'Ninguna'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Planes Vencidos</span>
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'plans'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Gestión de Planes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'editor'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Editor Visual
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activation'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Activación en Vivo
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* PLANS TAB */}
          {activeTab === 'plans' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Biblioteca de Planes
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Planes de Continuidad de Negocio, Recuperación TI y Respuesta a Incidentes
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  + Nuevo Plan
                </button>
              </div>

              {plans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay planes de continuidad
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cree su primer plan de continuidad basado en estrategias definidas
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Crear Desde Plantilla
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => {
                    const TypeIcon = getTypeIcon(plan.type);
                    return (
                      <div key={plan.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <TypeIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {plan.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {plan.processName} • RTO Objetivo: {plan.rtoTarget}h
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <Users className="w-4 h-4" />
                                  Cobertura: {plan.coverage}%
                                </span>
                                {plan.lastTested && (
                                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Probado: {new Date(plan.lastTested).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Ver Detalles →
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                            Editar Plan
                          </button>
                          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                            Activar Plan
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Editor Visual de Playbooks
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop para construir flujos de recuperación dinámicos
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-800 p-12 text-center">
                <Zap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Editor Visual Drag & Drop
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Construya playbooks visuales arrastrando pasos, decisiones y puntos de control.
                  Los planes se actualizan automáticamente con datos de otros módulos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Contenido Dinámico
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Auto-población de contactos y recursos
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Asignación de Roles
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tareas automáticas por rol
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Database className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Sincronización ITSM
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Integración ServiceNow/Jira
                    </p>
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Abrir Editor
                </button>
              </div>
            </div>
          )}

          {/* ACTIVATION TAB */}
          {activeTab === 'activation' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Orquestador de Planes en Vivo
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active y orqueste la ejecución de planes durante incidentes reales
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-8">
                <div className="text-center mb-8">
                  <Play className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Panel de Activación de Planes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Cuando ocurre un incidente, active el plan correspondiente desde aquí.
                    El sistema orquestará automáticamente tareas, notificaciones y seguimiento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      ✅ Capacidades de Activación
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Notificación automática del equipo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Creación de tareas en ITSM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Seguimiento de progreso en tiempo real</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Registro de decisiones y eventos</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      📱 Acceso Móvil
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>App nativa para iOS/Android</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Acceso offline a planes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Marcar tareas completadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Chat de equipo integrado</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                    Ir a Panel de Crisis
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
          💡 Flujo de Planes Dinámicos
        </h3>
        <ol className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
          <li><strong>1.</strong> Cree planes basados en estrategias aprobadas del Módulo 4</li>
          <li><strong>2.</strong> Use el editor visual para construir playbooks paso a paso</li>
          <li><strong>3.</strong> Los planes se actualizan automáticamente con datos de BIA y Gobierno</li>
          <li><strong>4.</strong> Active planes durante incidentes reales desde el orquestador</li>
          <li><strong>5.</strong> Siguiente: <Link href="/dashboard/pruebas" className="underline font-semibold">Módulo 6: Probar Planes</Link></li>
        </ol>
      </div>
    </div>
  );
}
