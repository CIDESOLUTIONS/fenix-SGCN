"use client";
import React from "react";
import Link from "next/link";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

export default function RiesgosPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <span>/</span>
          <span>Módulo 2: Riesgos</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análisis de Riesgos (ARA)</h1>
        <p className="text-gray-600">ISO 22301 Cláusula 8.2.3 & ISO 31000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/dashboard/ara/risks" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <AlertTriangle className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Registro de Riesgos</h3>
          <p className="text-sm text-gray-600">Identifique, evalúe y clasifique riesgos de continuidad</p>
        </Link>

        <Link href="/dashboard/ara/matrix" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <TrendingUp className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Matriz de Evaluación</h3>
          <p className="text-sm text-gray-600">Visualice probabilidad vs impacto de riesgos</p>
        </Link>

        <Link href="/dashboard/ara/scoring" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <Shield className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Dashboard Resiliencia</h3>
          <p className="text-sm text-gray-600">Score global y tratamiento de riesgos</p>
        </Link>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">Flujo Recomendado:</h3>
        <ol className="space-y-2 text-sm text-indigo-800">
          <li>1. Identifique riesgos en el Registro</li>
          <li>2. Evalúe con simulación Montecarlo</li>
          <li>3. Visualice en la Matriz</li>
          <li>4. Defina tratamientos</li>
          <li>5. Siguiente: <Link href="/dashboard/analisis-impacto" className="underline font-medium">Módulo 3: BIA</Link></li>
        </ol>
      </div>
    </div>
  );
}
