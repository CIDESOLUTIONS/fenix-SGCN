"use client";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
        {/* Texto principal */}
        <div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Certificado ISO 22301
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4">
            Protege tu Empresa con{" "}
            <span className="text-blue-600">Continuidad Inteligente</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6">
            {siteConfig.name} es la plataforma SaaS líder para implementar,
            operar y gestionar Sistemas de Gestión de Continuidad del Negocio
            bajo el estándar ISO 22301. Protege tu organización y asegura la
            continuidad operacional.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/demo"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {siteConfig.cta.demo}
            </Link>
            <Link
              href="/consultoria"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {siteConfig.cta.consult}
            </Link>
          </div>
        </div>

        {/* Imagen de referencia */}
        <div className="relative w-full h-80 md:h-96">
          <Image
            src="/dashboard-placeholder.png"
            alt="Demo Dashboard"
            fill
            className="object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
