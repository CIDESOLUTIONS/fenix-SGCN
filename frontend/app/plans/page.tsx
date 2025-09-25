import PlanSelector from '../../components/pricing/PlanSelector';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-emerald-500">
      {/* Header con logo */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/fenix-logo.png" 
              alt="Fenix SGCN" 
              width={50} 
              height={50}
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Fenix SGCN</h1>
              <p className="text-sm text-white/80">Sistema de Continuidad de Negocio</p>
            </div>
          </Link>
          <Link 
            href="/auth/login"
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>

      <PlanSelector />
    </div>
  );
}
