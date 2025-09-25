"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const planId = searchParams.get('plan');
  const billingPeriod = searchParams.get('billing');

  const planDetails: Record<string, any> = {
    basic: {
      name: 'Plan Básico',
      price: billingPeriod === 'yearly' ? 2990 : 299,
      features: ['10 usuarios', '20 procesos', 'Módulos básicos', 'Soporte por email']
    },
    professional: {
      name: 'Plan Profesional',
      price: billingPeriod === 'yearly' ? 7990 : 799,
      features: ['50 usuarios', '100 procesos', 'Todos los módulos', 'Soporte prioritario', 'API access']
    }
  };

  const plan = planDetails[planId || 'basic'];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Aquí iría la integración con Stripe/PayPal
    // Por ahora simulamos el pago exitoso
    setTimeout(() => {
      // Actualizar el estado de la suscripción en el backend
      // Luego redirigir al login con mensaje de éxito
      router.push('/auth/login?payment=success&plan=' + planId);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen del Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Resumen de tu Plan
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan?.name}
              </h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                ${plan?.price}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                  /{billingPeriod === 'yearly' ? 'año' : 'mes'}
                </span>
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Características incluidas:
              </h4>
              <ul className="space-y-3">
                {plan?.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-400">
                ✅ 30 días de prueba gratuita • Cancela cuando quieras
              </p>
            </div>
          </div>

          {/* Formulario de Pago */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Información de Pago
            </h2>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Información Personal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="juan@empresa.com"
                />
              </div>

              {/* Información de Tarjeta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{16}"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{2}/[0-9]{2}"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{3,4}"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Métodos de pago aceptados:
                </p>
                <div className="flex gap-3">
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    💳
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    🏦
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    📱
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Procesando...' : `Pagar $${plan?.price}`}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                🔒 Pago seguro encriptado • Tus datos están protegidos
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
