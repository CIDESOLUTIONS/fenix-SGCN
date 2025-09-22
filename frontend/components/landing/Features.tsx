export default function Features() {
  const items = [
    {
      icon: "📊",
      title: "Dashboard Ejecutivo",
      badge: "IA Integrada",
      badgeColor: "bg-[#10B981] text-white",
      description: "KPIs de resiliencia, heatmaps dinámicos y AI Advisor con recomendaciones predictivas"
    },
    {
      icon: "🛡️",
      title: "Análisis de Riesgos (ARA)",
      badge: "ISO 31000",
      badgeColor: "bg-[#10B981] text-white",
      description: "Registro de riesgos con métricas avanzadas, integración con fuentes externas y simulaciones Montecarlo"
    },
    {
      icon: "🔗",
      title: "Análisis de Impacto (BIA)",
      badge: "ISO 22317",
      badgeColor: "bg-[#10B981] text-white",
      description: "Cuestionarios inteligentes, simulación de interrupciones y dependency mapping visual"
    },
    {
      icon: "📝",
      title: "Planes de Continuidad",
      badge: "ISO 22301",
      badgeColor: "bg-[#10B981] text-white",
      description: "Editor visual, orquestador en vivo y playbooks integrados con ITSM. Registro de tiempos reales vs RTO/RPO"
    },
    {
      icon: "🧪",
      title: "Pruebas Automatizadas",
      badge: "Automatizado",
      badgeColor: "bg-[#10B981] text-white",
      description: "Simulacros programados, ejecución guiada con scoring automático y evidencias multimedia"
    },
    {
      icon: "⚙️",
      title: "Mejora Continua",
      badge: "PDCA",
      badgeColor: "bg-[#10B981] text-white",
      description: "Workflow de hallazgos, acciones correctivas y reportes automatizados de revisión"
    },
    {
      icon: "🤖",
      title: "IA Predictiva",
      badge: "Machine Learning",
      badgeColor: "bg-[#10B981] text-white",
      description: "Análisis predictivo de riesgos, sugerencias automáticas y optimización de estrategias"
    },
    {
      icon: "🏢",
      title: "Multi-tenant",
      badge: "Enterprise",
      badgeColor: "bg-[#10B981] text-white",
      description: "Gestión de múltiples empresas, white-labeling y benchmarking sectorial"
    }
  ];

  return (
    <section id="caracteristicas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Supera a la Competencia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma integral con funcionalidades completas que cubren todo el ciclo de vida del SGCN. 
            Interfaz intuitiva de fácil adopción y sistema robusto de gestión documental que garantiza 
            trazabilidad total y cumplimiento de estándares internacionales.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <article 
              key={idx} 
              className="group p-6 border border-gray-200 rounded-2xl hover:border-[#4F46E5] hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className={`${item.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#4F46E5] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
