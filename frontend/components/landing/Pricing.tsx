"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      id: "trial",
      name: "Trial",
      price: "$0",
      period: "30 días gratis",
      description: "Prueba completa sin tarjeta de crédito",
      icon: "🚀",
      features: [
        "30 días acceso completo",
        "10 procesos de negocio",
        "5 usuarios",
        "Módulos básicos",
        "10GB almacenamiento",
        "Soporte por email",
        "Sin compromiso"
      ],
      action: "Iniciar Prueba Gratuita",
      href: "/auth/register?plan=TRIAL",
      buttonClass: "bg-gray-800 hover:bg-gray-900 text-white",
      popular: false
    },
    {
      id: "standard",
      name: "Standard",
      price: "$199",
      period: "USD/mes",
      description: "Para empresas pequeñas y medianas",
      icon: "✓",
      features: [
        "Hasta 50 procesos",
        "Hasta 25 usuarios",
        "Todos los módulos (1-7)",
        "50GB almacenamiento",
        "Retención 1 año",
        "Soporte estándar",
        "Exportes PDF/JSON",
        "Dashboards básicos"
      ],
      action: "Seleccionar Plan",
      href: "/auth/register?plan=STANDARD",
      buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: "$399",
      period: "USD/mes",
      description: "Funcionalidad completa con IA avanzada",
      icon: "⭐",
      badge: "Más Popular",
      popular: true,
      features: [
        "Hasta 150 procesos",
        "Hasta 75 usuarios",
        "Todos los módulos + IA",
        "Simulación Montecarlo",
        "Mapeo dependencias visual",
        "200GB almacenamiento",
        "Retención 3 años",
        "Soporte prioritario",
        "Analytics avanzado"
      ],
      action: "Seleccionar Plan",
      href: "/auth/register?plan=PROFESSIONAL",
      buttonClass: "bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600 text-white shadow-lg"
    },
    {
      id: "premium",
      name: "Premium",
      price: "Custom",
      period: "",
      description: "Solución enterprise a medida",
      icon: "💎",
      features: [
        "Procesos ilimitados",
        "Usuarios ilimitados",
        "Todos los módulos + IA",
        "Almacenamiento ilimitado",
        "Retención personalizada",
        "Soporte 24/7 dedicado",
        "Consultoría incluida",
        "SLA garantizado"
      ],
      action: "Contactar Ventas",
      href: "/auth/register?plan=PREMIUM",
      buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
      popular: false
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Quote",
      period: "",
      description: "Multi-tenant white-labeling",
      icon: "👑",
      features: [
        "Multi-empresa",
        "White-label completo",
        "API dedicada",
        "Infraestructura dedicada",
        "Compliance personalizado",
        "Integración ITSM/CMDB",
        "Implementación guiada",
        "Consultor dedicado",
        "Migración asistida"
      ],
      action: "Solicitar Cotización",
      href: "/contact?type=enterprise",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
      popular: false
    }
  ];

  return (
    <section id="planes" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planes y Precios Transparentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan que se adapte a las necesidades de tu organización. 
            Comienza gratis y escala cuando necesites.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-2 border-indigo-600 shadow-2xl scale-105 lg:scale-110"
                  : "border border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="text-3xl mb-2">{plan.icon}</div>
                <CardTitle className="text-lg font-bold break-words">{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-gray-600 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className={`w-full ${plan.buttonClass}`}>
                    {plan.action}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ/Info adicional */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>✓ Todos los planes incluyen SSL, backups automáticos y actualizaciones</p>
          <p>✓ Sin costos ocultos • Cancela cuando quieras • Soporte en español</p>
          <p className="font-semibold text-gray-900 mt-4">
            ¿Necesitas más de 150 procesos?{" "}
            <Link href="/contact" className="text-indigo-600 hover:underline">
              Contáctanos para un plan personalizado
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
