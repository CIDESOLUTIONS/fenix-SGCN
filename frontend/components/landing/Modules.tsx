export default function Modules() {
  const modules = [
    {
      number: 1,
      title: "Planeación y Gobierno",
      badges: ["ISO 22301 - Cláusula 5"],
      description: "Gestión de políticas con workflow de aprobación, firmas electrónicas y control de vigencia. Editor RACI colaborativo con versionado.",
      plans: ["Estándar", "Profesional", "Premium", "Empresarial"]
    },
    {
      number: 2,
      title: "Riesgo de Continuidad (ARA)",
      badges: ["ISO 31000", "ISO 22317"],
      description: "Registro de riesgos con KRIs/KPIs, integración con fuentes externas y escenarios 'what-if' con simulaciones Montecarlo.",
      plans: ["Estándar", "Profesional", "Premium", "Empresarial"]
    },
    {
      number: 3,
      title: "Análisis de Impacto (BIA)",
      badges: ["ISO 22317"],
      description: "Cuestionarios inteligentes con sugerencias automáticas de RTO/RPO/MTPD. Dependency mapping visual y simulación de pérdidas.",
      plans: ["Estándar", "Profesional", "Premium", "Empresarial"]
    },
    {
      number: 4,
      title: "Escenarios y Estrategias",
      badges: ["ISO 22331"],
      description: "Biblioteca de escenarios sectoriales, algoritmo de recomendación de estrategias y simulación de costo-efectividad.",
      plans: ["Estándar", "Profesional", "Premium", "Empresarial"]
    },
    {
      number: 5,
      title: "Planes de Continuidad",
      badges: ["ISO 22301 - Cláusula 8"],
      description: "Editor visual drag & drop, orquestador en vivo y playbooks integrados con ITSM. Registro de tiempos reales vs RTO/RPO.",
      plans: ["Estándar", "Profesional", "Premium", "Empresarial"]
    },
    {
      number: 6,
      title: "Pruebas de Continuidad",
      badges: ["ISO 22301 - Cláusula 8.5"],
      description: "Programador de ejercicios, ejecución guiada con scoring automático y captura de evidencias multimedia.",
      plans: ["Profesional", "Premium", "Empresarial"]
    },
    {
      number: 7,
      title: "Mejora Continua",
      badges: ["ISO 22301 - Cláusula 10"],
      description: "Gestión de hallazgos, workflow de acciones correctivas y dashboard de cumplimiento con reportes automatizados.",
      plans: ["Profesional", "Premium", "Empresarial"]
    }
  ];

  return (
    <section id="modulos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            7 Módulos Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada módulo está diseñado para cumplir específicamente con los requisitos de los 
            estándares ISO 22301, ISO 31000 y mejores prácticas internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div 
              key={module.number}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#4F46E5] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{module.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                    <div className="flex gap-2 mt-1">
                      {module.badges.map((badge, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-[#10B981] text-white px-2 py-1 rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Módulo {module.number}</span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{module.description}</p>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Incluido en los planes:</p>
                <div className="flex flex-wrap gap-2">
                  {module.plans.map((plan, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
