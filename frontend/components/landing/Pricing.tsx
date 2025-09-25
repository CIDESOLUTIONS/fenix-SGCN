"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      id: "trial",
      name: "Prueba Gratuita",
      price: "$0",
      period: " /30 días",
      description: "Prueba todas las funcionalidades sin compromiso",
      icon: "🚀",
      features: [
        "30 días de acceso completo",
        "Hasta 10 usuarios",
        "Hasta 20 procesos",
        "Todos los módulos incluidos",
        "10GB almacenamiento",
        "Soporte por email",
        "Sin tarjeta de crédito"
      ],
      action: "Comenzar Prueba Gratis",
      href: "/auth/register?plan=trial",
      flow: "trial" // trial → register → login
    },
    {
      id: "basic",
      name: "Plan Básico",
      price: "$299",
      period: " USD /mes",
      description: "Perfecto para empresas que inician su SGCN",
      icon: "✓",
      features: [
        "Hasta 10 usuarios",
        "Hasta 20 procesos SGCN",
        "Módulos básicos (1-5)",
        "50GB almacenamiento",
        "Retención 1 año",
        "Soporte estándar",
        "Exportes PDF/JSON"
      ],
      action: "Seleccionar Plan",
      href: "/auth/register?plan=basic",
      flow: "paid" // paid → register → checkout → login
    },
    {
      id: "professional",
      name: "Plan Profesional",
      price: "$799",
      period: " USD /mes",
      description: "Para empresas que requieren funcionalidad completa",
      icon: "⭐",
      badge: "Más Popular",
      popular: true,
      features: [
        "Hasta 50 usuarios",
        "Hasta 100 procesos SGCN",
        "Todos los módulos (1-7)",
        "Pruebas automatizadas",
        "200GB almacenamiento",
        "Retención 2 años",
        "Soporte prioritario",
        "Dashboard IA"
      ],
      action: "Seleccionar Plan",
      href: "/auth/register?plan=professional",
      flow: "paid"
    },
    {
      id: "enterprise",
      name: "Plan Empresarial",
      price: "Personalizado",
      period: "",
      description: "Solución empresarial con white-labeling",
      icon: "👑",
      features: [
        "Usuarios ilimitados",
        "Procesos ilimitados",
        "White-labeling completo",
        "Multi-tenant avanzado",
        "Almacenamiento ilimitado",
        "Soporte dedicado 24/7",
        "Consultoría especializada",
        "Implementación guiada"
      ],
      action: "Solicitar Cotización",
      href: "/auth/register?plan=enterprise",
      flow: "quote" // quote → register → contact form → email → login
    }
  ];

  return (
    <section id="planes" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Elige el Plan Perfecto
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Desde startups hasta grandes corporaciones. Cada plan incluye todas las funcionalidades 
            necesarias para el cumplimiento ISO 22301.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`flex flex-col justify-between rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                plan.popular ? 'border-2 border-indigo-600 dark:border-indigo-400 transform scale-105' : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl ${
                    plan.popular ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white' 
                        : plan.id === 'trial'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            🔒 Pago seguro • 🔄 Garantía de 30 días • ✨ Cancela cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
}
