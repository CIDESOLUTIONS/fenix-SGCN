"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Target, Users, Upload, CheckCircle, Edit, Trash2, Building2, Lightbulb, Network, X } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";
import CreatePolicyModal from "@/components/governance/CreatePolicyModal";
import CreateObjectiveModal from "@/components/governance/CreateObjectiveModal";
import EditPolicyModal from "@/components/governance/EditPolicyModal";
import EditObjectiveModal from "@/components/governance/EditObjectiveModal";
import RaciMatrixEditor from "@/components/governance/RaciMatrixEditor";
import GovernanceKPICards from "@/components/governance/GovernanceKPICards";
import EditContextModal from "@/components/business-context/EditContextModal";
import CreateContextModal from "@/components/business-context/CreateContextModal";
import SwotEditor from "@/components/business-context/SwotEditor";
import BusinessProcessEditor from "@/components/business-processes/BusinessProcessEditor";
import EditBusinessProcessModal from "@/components/business-processes/EditBusinessProcessModal";

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
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface BusinessProcess {
  id: string;
  processId?: string; // ID autogenerado: P[Tipo][Criticidad][###]
  name: string;
  description?: string;
  highLevelCharacterization?: string;
  processType?: 'STRATEGIC' | 'CORE' | 'SUPPORT';
  includeInContinuityAnalysis: boolean;
  prioritizationCriteria?: {
    strategic: number;
    operational: number;
    financial: number;
    regulatory: number;
  };
  priorityScore?: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export default function PlaneacionPage() {
  const { t } = usePreferences();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [raciMatrices, setRaciMatrices] = useState<RaciMatrix[]>([]);
  const [contexts, setContexts] = useState<BusinessContext[]>([]);
  const [businessProcesses, setBusinessProcesses] = useState<BusinessProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'context' | 'policies' | 'objectives' | 'raci' | 'processes'>('context');
  const [selectedContextForSwot, setSelectedContextForSwot] = useState<string | null>(null);
  
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [editingContext, setEditingContext] = useState<BusinessContext | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [editingRaciMatrix, setEditingRaciMatrix] = useState<RaciMatrix | null>(null);
  const [editingSwot, setEditingSwot] = useState<any | null>(null);
  const [editingProcess, setEditingProcess] = useState<BusinessProcess | null>(null);
  const [loadingSwot, setLoadingSwot] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const loadFullSwotData = async (swotId: string, contextId: string) => {
    setLoadingSwot(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/business-context/swot/${swotId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const fullSwotData = await response.json();
        setEditingSwot({ ...fullSwotData, contextId });
      } else {
        alert('Error al cargar datos del FODA');
      }
    } catch (error) {
      console.error('Error loading SWOT:', error);
      alert('Error al cargar datos del FODA');
    } finally {
      setLoadingSwot(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [policiesRes, objectivesRes, raciRes, contextsRes, processesRes] = await Promise.all([
        fetch('/api/governance/policies', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/governance/objectives', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/governance/raci-matrix', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/business-context/contexts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/business-processes', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (policiesRes.ok) setPolicies(await policiesRes.json());
      if (objectivesRes.ok) setObjectives(await objectivesRes.json());
      if (raciRes.ok) setRaciMatrices(await raciRes.json());
      if (contextsRes.ok) setContexts(await contextsRes.json());
      if (processesRes.ok) {
        const processesData = await processesRes.json();
        console.log('📊 Procesos cargados:', processesData.length, processesData);
        setBusinessProcesses(processesData);
      } else {
        console.error('❌ Error cargando procesos:', processesRes.status);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (id: string) => {
    if (!window.confirm('⚠️ ¿Eliminar esta política PERMANENTEMENTE?\nEsta acción NO se puede deshacer.')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/governance/policies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('✓ Política eliminada');
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
      const response = await fetch(`/api/governance/objectives/${id}`, {
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
      const response = await fetch(`/api/governance/raci-matrix/${id}`, {
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
    const confirmed = window.confirm(
      '⚠️ ADVERTENCIA: ¿Está seguro de que desea ELIMINAR PERMANENTEMENTE este contexto?\n\n' +
      'Esta acción:'+
      '\n• Eliminará el contexto de manera irreversible\n' +
      '• Borrará todos los análisis FODA asociados\n' +
      '• NO se puede deshacer\n\n' +
      'Para confirmar, haga clic en Aceptar.'
    );
    
    if (!confirmed) return;
    
    // Segunda confirmación
    const doubleCheck = window.prompt(
      'Para confirmar la eliminación, escriba "ELIMINAR" (en mayúsculas):'
    );
    
    if (doubleCheck !== 'ELIMINAR') {
      alert('Eliminación cancelada. El contexto NO fue eliminado.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/business-context/contexts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('✓ Contexto eliminado');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleDeleteProcess = async (id: string) => {
    if (!confirm('¿Eliminar este proceso?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/business-processes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Proceso eliminado');
        fetchData();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const getProcessTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'STRATEGIC': 'Estratégico',
      'CORE': 'Misional',
      'SUPPORT': 'Soporte',
    };
    return type ? labels[type] || type : '-';
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

  // Calcular estadísticas de procesos
  const processesStats = {
    total: businessProcesses.length,
    inAnalysis: businessProcesses.filter(p => p.includeInContinuityAnalysis).length,
    byType: {
      strategic: businessProcesses.filter(p => p.processType === 'STRATEGIC').length,
      core: businessProcesses.filter(p => p.processType === 'CORE').length,
      support: businessProcesses.filter(p => p.processType === 'SUPPORT').length,
    }
  };

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

  const generatePlanningDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Obtener procesos seleccionados para análisis
      const selectedProcesses = businessProcesses.filter(p => p.includeInContinuityAnalysis);
      
      const response = await fetch('/api/reports/planning-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          includeContexts: true,
          includePolicies: true,
          includeObjectives: true,
          includeRaciMatrices: true,
          includeSelectedProcesses: true,
          selectedProcessIds: selectedProcesses.map(p => p.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar documento');
      }

      // Descargar el PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Documento_Planeacion_SGCN_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('✓ Documento PDF generado y descargado exitosamente');
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error al generar documento: ' + error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <CreatePolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} onSuccess={fetchData} />
      <CreateObjectiveModal isOpen={showObjectiveModal} onClose={() => setShowObjectiveModal(false)} onSuccess={fetchData} />
      <CreateContextModal isOpen={showContextModal} onClose={() => setShowContextModal(false)} onSuccess={fetchData} />
      <EditContextModal 
        isOpen={!!editingContext} 
        onClose={() => setEditingContext(null)} 
        onSuccess={fetchData} 
        context={editingContext}
      />
      <EditPolicyModal isOpen={!!editingPolicy} onClose={() => setEditingPolicy(null)} onSuccess={fetchData} policy={editingPolicy} />
      <EditObjectiveModal isOpen={!!editingObjective} onClose={() => setEditingObjective(null)} onSuccess={fetchData} objective={editingObjective} />
      <EditBusinessProcessModal 
        process={editingProcess} 
        isOpen={!!editingProcess} 
        onClose={() => setEditingProcess(null)} 
        onSuccess={fetchData} 
      />

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
        processesStats={processesStats}
      />

      {/* Botón para generar documento PDF */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={generatePlanningDocument}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generar Documento de Planeación (PDF)
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            {[
              { id: 'context', icon: Building2, label: t('business_context') },
              { id: 'policies', icon: FileText, label: t('policies') },
              { id: 'objectives', icon: Target, label: t('objectives') },
              { id: 'raci', icon: Users, label: t('raci_matrix') },
              { id: 'processes', icon: Network, label: 'Procesos de Negocio' }
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
                            {context.fileName && (
                              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                <FileText className="w-4 h-4" />
                                <a 
                                  href={context.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {context.fileName}
                                </a>
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
                        {context.status === 'DRAFT' && (
                          <button 
                            onClick={() => setEditingContext(context)} 
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                        )}
                        <button onClick={() => handleDeleteContext(context.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm">
                          <Trash2 className="w-4 h-4" />
                          {t('delete')}
                        </button>
                      </div>
                      {selectedContextForSwot === context.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <SwotEditor 
                            contextId={context.id} 
                            onSuccess={() => { 
                              setSelectedContextForSwot(null); 
                              fetchData(); // Recargar datos para mostrar SWOT guardado
                            }} 
                          />
                        </div>
                      )}
                      
                      {/* Editor de SWOT para edición */}
                      {editingSwot && editingSwot.contextId === context.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editar Análisis FODA</h4>
                            <button 
                              onClick={() => setEditingSwot(null)}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <SwotEditor 
                            contextId={context.id}
                            existingSwot={editingSwot}
                            onSuccess={() => { 
                              setEditingSwot(null);
                              fetchData();
                            }} 
                          />
                        </div>
                      )}
                      
                      {/* Mostrar SWOT existentes */}
                      {context.swotAnalyses && context.swotAnalyses.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Análisis FODA Existentes
                          </h4>
                          {context.swotAnalyses.map((swot: any, index: number) => (
                            <div key={swot.id || index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">{swot.title}</h5>
                                <div className="flex gap-2">
                                  <button
                                  onClick={() => loadFullSwotData(swot.id, context.id)}
                                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm('¿Eliminar este análisis FODA?')) {
                                        try {
                                          const token = localStorage.getItem('token');
                                          const response = await fetch(`/api/business-context/swot/${swot.id}`, {
                                            method: 'DELETE',
                                            headers: { 'Authorization': `Bearer ${token}` },
                                          });
                                          if (response.ok) {
                                            alert('Análisis FODA eliminado');
                                            fetchData();
                                          }
                                        } catch (error) {
                                          alert('Error al eliminar');
                                        }
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{swot.description}</p>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                <span>Facilitador: {swot.facilitator}</span>
                                {swot.participants && swot.participants.length > 0 && (
                                  <span className="ml-4">Participantes: {swot.participants.join(', ')}</span>
                                )}
                              </div>
                              {swot.crossingAnalysis && (
                                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                  <p className="text-xs font-medium text-indigo-900 dark:text-indigo-200 mb-1">✨ Análisis con IA:</p>
                                  <p className="text-xs text-indigo-800 dark:text-indigo-300">{swot.crossingAnalysis.substring(0, 150)}...</p>
                                </div>
                              )}
                            </div>
                          ))}
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
              <RaciMatrixEditor 
                onSuccess={fetchData} 
                existingMatrix={editingRaciMatrix || undefined}
              />
              {raciMatrices.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Matrices Guardadas</h3>
                  {raciMatrices.map((matrix) => (
                    <div key={matrix.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{matrix.processOrActivity}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{matrix.assignments?.length || 0} asignaciones</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingRaciMatrix(matrix)} 
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button onClick={() => handleDeleteRaciMatrix(matrix.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
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

          {activeTab === 'processes' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Procesos de Negocio</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Caracterización y priorización de procesos para análisis de continuidad</p>
              </div>
              <BusinessProcessEditor onSuccess={fetchData} />
              {businessProcesses.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procesos Registrados ({businessProcesses.length})</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {businessProcesses.map((process) => (
                      <div key={process.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {process.processId && (
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded font-mono text-xs font-semibold">
                                  {process.processId}
                                </span>
                              )}
                              <h4 className="font-semibold text-gray-900 dark:text-white">{process.name}</h4>
                              {process.processType && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  {getProcessTypeLabel(process.processType)}
                                </span>
                              )}
                              {process.includeInContinuityAnalysis && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  ✓ En Análisis
                                </span>
                              )}
                            </div>
                            {process.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{process.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>📅 {new Date(process.createdAt).toLocaleDateString()}</span>
                              {process.priorityScore && !isNaN(Number(process.priorityScore)) && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Score:</span> {Number(process.priorityScore).toFixed(2)}/10
                                </span>
                              )}
                              {process.fileName && (
                                <span className="flex items-center gap-1">
                                  📎 {process.fileName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingProcess(process)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          {process.fileName && (
                            <button 
                              onClick={() => alert('Funcionalidad para eliminar archivos disponible en próxima versión')}
                              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar Archivo
                            </button>
                          )}
                          <button onClick={() => handleDeleteProcess(process.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Eliminar Proceso
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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

