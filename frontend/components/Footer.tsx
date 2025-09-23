import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y descripción */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/cide-logo.png" 
                alt="Fenix-SGCN" 
                width={60} 
                height={60}
                className="w-15 h-15"
              />
              <div>
                <div className="text-lg font-bold text-[#4F46E5]">Fenix-SGCN</div>
                <div className="text-xs text-gray-500">by CIDE SAS</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              La plataforma SaaS más completa para Sistemas de Gestión de Continuidad del Negocio. 
              Cumplimiento total con ISO 22301, ISO 31000 y estándares internacionales.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bogotá, Colombia
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +57 315 765 1063
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                comercial@cidesas.com
              </div>
            </div>
          </div>

          {/* Columna 2: Soluciones */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Soluciones</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Análisis de Impacto (BIA)</a></li>
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Análisis de Riesgos (ARA)</a></li>
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Planes de Continuidad</a></li>
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Pruebas Automatizadas</a></li>
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Dashboard Ejecutivo</a></li>
              <li><a href="#modulos" className="hover:text-[#4F46E5]">Mejora Continua</a></li>
            </ul>
          </div>

          {/* Columna 3: Cumplimiento */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Cumplimiento</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">ISO 22301:2019</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">ISO 31000:2018</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">ISO 27001:2022</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">NIST Framework</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">GDPR Compliance</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">SOC 2 Type II</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Recursos */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#4F46E5]">Documentación API</a></li>
              <li><a href="#" className="hover:text-[#4F46E5]">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-[#4F46E5]">Webinars</a></li>
              <li><a href="#" className="hover:text-[#4F46E5]">Casos de Estudio</a></li>
              <li><a href="#" className="hover:text-[#4F46E5]">Blog</a></li>
              <li><a href="#" className="hover:text-[#4F46E5]">Soporte Técnico</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>99.95% SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ISO Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span>Enterprise Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Multi-región</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/cide-sas" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#4F46E5]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://twitter.com/cidesas" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#4F46E5]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="https://cidesas.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#4F46E5]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image 
              src="/Logo.png" 
              alt="CIDE SAS" 
              width={24} 
              height={24}
              className="w-6 h-6"
            />
            <p className="text-sm text-gray-500">
              © 2025 CIDE SAS. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-[#4F46E5]">Privacidad</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#4F46E5]">Términos</Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-[#4F46E5]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
