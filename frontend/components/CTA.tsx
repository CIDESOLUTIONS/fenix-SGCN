import Link from "next/link";

export default function CTA() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ¿Listo para proteger tu negocio?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Prueba una demo, empieza con el plan Estándar o contacta a ventas para soluciones Enterprise.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-white text-[#4F46E5] rounded-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Comenzar Ahora
          </Link>

          <a
            href="mailto:comercial@cidesas.com?subject=Interés%20en%20Fenix-SGCN%20Plan%20Enterprise"
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Contactar Ventas
          </a>
        </div>
      </div>
    </section>
  );
}
