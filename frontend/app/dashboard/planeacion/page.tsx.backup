"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Target, Users, Upload, CheckCircle, Edit, Trash2, Building2, Lightbulb } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";
import CreatePolicyModal from "@/components/governance/CreatePolicyModal";
import CreateObjectiveModal from "@/components/governance/CreateObjectiveModal";
import EditPolicyModal from "@/components/governance/EditPolicyModal";
import EditObjectiveModal from "@/components/governance/EditObjectiveModal";
import RaciMatrixEditor from "@/components/governance/RaciMatrixEditor";
import GovernanceKPICards from "@/components/governance/GovernanceKPICards";
import CreateContextModal from "@/components/business-context/CreateContextModal";
import SwotEditor from "@/components/business-context/SwotEditor";

interface Policy {
  id: string;
  title: string;
  version: string;
  status: string;
  content: string;
  approvedAt: string | null;
  createdAt: string;
}

interface Objective {
  id: string;
  description: string;
  measurementCriteria: string;
  status: string;
  progress: number;
  owner: string;
  targetDate: string;
}

interface RaciMatrix {
  id: string;
  processOrActivity: string;
  assignments: any[];
  createdAt: string;
}

interface BusinessContext {
  id: string;
  title: string;
  description: string;
  content: string;
  elaborationDate: string;
  status: string;
  createdAt: string;
  swotAnalyses?: any[];
}

