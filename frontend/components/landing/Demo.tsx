"use client";

export default function Demo() {
  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mira Fenix-SGCN en Acción
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestra plataforma simplifica la gestión de continuidad del negocio 
            con herramientas intuitivas y potentes funcionalidades.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#4F46E5] to-[#10B981] rounded-2xl p-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <video 
                className="w-full h-auto"
                controls
                poster="/placeholder.png"
              >
                <source src="/video-demo-sgcn.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ¿Quieres una demostración personalizada? Nuestro equipo te mostrará cómo Fenix-SGCN 
              se adapta a las necesidades específicas de tu organización.
            </p>
            <a 
              href="mailto:comercial@cidesas.com?subject=Solicitud%20Demo%20Personalizada%20Fenix-SGCN"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Solicitar Demo Personalizada
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
