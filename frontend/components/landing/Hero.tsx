"use client";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50" />
      
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        {/* Texto principal */}
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            ISO 22301 • ISO 31000 • NIST Compliant
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            La Plataforma SaaS{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              más Completa
            </span>{" "}
            para SGCN
          </h1>
          
          <p className="text-xl text-gray-600 mt-6 leading-relaxed">
            Implementa, opera, audita y mejora tu Sistema de Gestión de Continuidad del Negocio con total conformidad a estándares internacionales. La solución empresarial que supera a Fusion, Veoci y MetricStream.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-semibold text-center"
            >
              Comenzar Prueba Gratuita →
            </Link>
            <Link
              href="#demo"
              className="px-8 py-4 border-2 border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all font-semibold text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Ver Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span className="font-medium">99.95% SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span className="font-medium">API &lt; 200ms</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span className="font-medium">Multi-idioma</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 blur-2xl" />
          <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <Image
              src="/dashboard-preview.png"
              alt="Fenix-SGCN Dashboard Preview"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* Floating stats */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Empresas Activas</div>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-500">ISO Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
