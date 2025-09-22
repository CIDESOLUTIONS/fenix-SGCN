"use client";

import { ShieldCheck, Users, Clock, LineChart } from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-sky-600" />,
    title: "Cumplimiento Normativo",
    desc: "Diseñada para cumplir con ISO 22301 y estándares internacionales de gestión de continuidad del negocio.",
  },
  {
    icon: <Users className="h-8 w-8 text-sky-600" />,
    title: "Multi-tenant Seguro",
    desc: "Cada cliente opera en un entorno aislado, asegurando la independencia y confidencialidad de su información.",
  },
  {
    icon: <Clock className="h-8 w-8 text-sky-600" />,
    title: "Respuestas Ágiles",
    desc: "Automatiza procesos clave para reducir tiempos de reacción y mejorar la resiliencia de tu organización.",
  },
  {
    icon: <LineChart className="h-8 w-8 text-sky-600" />,
    title: "Insights en Tiempo Real",
    desc: "Paneles de control interactivos para medir madurez, riesgos e impacto en la continuidad del negocio.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Beneficios de elegir <span className="text-sky-600">FENIX SGCN</span>
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4">{b.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{b.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
