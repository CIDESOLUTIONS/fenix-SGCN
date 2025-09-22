'use client';

import { useState } from 'react';
import { Building, Users, Globe, Target, Shield, TrendingUp } from 'lucide-react';

export default function OrganizationalContextPage() {
  const [context, setContext] = useState({
    mission: '',
    vision: '',
    scope: '',
    stakeholders: [] as any[],
    externalFactors: '',
    internalFactors: '',
    legalRequirements: '',
    sgcnPolicy: ''
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contexto de la Organización</h1>
        <p className="text-gray-500 mt-1">Requisito 4 ISO 22301 - Contexto organizacional y partes interesadas</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Misión y Visión */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Misión y Visión</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Misión Organizacional
              </label>
              <textarea
                rows={3}
                value={context.mission}
                onChange={(e) => setContext({...context, mission: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Definir el propósito de la organización..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visión Organizacional
              </label>
              <textarea
                rows={3}
                value={context.vision}
                onChange={(e) => setContext({...context, vision: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Definir la visión a futuro..."
              />
            </div>
          </div>
        </div>

        {/* Alcance del SGCN */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Alcance del SGCN</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Definición del Alcance
            </label>
            <textarea
              rows={8}
              value={context.scope}
              onChange={(e) => setContext({...context, scope: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Definir qué procesos, ubicaciones y actividades están incluidas en el SGCN..."
            />
          </div>
        </div>

        {/* Factores Externos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Factores Externos</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuestiones Externas que Afectan el SGCN
            </label>
            <textarea
              rows={8}
              value={context.externalFactors}
              onChange={(e) => setContext({...context, externalFactors: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Regulatorio, competencia, tecnológico, económico, social..."
            />
          </div>
        </div>

        {/* Factores Internos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold">Factores Internos</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuestiones Internas que Afectan el SGCN
            </label>
            <textarea
              rows={8}
              value={context.internalFactors}
              onChange={(e) => setContext({...context, internalFactors: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Cultura, recursos, estructura, capacidades..."
            />
          </div>
        </div>

        {/* Partes Interesadas */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Partes Interesadas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Parte Interesada</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Necesidades</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Expectativas</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {['Clientes', 'Empleados', 'Accionistas', 'Proveedores', 'Reguladores', 'Comunidad'].map((stakeholder, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 font-medium">{stakeholder}</td>
                    <td className="px-4 py-2">
                      <input type="text" className="w-full border rounded px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" className="w-full border rounded px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <select className="w-full border rounded px-2 py-1 text-sm">
                        <option>Alto</option>
                        <option>Medio</option>
                        <option>Bajo</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Política SGCN */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold">Política del SGCN</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Política de Continuidad del Negocio
            </label>
            <textarea
              rows={6}
              value={context.sgcnPolicy}
              onChange={(e) => setContext({...context, sgcnPolicy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Declaración de compromiso de la alta dirección con el SGCN..."
            />
            <p className="text-xs text-gray-500 mt-2">
              La política debe ser apropiada al propósito, incluir compromiso de mejora continua, 
              estar documentada y comunicada a toda la organización.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Guardar Borrador
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Guardar y Continuar
        </button>
      </div>
    </div>
  );
}