export default function PlaneacionPage() {
  const { t } = usePreferences();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [raciMatrices, setRaciMatrices] = useState<RaciMatrix[]>([]);
  const [contexts, setContexts] = useState<BusinessContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'context' | 'policies' | 'objectives' | 'raci'>('context');
  const [selectedContextForSwot, setSelectedContextForSwot] = useState<string | null>(null);
  
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      const [policiesRes, objectivesRes, raciRes, contextsRes] = await Promise.all([
        fetch(`${API_URL}/api/governance/policies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/governance/objectives`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/governance/raci-matrix`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/business-context/contexts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (policiesRes.ok) setPolicies(await policiesRes.json());
      if (objectivesRes.ok) setObjectives(await objectivesRes.json());
      if (raciRes.ok) setRaciMatrices(await raciRes.json());
      if (contextsRes.ok) setContexts(await contextsRes.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (id: string) => {
    if (!confirm('¿Eliminar esta política?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/governance/policies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Política eliminada');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleDeleteObjective = async (id: string) => {
    if (!confirm('¿Eliminar este objetivo?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/governance/objectives/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Objetivo eliminado');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleDeleteRaciMatrix = async (id: string) => {
    if (!confirm('¿Eliminar esta matriz RACI?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/governance/raci-matrix/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Matriz eliminada');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleDeleteContext = async (id: string) => {
    if (!confirm('¿Eliminar este contexto?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/business-context/contexts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Contexto eliminado');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const raciStats = raciMatrices.reduce((acc, matrix) => {
    matrix.assignments.forEach((assignment: any) => {
      if (assignment.raciType === 'RESPONSIBLE') acc.responsible++;
      if (assignment.raciType === 'ACCOUNTABLE') acc.accountable++;
      if (assignment.raciType === 'CONSULTED') acc.consulted++;
      if (assignment.raciType === 'INFORMED') acc.informed++;
    });
    return acc;
  }, { responsible: 0, accountable: 0, consulted: 0, informed: 0 });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      'REVIEW': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'APPROVED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'ACTIVE': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return badges[status] || badges['DRAFT'];
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'REVIEW': 'En Revisión',
      'APPROVED': 'Aprobado',
      'ACTIVE': 'Activo',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <CreatePolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} onSuccess={fetchData} />
      <CreateObjectiveModal isOpen={showObjectiveModal} onClose={() => setShowObjectiveModal(false)} onSuccess={fetchData} />
      <CreateContextModal isOpen={showContextModal} onClose={() => setShowContextModal(false)} onSuccess={fetchData} />
      <EditPolicyModal isOpen={!!editingPolicy} onClose={() => setEditingPolicy(null)} onSuccess={fetchData} policy={editingPolicy} />
      <EditObjectiveModal isOpen={!!editingObjective} onClose={() => setEditingObjective(null)} onSuccess={fetchData} objective={editingObjective} />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">{t('dashboard')}</Link>
          <span>/</span>
          <span>Módulo 1: {t('planning')}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('planning')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ISO 22301 Cláusula 5: Liderazgo y Compromiso
        </p>
      </div>

      <GovernanceKPICards
        policiesCount={policies.length}
        objectivesCount={objectives.length}
        raciStats={raciStats}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            {[
              { id: 'context', icon: Building2, label: t('business_context') },
              { id: 'policies', icon: FileText, label: t('policies') },
              { id: 'objectives', icon: Target, label: t('objectives') },
              { id: 'raci', icon: Users, label: t('raci_matrix') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'context' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {t('business_context')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Defina el contexto organizacional y realice análisis FODA
                  </p>
                </div>
                <button onClick={() => setShowContextModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <Upload className="w-4 h-4" />
                  {t('new_context')}
                </button>
              </div>

              {contexts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No hay contextos definidos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Comience definiendo el contexto de su organización</p>
                  <button onClick={() => setShowContextModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Crear Primer Contexto
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contexts.map((context) => (
                    <div key={context.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{context.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(context.status)}`}>
                              {getStatusLabel(context.status)}
                            </span>
                          </div>
                          {context.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{context.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>📅 {new Date(context.elaborationDate).toLocaleDateString()}</span>
                            {context.swotAnalyses && context.swotAnalyses.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Lightbulb className="w-4 h-4" />
                                {context.swotAnalyses.length} análisis FODA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedContextForSwot(selectedContextForSwot === context.id ? null : context.id)}
                          className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {selectedContextForSwot === context.id ? 'Ocultar' : 'Crear'} Análisis FODA
                        </button>
                        <button onClick={() => handleDeleteContext(context.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm">
                          <Trash2 className="w-4 h-4" />
                          {t('delete')}
                        </button>
                      </div>
                      {selectedContextForSwot === context.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <SwotEditor contextId={context.id} onSuccess={() => { setSelectedContextForSwot(null); fetchData(); }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'policies' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Gestión de Políticas</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Defina y apruebe la política de continuidad</p>
                </div>
                <button onClick={() => setShowPolicyModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No hay políticas</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Comience creando su primera política</p>
                  <button onClick={() => setShowPolicyModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Crear Primera Política
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{policy.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(policy.status)}`}>
                              {getStatusLabel(policy.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Versión {policy.version}</span>
                            <span>Creado: {new Date(policy.createdAt).toLocaleDateString()}</span>
                            {policy.approvedAt && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Aprobado {new Date(policy.approvedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/planeacion/policies/${policy.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                          Ver Detalles →
                        </Link>
                        <button onClick={() => setEditingPolicy(policy)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button onClick={() => handleDeletePolicy(policy.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm">
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Objetivos del SGCN</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Objetivos SMART medibles</p>
                </div>
                <button onClick={() => setShowObjectiveModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  + Nuevo Objetivo
                </button>
              </div>

              {objectives.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No hay objetivos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Establezca objetivos estratégicos</p>
                  <button onClick={() => setShowObjectiveModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Crear Primer Objetivo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{objective.description}</h3>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span className="font-medium">{objective.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${objective.progress || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-600 dark:text-gray-400">{objective.owner || 'Sin asignar'}</span>
                        <span className="text-gray-500">{objective.targetDate ? new Date(objective.targetDate).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingObjective(objective)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button onClick={() => handleDeleteObjective(objective.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'raci' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Matriz RACI</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Roles y responsabilidades</p>
              </div>
              <RaciMatrixEditor onSuccess={fetchData} />
              {raciMatrices.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Matrices Guardadas</h3>
                  {raciMatrices.map((matrix) => (
                    <div key={matrix.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{matrix.processOrActivity}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{matrix.assignments?.length || 0} asignaciones</p>
                      </div>
                      <button onClick={() => handleDeleteRaciMatrix(matrix.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">💡 Guía Rápida</h3>
        <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 1:</strong> Defina el contexto organizacional y realice un análisis FODA</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 2:</strong> Cree y apruebe la política con compromiso de la alta dirección</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 3:</strong> Defina objetivos SMART medibles</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Paso 4:</strong> Asigne roles claros con matriz RACI</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
