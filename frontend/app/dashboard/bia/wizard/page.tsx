'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

export default function BIAWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    processId: '',
    processName: '',
    department: '',
    rto: 0,
    rpo: 0,
    mtpd: 0,
    impactLevel: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    financialImpact: '',
    operationalImpact: '',
    reputationalImpact: '',
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    rto: 0,
    rpo: 0,
    reasoning: ''
  });

  const steps = [
    { id: 1, name: 'Información del Proceso', description: 'Datos básicos del proceso de negocio' },
    { id: 2, name: 'Objetivos de Recuperación', description: 'RTO, RPO y MTPD' },
    { id: 3, name: 'Análisis de Impacto', description: 'Impactos financiero, operacional y reputacional' },
    { id: 4, name: 'Revisión y Confirmación', description: 'Verificar la información ingresada' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAISuggestion = async () => {
    // Simular llamada a IA para sugerencias
    const suggestions = {
      rto: formData.impactLevel === 'Critical' ? 2 : 
           formData.impactLevel === 'High' ? 8 : 
           formData.impactLevel === 'Medium' ? 24 : 72,
      rpo: formData.impactLevel === 'Critical' ? 0.5 : 
           formData.impactLevel === 'High' ? 4 : 
           formData.impactLevel === 'Medium' ? 12 : 24,
      reasoning: `Basado en procesos similares de tipo ${formData.impactLevel.toLowerCase()} en ${formData.department}, se recomienda estos valores.`
    };
    setAiSuggestions(suggestions);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/bia-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        window.location.href = '/dashboard/bia/assessments';
      }
    } catch (error) {
      console.error('Error creating BIA assessment:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asistente de Evaluación BIA</h1>
          <p className="text-gray-500 mt-1">Completa el cuestionario paso a paso con ayuda de IA</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.id ? 'bg-green-600 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="text-xs mt-2 text-center">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Process Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Información del Proceso</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Proceso *
                </label>
                <input
                  type="text"
                  value={formData.processName}
                  onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Procesamiento de Transacciones Financieras"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="TI">Tecnología de la Información</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="RRHH">Recursos Humanos</option>
                  <option value="Legal">Legal y Cumplimiento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Criticidad *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, impactLevel: level })}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.impactLevel === level
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Recovery Objectives */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Objetivos de Recuperación</h2>
                <button
                  onClick={handleAISuggestion}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Sugerencias con IA
                </button>
              </div>

              {aiSuggestions.reasoning && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">Sugerencia de IA</div>
                      <div className="text-sm text-purple-700 mt-1">{aiSuggestions.reasoning}</div>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => setFormData({ 
                            ...formData, 
                            rto: aiSuggestions.rto, 
                            rpo: aiSuggestions.rpo 
                          })}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Aplicar sugerencias
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RTO (Recovery Time Objective) - Horas *
                </label>
                <input
                  type="number"
                  value={formData.rto}
                  onChange={(e) => setFormData({ ...formData, rto: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 4"
                />
                <p className="text-xs text-gray-500 mt-1">Tiempo máximo aceptable para recuperar el proceso</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RPO (Recovery Point Objective) - Horas *
                </label>
                <input
                  type="number"
                  value={formData.rpo}
                  onChange={(e) => setFormData({ ...formData, rpo: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 1"
                />
                <p className="text-xs text-gray-500 mt-1">Máxima pérdida de datos aceptable</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MTPD (Maximum Tolerable Period of Disruption) - Horas *
                </label>
                <input
                  type="number"
                  value={formData.mtpd}
                  onChange={(e) => setFormData({ ...formData, mtpd: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 24"
                />
                <p className="text-xs text-gray-500 mt-1">Tiempo máximo que el proceso puede estar interrumpido</p>
              </div>
            </div>
          )}

          {/* Step 3: Impact Analysis */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Análisis de Impacto</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impacto Financiero
                </label>
                <textarea
                  value={formData.financialImpact}
                  onChange={(e) => setFormData({ ...formData, financialImpact: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el impacto financiero de una interrupción..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impacto Operacional
                </label>
                <textarea
                  value={formData.operationalImpact}
                  onChange={(e) => setFormData({ ...formData, operationalImpact: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el impacto en las operaciones..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impacto Reputacional
                </label>
                <textarea
                  value={formData.reputationalImpact}
                  onChange={(e) => setFormData({ ...formData, reputationalImpact: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el impacto en la reputación..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Revisión y Confirmación</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Proceso</div>
                    <div className="font-medium">{formData.processName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Departamento</div>
                    <div className="font-medium">{formData.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Nivel de Criticidad</div>
                    <div className="font-medium">{formData.impactLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">RTO</div>
                    <div className="font-medium">{formData.rto} horas</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">RPO</div>
                    <div className="font-medium">{formData.rpo} horas</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">MTPD</div>
                    <div className="font-medium">{formData.mtpd} horas</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
