"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Settings, Users, Workflow, Database, FileText, BarChart3, Zap } from "lucide-react";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'workflow' | 'integrations' | 'templates' | 'dashboards'>('users');

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Configuración</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestión de usuarios, motores transversales e integraciones
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            {[
              { id: 'users', icon: Users, label: 'Usuarios y Roles' },
              { id: 'workflow', icon: Workflow, label: 'Motor de Workflows' },
              { id: 'integrations', icon: Zap, label: 'Integraciones ITSM' },
              { id: 'templates', icon: FileText, label: 'Plantillas y Documentos' },
              { id: 'dashboards', icon: BarChart3, label: 'Configuración BI' }
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
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Gestión de Usuarios y Roles (RBAC)
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Control de acceso basado en roles y permisos granulares
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  + Nuevo Usuario
                </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 p-8 text-center">
                <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Sistema RBAC Avanzado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Roles: Gestor SGCN, Propietario Plan, Analista Riesgos, Auditor
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">0</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Usuarios Activos</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">5</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Roles Definidos</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">3</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Grupos</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">SSO</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Active Directory</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Motor de Workflows No-Code
              </h2>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-8">
                <Workflow className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                  Constructor Visual de Workflows
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-2xl mx-auto">
                  Automatice aprobaciones, revisiones y notificaciones sin código
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 mb-1">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Workflows Activos</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 mb-1">45</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tareas Automatizadas</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 mb-1">98%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Éxito</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Integraciones ITSM y CMDB
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'ServiceNow', status: 'connected', icon: '🔗', description: 'CMDB y gestión de incidentes' },
                  { name: 'Jira', status: 'available', icon: '📋', description: 'Gestión de tareas y proyectos' },
                  { name: 'Microsoft Teams', status: 'available', icon: '💬', description: 'Notificaciones en tiempo real' },
                  { name: 'Slack', status: 'available', icon: '📢', description: 'Alertas y colaboración' },
                  { name: 'Active Directory', status: 'connected', icon: '🔐', description: 'SSO y sincronización usuarios' }
                ].map((integration) => (
                  <div key={integration.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      integration.status === 'connected' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {integration.status === 'connected' ? 'Conectado' : 'Disponible'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Plantillas y Sistema Documental
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-8">
                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                  Gestor de Plantillas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Plantillas ISO 22301, formularios dinámicos y generación de informes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-1">25</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plantillas ISO</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-1">15</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Formularios</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-1">PDF</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generación Reportes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboards' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Configuración BI y Dashboards
              </h2>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-8">
                <BarChart3 className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                  Constructor de Dashboards
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Paneles personalizables, widgets y analítica en tiempo real
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600 mb-1">8</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dashboards</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600 mb-1">45</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Widgets</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600 mb-1">5</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roles con Acceso</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          ⚙️ Motores Transversales
        </h3>
        <p className="text-yellow-800 dark:text-yellow-200">
          Los motores configurados aquí dan servicio a todos los módulos del SGCN, 
          automatizando procesos y manteniendo la consistencia del sistema.
        </p>
      </div>
    </div>
  );
}
