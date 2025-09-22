"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Estándar",
      price: "$199",
      period: " USD /mes",
      description: "Perfecto para empresas que inician su SGCN",
      icon: "✓",
      features: [
        "Hasta 50 empleados",
        "Hasta 10 procesos SGCN",
        "Módulos 1-5 (Gobierno, ARA, BIA, Estrategias, Planes)",
        "50GB almacén documental",
        "Retención 1 año",
        "Soporte estándar",
        "Exportes PDF/JSON",
        "Cumplimiento ISO 22301 básico"
      ],
      action: "Comenzar Prueba",
      href: "/auth/register"
    },
    {
      name: "Profesional",
      price: "$399",
      period: " USD /mes",
      description: "Para empresas que requieren funcionalidad completa",
      icon: "⭐",
      badge: "Más Popular",
      popular: true,
      features: [
        "Hasta 150 empleados",
        "Hasta 30 procesos SGCN",
        "Todos los módulos (1-7)",
        "Pruebas automatizadas + QA",
        "200GB almacén documental",
        "Retención 2 años",
        "Soporte prioritario",
        "Integraciones ITSM",
        "Dashboard AI Advisor"
      ],
      action: "Comenzar Prueba",
      href: "/auth/register"
    },
    {
      name: "Premium",
      price: "Personalizado",
      period: " /año",
      description: "Solución empresarial sin límites",
      icon: "📊",
      features: [
        "Empleados ilimitados",
        "Procesos SGCN ilimitados",
        "Todos los módulos + IA avanzada",
        "Soporte 24/7 preferencial",
        "500GB almacén documental",
        "Retención 3 años",
        "2 atenciones de incidentes/año",
        "Chaos Engineering",
        "Benchmarking sectorial"
      ],
      action: "Contactar Ventas",
      href: "#contact"
    },
    {
      name: "Empresarial Portafolio",
      price: "Contactar",
      period: "",
      description: "Gestión multi-empresa con white-labeling",
      icon: "👑",
      features: [
        "Todo lo del Premium",
        "Dashboard Fenix-SGCN Portafolio",
        "White-labeling completo",
        "Multi-tenant avanzado",
        "SLA contractual personalizado",
        "Soporte dedicado 24/7",
        "Consultoría especializada",
        "Implementación guiada"
      ],
      action: "Contactar Ventas",
      href: "#contact"
    }
  ];

  return (
    <section id="planes" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elige el Plan Perfecto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde startups hasta grandes corporaciones. Cada plan incluye todas las funcionalidades 
            necesarias para el cumplimiento de estándares internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`flex flex-col justify-between rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                plan.popular ? 'border-2 border-[#4F46E5] transform scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl ${
                    plan.popular ? 'bg-gradient-to-br from-[#4F46E5] to-[#10B981]' : 'bg-gray-100'
                  }`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#10B981] hover:shadow-lg' 
                        : 'bg-white text-[#4F46E5] border-2 border-[#4F46E5] hover:bg-indigo-50'
                    }`}
                  >
                    {plan.action}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">¿Necesitas más información? Nuestro equipo está listo para ayudarte.</p>
          <Link 
            href="#contact" 
            className="inline-block px-6 py-3 border-2 border-[#4F46E5] text-[#4F46E5] rounded-lg hover:bg-indigo-50 transition font-medium"
          >
            Programar Demostración Personalizada
          </Link>
        </div>
      </div>
    </section>
  );
}
