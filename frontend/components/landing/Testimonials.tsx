'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María García',
    role: 'CIO',
    company: 'Banco Nacional',
    image: '👩‍💼',
    rating: 5,
    text: 'Fenix-SGCN nos permitió certificarnos en ISO 22301 en tiempo récord. La plataforma es intuitiva y el soporte excepcional.'
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Director de Riesgos',
    company: 'Hospital Central',
    image: '👨‍⚕️',
    rating: 5,
    text: 'Reducimos nuestro RTO en un 60% y logramos una visibilidad completa de nuestros procesos críticos. Imprescindible para el sector salud.'
  },
  {
    name: 'Ana Martínez',
    role: 'Gerente de TI',
    company: 'TechCorp Solutions',
    image: '👩‍💻',
    rating: 5,
    text: 'La mejor inversión en continuidad de negocio. El módulo de crisis management nos salvó durante el último incidente.'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Miles de empresas confían en Fenix-SGCN para su continuidad operacional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Empresas Activas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600">Satisfacción</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600">Soporte</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">ISO</div>
            <div className="text-gray-600">22301 Certificado</div>
          </div>
        </div>
      </div>
    </section>
  );
}
