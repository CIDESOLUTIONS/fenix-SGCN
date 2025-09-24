"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        {/* Header con Logo */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white rounded-xl p-3 mb-4 shadow-lg">
            <Image src="/fenix-logo.png" alt="Fenix" width={48} height={48} className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Fenix-SGCN</h1>
          <p className="text-white/90 text-sm">Sistema de Gestión de Continuidad de Negocio</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button className="flex-1 pb-3 text-center text-sm font-medium text-gray-900 border-b-2 border-indigo-600">
              Iniciar Sesión
            </button>
            <Link href="/auth/register" className="flex-1 pb-3 text-center text-sm font-medium text-gray-500 hover:text-gray-700">
              Registrarse
            </Link>
          </div>

          {/* Título */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Iniciar Sesión</h2>
            </div>
            <p className="text-xs text-gray-600">Accede a tu plataforma SGCN</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center">
            <button className="text-xs text-gray-600 hover:text-indigo-600">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
