"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Target, Users, Upload, CheckCircle, AlertCircle } from "lucide-react";

interface Policy {
  id: string;
  title: string;
  version: string;
  status: string;
  approvedAt: string | null;
}

interface Objective {
  id: string;
  description: string;
  status: string;
  progress: number;
  owner: string;
}

export default function PlaneacionPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'policies' | 'objectives' | 'raci'>('policies');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      // Fetch policies
      const policiesRes = await fetch(`${API_URL}/api/governance/policies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (policiesRes.ok) {
        const data = await policiesRes.json();
        setPolicies(data);
      }

      // Fetch objectives  
      const objectivesRes = await fetch(`${API_URL}/api/governance/objectives`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (objectivesRes.ok) {
        const data = await objectivesRes.json();
        setObjectives(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 1: Planeación</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Planeación y Gobierno
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 5: Liderazgo y Compromiso - Establezca el marco fundamental del SGCN
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('policies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'policies'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Políticas del SGCN
              </div>
            </button>
            <button
              onClick={() => setActiveTab('objectives')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'objectives'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objetivos SMART
              </div>
            </button>
            <button
              onClick={() => setActiveTab('raci')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'raci'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Matriz RACI
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'policies' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Gestión de Políticas
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Defina y apruebe la política de continuidad de negocio de su organización
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Nueva Política
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay políticas creadas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Comience creando su primera política de continuidad de negocio
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Crear Primera Política
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {policy.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Versión {policy.version}</span>
                            {policy.approvedAt && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Aprobado {new Date(policy.approvedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            policy.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {policy.status === 'APPROVED' ? 'Aprobado' : 'En Revisión'}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Ver Detalles →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'objectives' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Objetivos del SGCN
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Defina objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes, Temporales)
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  + Nuevo Objetivo
                </button>
              </div>

              {objectives.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No hay objetivos definidos
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Establezca los objetivos estratégicos de su programa de resiliencia
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {objective.description}
                      </h3>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span className="font-medium">{objective.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${objective.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Responsable: <span className="font-medium">{objective.owner}</span>
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          objective.status === 'ON_TRACK' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {objective.status === 'ON_TRACK' ? 'En Curso' : 'En Riesgo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'raci' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Matriz RACI
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Defina roles y responsabilidades: Responsable, Aprobador, Consultado, Informado
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Editar Matriz
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Editor de Matriz RACI
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Funcionalidad en desarrollo. Próximamente podrá definir y gestionar roles 
                  y responsabilidades de forma visual e interactiva.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <AlertCircle className="w-4 h-4" />
                  Disponible en la próxima actualización
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          💡 Guía Rápida: Módulo de Planeación
        </h3>
        <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 1:</strong> Cree y apruebe la política de continuidad de negocio con el compromiso de la alta dirección</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 2:</strong> Defina objetivos SMART medibles y alineados con la estrategia organizacional</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 3:</strong> Asigne roles y responsabilidades claras mediante la matriz RACI</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Siguiente:</strong> Proceda al <Link href="/dashboard/analisis-riesgos" className="underline font-medium">Módulo 2: Análisis de Riesgos</Link></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
