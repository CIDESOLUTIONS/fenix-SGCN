'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  maxProcesses: number;
  features: string[];
  isActive: boolean;
  isCustom: boolean;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: '1',
      name: 'Basic',
      description: 'Para pequeñas empresas iniciando en continuidad',
      monthlyPrice: 299,
      annualPrice: 2990,
      maxUsers: 10,
      maxProcesses: 20,
      features: [
        'BIA básico',
        'ARA simplificado',
        'Hasta 5 planes',
        'Soporte email',
        'Reportes básicos'
      ],
      isActive: true,
      isCustom: false
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Para empresas medianas con necesidades avanzadas',
      monthlyPrice: 799,
      annualPrice: 7990,
      maxUsers: 50,
      maxProcesses: 100,
      features: [
        'BIA completo con IA',
        'ARA avanzado',
        'Planes ilimitados',
        'Gestión de crisis',
        'Ejercicios y simulacros',
        'Soporte prioritario',
        'API access',
        'Reportes avanzados'
      ],
      isActive: true,
      isCustom: false
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'Para grandes corporaciones y holdings',
      monthlyPrice: 2499,
      annualPrice: 24990,
      maxUsers: -1,
      maxProcesses: -1,
      features: [
        'Todo en Professional',
        'Multi-tenant ilimitado',
        'White-labeling',
        'SSO/SAML',
        'Integraciones ITSM',
        'SLA garantizado',
        'Account manager',
        'Onboarding dedicado',
        'Consultoría incluida'
      ],
      isActive: true,
      isCustom: false
    }
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Planes</h1>
          <p className="text-gray-500 mt-1">Configurar planes de suscripción y precios</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Plan Personalizado
        </button>
      </div>

      {/* Grid de Planes */}
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
              <span className="text-gray-500">/mes</span>
            </div>
            <ul className="mt-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Edit className="w-4 h-4 inline mr-2" />
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
