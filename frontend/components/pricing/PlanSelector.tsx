"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  billingPeriod: 'monthly' | 'yearly';
}

export default function PlanSelector() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: billingPeriod === 'monthly' ? 299 : 2990,
      currency: 'USD',
      billingPeriod,
      features: [
        '10 usuarios',
        '20 procesos',
        'Módulos básicos',
        'Soporte por email',
        '5 GB almacenamiento'
      ]
    },
    {
      id: 'professional',
      name: 'Plan Profesional',
      price: billingPeriod === 'monthly' ? 799 : 7990,
      currency: 'USD',
      billingPeriod,
      popular: true,
      features: [
        '50 usuarios',
        '100 procesos',
        'Todos los módulos',
        'Soporte prioritario',
        '50 GB almacenamiento',
        'API access',
        'Reportes avanzados'
      ]
    },
    {
      id: 'enterprise',
      name: 'Plan Empresarial',
      price: 0,
      currency: 'USD',
      billingPeriod,
      features: [
        'Usuarios ilimitados',
        'Procesos ilimitados',
        'Personalización completa',
        'Soporte 24/7',
        'Almacenamiento ilimitado',
        'API dedicada',
        'White-label',
        'Implementación guiada'
      ]
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      // Redirigir a formulario de contacto
      router.push('/contact?plan=enterprise');
    } else {
      // Redirigir a pasarela de pago
      router.push(`/checkout?plan=${plan.id}&billing=${billingPeriod}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Toggle de periodo */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Elige el plan perfecto para tu organización
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Comienza con una prueba gratuita de 30 días. Sin tarjeta de crédito requerida.
        </p>
        
        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md transition ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md transition ${
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Anual
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Grid de planes */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${
              plan.popular ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MÁS POPULAR
                </span>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {plan.name}
            </h3>

            <div className="mb-6">
              {plan.id === 'enterprise' ? (
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    Personalizado
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    /{billingPeriod === 'monthly' ? 'mes' : 'año'}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                plan.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {plan.id === 'enterprise' ? 'Contactar Ventas' : 'Comenzar Prueba'}
            </button>
          </div>
        ))}
      </div>

      {/* Garantía */}
      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-400">
          🔒 Pago seguro • 🔄 Garantía de 30 días • ✨ Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}
