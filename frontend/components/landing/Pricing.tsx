"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const plans = [
    {
      name: "Básico",
      price: "$99",
      period: "/mes",
      description: "Ideal para pequeñas organizaciones que inician su SGN.",
      features: [
        "1 tenant",
        "Usuarios ilimitados",
        "Soporte por correo",
      ],
      action: "Comenzar",
    },
    {
      name: "Profesional",
      price: "$199",
      period: "/mes",
      description: "Para empresas que necesitan mayor control y seguridad.",
      features: [
        "Multi-tenant",
        "Soporte prioritario",
        "Integraciones avanzadas",
      ],
      action: "Subscribirse",
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Solución a la medida con soporte dedicado y SLA.",
      features: [
        "Multi-tenant avanzado",
        "SLA dedicado",
        "Consultoría especializada",
      ],
      action: "Contactar Ventas",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">Planes y Precios</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card key={idx} className="flex flex-col justify-between rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-gray-500">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal">{plan.period}</span>
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-gray-700">✅ {f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{plan.action}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
