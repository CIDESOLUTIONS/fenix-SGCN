'use client';

import { useState } from 'react';
import { AlertCircle, Users, MessageSquare, PhoneCall, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CrisisManagementPage() {
  const [crisisActive, setCrisisActive] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');

  const activateCrisis = () => {
    if (confirm('¿Está seguro de activar el plan de gestión de crisis?')) {
      setCrisisActive(true);
    }
  };

  const deactivateCrisis = () => {
    if (confirm('¿Confirma la desactivación del plan de crisis?')) {
      setCrisisActive(false);
    }
  };

  const crisisTeam = [
    { role: 'Director de Crisis', name: 'CEO', phone: '+1 (555) 001-0001', status: 'active' },
    { role: 'Comunicaciones', name: 'CCO', phone: '+1 (555) 001-0002', status: 'active' },
    { role: 'Operaciones', name: 'COO', phone: '+1 (555) 001-0003', status: 'standby' },
    { role: 'Legal', name: 'Abogado Principal', phone: '+1 (555) 001-0004', status: 'standby' },
    { role: 'TI', name: 'CTO', phone: '+1 (555) 001-0005', status: 'active' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Crisis</h1>
        <p className="text-gray-500 mt-1">Centro de comando para manejo de situaciones críticas</p>
      </div>

      {/* Crisis Activation Button */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              crisisActive ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <AlertTriangle className={`w-8 h-8 ${crisisActive ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {crisisActive ? 'CRISIS ACTIVA' : 'Sistema en Operación Normal'}
              </h2>
              <p className="text-sm text-gray-500">
                {crisisActive 
                  ? `Nivel: ${crisisLevel} | Activado hace 2 horas`
                  : 'Todos los sistemas operando normalmente'
                }
              </p>
            </div>
          </div>

          {!crisisActive ? (
            <button
              onClick={activateCrisis}
              className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              🚨 ACTIVAR PLAN DE CRISIS
            </button>
          ) : (
            <button
              onClick={deactivateCrisis}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-bold"
            >
              ✅ DESACTIVAR CRISIS
            </button>
          )}
        </div>

        {crisisActive && (
          <div className="mt-6 grid grid-cols-4 gap-4">
            {(['Low', 'Medium', 'High', 'Critical'] as const).map(level => (
              <button
                key={level}
                onClick={() => setCrisisLevel(level)}
                className={`px-4 py-2 rounded-lg border-2 font-medium ${
                  crisisLevel === level
                    ? level === 'Critical' ? 'bg-red-600 text-white border-red-600'
                      : level === 'High' ? 'bg-orange-600 text-white border-orange-600'
                      : level === 'Medium' ? 'bg-yellow-600 text-white border-yellow-600'
                      : 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                Nivel: {level}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Crisis Team */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Equipo de Crisis</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {crisisTeam.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{member.role}</div>
                    <div className="text-sm text-gray-500">{member.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <PhoneCall className="w-3 h-3" />
                      {member.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status === 'active' ? 'Activo' : 'En Espera'}
                    </span>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                      Llamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Matrix */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Matriz de Comunicación</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-sm">Comunicación Interna</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Empleados: Email masivo + SMS</li>
                  <li>• Directivos: Llamada directa + WhatsApp</li>
                  <li>• Equipos Críticos: Walkie-talkie + Slack</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-sm">Comunicación Externa</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Medios: Portavoz oficial únicamente</li>
                  <li>• Clientes: Centro de atención + Web</li>
                  <li>• Proveedores: Email + Llamada</li>
                  <li>• Autoridades: Enlace legal</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-sm">Canales de Emergencia</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Hotline Crisis: 1-800-CRISIS-0</li>
                  <li>• Email: crisis@empresa.com</li>
                  <li>• Twitter: @EmpresaCrisis</li>
                </ul>
              </div>
            </div>

            {crisisActive && (
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Enviar Comunicado de Crisis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crisis Timeline */}
      {crisisActive && (
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold">Línea de Tiempo de la Crisis</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 text-sm text-gray-500">14:30</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Plan de Crisis Activado</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Nivel: {crisisLevel} | Iniciado por: Admin</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm text-gray-500">14:32</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Equipo de Crisis Notificado</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">5 miembros confirmaron disponibilidad</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-24 text-sm text-gray-500">14:35</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">Comunicado Interno Enviado</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Email y SMS a todos los empleados</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <textarea
                placeholder="Agregar nueva entrada al log de crisis..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Agregar Entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
