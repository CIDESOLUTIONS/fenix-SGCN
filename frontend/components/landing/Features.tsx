export default function Features() {
  const items = [
    {
      title: "Aislamiento multi-tenant",
      text: "Datos y configuraciones independientes por cliente (tenancy) para seguridad y cumplimiento.",
    },
    {
      title: "Cobertura ISO 22301",
      text: "Módulos alineados con ISO 22301 y complementos (22313, 22316, 22317...).",
    },
    {
      title: "Gestión de riesgos e incidentes",
      text: "Registro, evaluación y seguimiento de riesgos e incidentes con trazabilidad completa.",
    },
    {
      title: "Planificación de continuidad",
      text: "Creación, versionado y pruebas de los planes de continuidad por unidad/servicio.",
    },
    {
      title: "Reportes y auditoría",
      text: "Informes listos para auditoría y paneles para responsables y alta dirección.",
    },
    {
      title: "Integraciones y SSO",
      text: "APIs, Webhooks y capacidades para integrarse con sistemas existentes y SSO (SAML/OIDC).",
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Principales funcionalidades</h2>
        <p className="text-center mt-3 text-gray-600 max-w-2xl mx-auto">
          Plataforma completa para crear, operar y auditar tu Sistema de Gestión de Continuidad de Negocio.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <article key={idx} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
              <p className="text-sm text-gray-700">{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

