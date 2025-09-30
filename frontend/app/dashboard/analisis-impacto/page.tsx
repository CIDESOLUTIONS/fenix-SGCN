"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, Database, Zap } from "lucide-react";

interface BIAAssessment {
  id: string;
  processId: string;
  processName: string;
  status: string;
  mtpd: number;
  rto: number;
  rpo: number;
  criticalityScore: number;
  lastUpdated: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  totalProcesses: number;
  completedAssessments: number;
  deadline: string;
}

export default function BIAPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [assessments, setAssessments] = useState<BIAAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'campaigns' | 'assessments' | 'map' | 'wizard'>('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const campaignsRes = await fetch(`${API_URL}/api/bia-campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setCampaigns(data);
      }

      const assessmentsRes = await fetch(`${API_URL}/api/bia-assessments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (assessmentsRes.ok) {
        const data = await assessmentsRes.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCriticalityColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (score >= 5) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
  };

  const getCriticalityLabel = (score: number) => {
    if (score >= 8) return 'CRÍTICO';
    if (score >= 5) return 'ALTO';
    return 'MEDIO';
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 3: BIA</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Análisis de Impacto al Negocio (BIA)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 8.2.2 & ISO 22317 - Identifique procesos críticos y defina RTO/RPO
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Procesos Evaluados</span>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{assessments.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Procesos Críticos</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {assessments.filter(a => a.criticalityScore >= 8).length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">RTO Promedio</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {assessments.length > 0 
              ? Math.round(assessments.reduce((sum, a) => sum + a.rto, 0) / assessments.length) 
              : 0}h
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Campañas Activas</span>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaigns.filter(c => c.status === 'ACTIVE').length}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveView('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'campaigns'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Campañas BIA
              </div>
            </button>
            <button
              onClick={() => setActiveView('assessments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'assessments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Evaluaciones
              </div>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'map'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mapa de Dependencias
              </div>
            </button>
            <button
              onClick={() => setActiveView('wizard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'wizard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Asistente IA
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* CAMPAIGNS VIEW */}
          {activeView === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Gestión de Campañas BIA
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Organice evaluaciones de impacto por períodos o departamentos
                  </p>
                </div>
                <button 
                  onClick={() => setShowNewCampaign(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  + Nueva Campaña
                </button>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay campañas BIA activas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cree su primera campaña para comenzar a evaluar procesos críticos
                  </p>
                  <button 
                    onClick={() => setShowNewCampaign(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Crear Primera Campaña
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => {
                    const progress = campaign.totalProcesses > 0 
                      ? (campaign.completedAssessments / campaign.totalProcesses) * 100 
                      : 0;
                    
                    return (
                      <div key={campaign.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {campaign.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Fecha límite: {new Date(campaign.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {campaign.status === 'ACTIVE' ? 'Activa' : 'Completada'}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progreso</span>
                            <span className="font-medium">
                              {campaign.completedAssessments} / {campaign.totalProcesses} procesos
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Ver Detalles →
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                            Enviar Recordatorios
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ASSESSMENTS VIEW */}
          {activeView === 'assessments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Evaluaciones de Impacto
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Resultados consolidados de BIA por proceso de negocio
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Exportar Reporte
                </button>
              </div>

              {assessments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay evaluaciones completadas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete evaluaciones BIA para ver resultados aquí
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          Proceso
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          Criticidad
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          MTPD
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          RTO
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          RPO
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          Estado
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((assessment) => (
                        <tr key={assessment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {assessment.processName}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(assessment.criticalityScore)}`}>
                              {getCriticalityLabel(assessment.criticalityScore)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                            {assessment.mtpd}h
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                            {assessment.rto}h
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                            {assessment.rpo}h
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessment.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {assessment.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* DEPENDENCY MAP VIEW */}
          {activeView === 'map' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Mapa de Dependencias
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualice dependencias interactivas y puntos únicos de fallo (SPOF)
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Editar Mapa
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Editor Visual de Dependencias
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Funcionalidad avanzada de mapeo interactivo con drag & drop. 
                  Identificación automática de SPOF y análisis de impacto multinivel.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-lg text-left text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Drag & drop de activos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Detección SPOF automática</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Integración CMDB/ITSM</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Vista en tiempo real</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI WIZARD VIEW */}
          {activeView === 'wizard' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Asistente BIA con IA
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sugerencias inteligentes de RTO/RPO basadas en benchmarks de la industria
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 p-8 text-center">
                <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  IA para BIA Inteligente
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  El asistente con IA analiza procesos similares en su organización y benchmarks 
                  anónimos de la industria para sugerir valores apropiados de RTO/RPO y MTPD.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Benchmarking
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Compara con procesos similares
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Database className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Datos Históricos
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Aprende de evaluaciones previas
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <Zap className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Sugerencias
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      RTO/RPO contextuales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          💡 Flujo Recomendado BIA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800 dark:text-indigo-200">
          <div>
            <p className="font-medium mb-2">Preparación:</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Cree una campaña BIA</li>
              <li>Seleccione procesos a evaluar</li>
              <li>Envíe encuestas a propietarios</li>
            </ol>
          </div>
          <div>
            <p className="font-medium mb-2">Ejecución:</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Use asistente IA para sugerencias</li>
              <li>Map dependencias visuales</li>
              <li>Identifique SPOF críticos</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            <strong>Siguiente paso:</strong> Con RTO/RPO definidos, proceda al{' '}
            <Link href="/dashboard/estrategia" className="underline font-semibold">
              Módulo 4: Estrategias de Continuidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
