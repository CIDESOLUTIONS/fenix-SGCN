"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DemoFormModal from "../forms/DemoFormModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-emerald-50 pt-32 pb-20 overflow-hidden">
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
          {/* Texto principal */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ISO 22301 • ISO 31000 • NIST Compliant
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              La Plataforma SaaS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
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
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-semibold text-center flex items-center justify-center gap-2"
              >
                Comenzar Prueba Gratuita
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all font-semibold text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Programar Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-600">99.95% SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-600">API &lt; 200ms</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-600">Multi-idioma</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview con placeholder */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl opacity-20 blur-2xl" />
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <Image
                src="/placeholder.png"
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  📈
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Empresas Activas</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  ✓
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">ISO Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType="schedule"
      />
    </>
  );
}
