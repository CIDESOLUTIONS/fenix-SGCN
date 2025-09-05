export default function CTA() {
  return (
    <section className="py-16 bg-sky-700 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold">¿Listo para proteger tu negocio?</h2>
        <p className="mt-2 text-gray-100">Prueba una demo, empieza con el plan Básico o contacta a ventas para soluciones Enterprise.</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/auth/signup"
            className="inline-block bg-white text-sky-700 px-5 py-3 rounded-md font-medium"
          >
            Empieza ahora
          </a>

          <a
            href="mailto:ventas@fenix-sgcn.com?subject=Interes%20en%20Plan%20Enterprise"
            className="inline-block border border-white px-5 py-3 rounded-md"
          >
            Contactar ventas
          </a>
        </div>
      </div>
    </section>
  );
}
