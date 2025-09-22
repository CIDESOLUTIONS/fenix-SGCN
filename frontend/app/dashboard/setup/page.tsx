'use client';

import { useState } from 'react';
import { Users, Target, FileText, ChevronRight, CheckCircle, Rocket, Building } from 'lucide-react';

export default function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Kick-off', icon: Rocket },
    { id: 2, name: 'Equipo SGCN', icon: Users },
    { id: 3, name: 'Contexto', icon: Target },
    { id: 4, name: 'Procesos', icon: Building },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración Inicial del SGCN</h1>
        
        {/* Progress */}
        <div className="mb-8 flex justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="ml-2 font-medium">{step.name}</span>
                {i < steps.length - 1 && <ChevronRight className="mx-4 text-gray-400" />}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reunión Kick-off</h2>
              <p className="text-gray-600 mb-6">Documentar la reunión inicial de sensibilización</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Fecha Kick-off</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-2">Participantes</label>
                  <textarea rows={3} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Equipo SGCN y Matriz RACI</h2>
              <p className="text-gray-600 mb-6">Definir responsables del sistema</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Líder SGCN</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Contexto Organizacional</h2>
              <p className="text-gray-600 mb-6">Requisito 4 - ISO 22301</p>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Identificación de Procesos</h2>
              <p className="text-gray-600 mb-6">Selección y ponderación de procesos críticos</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {currentStep === 4 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
