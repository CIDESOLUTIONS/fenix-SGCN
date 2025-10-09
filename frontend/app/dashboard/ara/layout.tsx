'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  AlertTriangle, 
  Calculator, 
  Grid3x3, 
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  FileText,
  ClipboardList,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface RiskStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgScoreBefore: number;
  avgScoreAfter: number;
  withTreatment: number;
  reduction: number;
}

export default function ARALayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [stats, setStats] = useState<RiskStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    avgScoreBefore: 0,
    avgScoreAfter: 0,
    withTreatment: 0,
    reduction: 0,
  });
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const tabs = [
    { id: 'scoring', label: 'Criterios de Evaluación', path: '/dashboard/ara/scoring', icon: Calculator },
    { id: 'risks', label: 'Registro de Riesgos', path: '/dashboard/ara/risks', icon: ClipboardList },
    { id: 'evaluation', label: 'Evaluación Cualitativa', path: '/dashboard/ara/evaluation', icon: BarChart3 },
    { id: 'matrix', label: 'Visualización (Mapa Calor)', path: '/dashboard/ara/matrix', icon: Grid3x3 },
    { id: 'treatment', label: 'Tratamiento', path: '/dashboard/ara/treatment', icon: ShieldCheck },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/risk-assessments');
      if (response.ok) {
        const risks = await response.json();
        
        const total = risks.length;
        const critical = risks.filter((r: any) => r.scoreBefore >= 15).length;
        const high = risks.filter((r: any) => r.scoreBefore >= 9 && r.scoreBefore < 15).length;
        const medium = risks.filter((r: any) => r.scoreBefore >= 5 && r.scoreBefore < 9).length;
        const low = risks.filter((r: any) => r.scoreBefore < 5).length;
        
        const avgScoreBefore = total > 0 
          ? risks.reduce((acc: number, r: any) => acc + r.scoreBefore, 0) / total 
          : 0;
        const avgScoreAfter = total > 0 
          ? risks.reduce((acc: number, r: any) => acc + r.scoreAfter, 0) / total 
          : 0;
        
        const reduction = avgScoreBefore > 0 
          ? ((avgScoreBefore - avgScoreAfter) / avgScoreBefore) * 100 
          : 0;

        setStats({
          total,
          critical,
          high,
          medium,
          low,
          avgScoreBefore,
          avgScoreAfter,
          withTreatment: risks.filter((r: any) => r.scoreAfter < r.scoreBefore).length,
          reduction,
        });
      }
    } catch (error) {
      console.error('Error fetching risk stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      const response = await fetch('/api/reports/risk-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resumen_Riesgos_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 15) return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    if (score >= 9) return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
    return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con título y botón PDF */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Análisis de Riesgos (ARA)
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ISO 22301 Cláusula 8.2.3 & ISO 31000
                </p>
              </div>
            </div>
            
            {/* Botón Generar PDF */}
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF || stats.total === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-4 h-4" />
              {generatingPDF ? 'Generando...' : 'Generar PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* KPIs - Siempre visibles */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-[88px] z-10">
        <div className="px-6 py-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Riesgos */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Riesgos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getRiskLevelColor(20)}`}>
                        {stats.critical} Críticos
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getRiskLevelColor(12)}`}>
                        {stats.high} Altos
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </div>

              {/* Riesgo Inherente */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Riesgo Inherente</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.avgScoreBefore.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Promedio antes de controles</p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>

              {/* Riesgo Residual */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Riesgo Residual</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.avgScoreAfter.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Promedio después de controles</p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Reducción */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reducción</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {stats.reduction.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.withTreatment} con tratamiento
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[232px] z-10">
        <div className="px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${isActive
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
