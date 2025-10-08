"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Detectar el plan seleccionado
  const selectedPlan = searchParams.get('plan') || 'trial';

  const planDetails: Record<string, any> = {
    TRIAL: { name: 'Prueba Gratuita (30 días)', flow: 'trial' },
    trial: { name: 'Prueba Gratuita (30 días)', flow: 'trial' },
    STANDARD: { name: 'Standard ($199/mes)', price: 199, flow: 'paid' },
    standard: { name: 'Standard ($199/mes)', price: 199, flow: 'paid' },
    PROFESSIONAL: { name: 'Professional ($399/mes)', price: 399, flow: 'paid' },
    professional: { name: 'Professional ($399/mes)', price: 399, flow: 'paid' },
    PREMIUM: { name: 'Premium (Personalizado)', flow: 'quote' },
    premium: { name: 'Premium (Personalizado)', flow: 'quote' },
    ENTERPRISE: { name: 'Enterprise (Cotización)', flow: 'quote' },
    enterprise: { name: 'Enterprise (Cotización)', flow: 'quote' }
  };

  const currentPlan = planDetails[selectedPlan.toUpperCase()] || planDetails[selectedPlan] || planDetails.TRIAL;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantName: company,
          email,
          password,
          fullName,
          position,
          phone,
          subscriptionPlan: selectedPlan
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrarse");
      }

      const data = await response.json();

      // Guardar token temporalmente
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirigir según el flujo del plan
      if (currentPlan.flow === 'trial') {
        // Flujo: trial → login
        router.push('/auth/login?registered=true&plan=trial');
      } else if (currentPlan.flow === 'paid') {
        // Flujo: paid → checkout → login
        router.push(`/checkout?plan=${selectedPlan}&registered=true`);
      } else if (currentPlan.flow === 'quote') {
        // Flujo: quote → contact form → login
        router.push(`/contact?plan=${selectedPlan}&registered=true`);
      }

    } catch (error: any) {
      alert(error.message || "Error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel Izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/logo-fenix.png"
              alt="Fenix SGCN"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan seleccionado: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentPlan.name}</span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Empresa *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Mi Empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Director"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="+57 300 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Corporativo *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="juan@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Panel Derecho - Beneficios */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            {currentPlan.flow === 'trial' && '¡Comienza tu Prueba Gratuita!'}
            {currentPlan.flow === 'paid' && '¡Un paso más para tu SGCN!'}
            {currentPlan.flow === 'quote' && 'Solución Empresarial Personalizada'}
          </h2>
          
          <div className="space-y-4">
            {currentPlan.flow === 'trial' && (
              <>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>30 días de acceso completo sin costo</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Sin tarjeta de crédito requerida</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Cancela cuando quieras</p>
                </div>
              </>
            )}

            {currentPlan.flow === 'paid' && (
              <>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Activación inmediata después del pago</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Garantía de 30 días</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Pago seguro encriptado</p>
                </div>
              </>
            )}

            {currentPlan.flow === 'quote' && (
              <>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Consultoría personalizada incluida</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Respuesta en 24 horas</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Sin compromiso de compra</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
