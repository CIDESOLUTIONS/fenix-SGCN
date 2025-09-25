"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'info', text: string } | null>(null);

  useEffect(() => {
    // Detectar de dónde viene el usuario
    const registered = searchParams.get('registered');
    const payment = searchParams.get('payment');
    const quote = searchParams.get('quote');
    const plan = searchParams.get('plan');

    if (registered === 'true' && plan === 'trial') {
      setMessage({
        type: 'success',
        text: '¡Registro exitoso! Tu prueba gratuita de 30 días ha comenzado. Inicia sesión para continuar.'
      });
    } else if (payment === 'success') {
      setMessage({
        type: 'success',
        text: '¡Pago procesado exitosamente! Tu suscripción está activa. Inicia sesión para acceder.'
      });
    } else if (quote === 'sent' && plan === 'enterprise') {
      setMessage({
        type: 'info',
        text: 'Solicitud enviada. Nuestro equipo te contactará pronto. Mientras tanto, inicia sesión para explorar.'
      });
    }
  }, [searchParams]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error("Credenciales inválidas");
      
      const data = await res.json();
      
      // Guardar el token en localStorage
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        window.location.href = "/dashboard";
      } else {
        throw new Error("No se recibió token de acceso");
      }
    } catch (err: any) {
      alert(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center p-4">
      {/* Botón Volver */}
      <Link href="/" className="absolute top-6 left-6 text-white hover:opacity-80 transition">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Card Principal */}
      <div className="w-full max-w-md">
        {/* Mensaje de éxito/info */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-800' 
              : 'bg-blue-100 border border-blue-400 text-blue-800'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Header con Logo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-full mb-4">
              <Image
                src="/fenix-logo.png"
                alt="Fenix SGCN"
                width={50}
                height={50}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
