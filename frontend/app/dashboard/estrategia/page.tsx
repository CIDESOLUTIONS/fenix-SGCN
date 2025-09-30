"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lightbulb, AlertCircle, TrendingUp, DollarSign, CheckCircle, Sparkles, Target, Shield, AlertTriangle } from "lucide-react";

interface Strategy {
  id: string;
  processId: string;
  processName: string;
  type: string;
  description: string;
  estimatedCost: number;
  estimatedRTO: number;
  status: string;
  aiScore: number;
}

interface Scenario {
  id: string;
  name: string;
  category: string;
  severity: string;
  affectedProcesses: number;
}

export default function EstrategiaPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'strategies' | 'analysis'>('scenarios');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const scenariosRes = await fetch(`${API_URL}/api/scenarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (scenariosRes.ok) {
        const data = await scenariosRes.json();
        setScenarios(data);
      }

      const strategiesRes = await fetch(`${API_URL}/api/strategies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (strategiesRes.ok) {
        const data = await strategiesRes.json();
        setStrategies(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 4: Estrategias</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Escenarios y Estrategias de Continuidad
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 8.3 - Defina estrategias para cumplir RTO/RPO
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Escenarios Definidos</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{scenarios.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estrategias Activas</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {strategies.filter(s => s.status === 'APPROVED').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Inversión Estimada</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${strategies.reduce((sum, s) => sum + (s.estimatedCost || 0), 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cobertura Procesos</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(strategies.map(s => s.processId)).size}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scenarios'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Biblioteca de Escenarios
              </div>
            </button>
            <button
              onClick={() => setActiveTab('strategies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'strategies'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Estrategias Definidas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analysis'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Análisis de Brechas
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* SCENARIOS TAB */}
          {activeTab === 'scenarios' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Escenarios de Disrupción
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Biblioteca de amenazas y eventos que pueden interrumpir las operaciones
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  + Nuevo Escenario
                </button>
              </div>

              {scenarios.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay escenarios definidos
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Comience definiendo escenarios de amenaza para su organización
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Explorar Biblioteca Predefinida
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {scenario.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(scenario.severity)}`}>
                          {scenario.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Categoría: {scenario.category}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {scenario.affectedProcesses} procesos afectados
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STRATEGIES TAB */}
          {activeTab === 'strategies' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Motor de Recomendación IA
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estrategias sugeridas y seleccionadas para cada proceso crítico
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all">
                  <Sparkles className="w-4 h-4" />
                  Generar Recomendaciones IA
                </button>
              </div>

              {strategies.length === 0 ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 p-8 text-center">
                  <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Recomendaciones Inteligentes con IA
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    El motor de IA analiza sus procesos críticos y RTO/RPO definidos para sugerir 
                    estrategias viables que cumplan sus objetivos de recuperación.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <Target className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Cumplimiento RTO
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sugiere solo estrategias que cumplan el RTO objetivo
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <DollarSign className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Análisis Costo
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Compara CAPEX/OPEX de cada opción
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Viabilidad
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Evalúa recursos y dependencias
                      </p>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Comenzar Análisis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {strategy.processName}
                            </h3>
                            {strategy.aiScore >= 8 && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs font-medium">
                                <Sparkles className="w-3 h-3" />
                                IA Score: {strategy.aiScore}/10
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {strategy.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">
                                Costo: <span className="font-medium text-gray-900 dark:text-white">
                                  ${strategy.estimatedCost.toLocaleString()}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">
                                RTO Estimado: <span className="font-medium text-gray-900 dark:text-white">
                                  {strategy.estimatedRTO}h
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          strategy.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {strategy.status === 'APPROVED' ? 'Aprobado' : 'En Evaluación'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                          Ver Análisis Completo →
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                          Comparar Alternativas
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GAP ANALYSIS TAB */}
          {activeTab === 'analysis' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Análisis de Brechas de Recursos
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identifique recursos faltantes para implementar estrategias seleccionadas
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Gap Analysis Automático
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  El sistema compara automáticamente los recursos requeridos por cada estrategia 
                  con los recursos disponibles catalogados, identificando brechas críticas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Personal</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Infraestructura</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Proveedores</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Información</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Defina estrategias primero para ver el análisis de brechas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          💡 Flujo de Trabajo: Estrategias
        </h3>
        <ol className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Revise la <strong>biblioteca de escenarios</strong> y seleccione amenazas relevantes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Use el <strong>motor IA</strong> para obtener recomendaciones de estrategias</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Compare <strong>costo vs efectividad</strong> de cada opción</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Ejecute <strong>análisis de brechas</strong> para identificar recursos faltantes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Siguiente: <Link href="/dashboard/planes" className="underline font-semibold">Módulo 5: Implementar en Planes</Link></span>
          </li>
        </ol>
      </div>
    </div>
  );
}
