'use client';

import { useState, useEffect } from 'react';
import { Building2, TrendingUp, Shield, AlertTriangle, ChevronRight, Globe } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  sector: string;
  activeUsers: number;
  resilienceScore: number;
  criticalRisks: number;
  activePlans: number;
  lastAudit: string;
  subscription: 'Basic' | 'Professional' | 'Enterprise';
}

export default function PortfolioPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    // Simulación - En producción vendría del API
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        sector: 'Tecnología',
        activeUsers: 45,
        resilienceScore: 87,
        criticalRisks: 2,
        activePlans: 12,
        lastAudit: '2025-09-15',
        subscription: 'Enterprise'
      },
      {
        id: '2',
        name: 'HealthCare Plus',
        domain: 'healthplus.com',
        sector: 'Salud',
        activeUsers: 32,
        resilienceScore: 92,
        criticalRisks: 1,
        activePlans: 8,
        lastAudit: '2025-09-10',
        subscription: 'Professional'
      },
      {
        id: '3',
        name: 'FinanceGroup LLC',
        domain: 'financegroup.com',
        sector: 'Financiero',
        activeUsers: 28,
        resilienceScore: 78,
        criticalRisks: 5,
        activePlans: 15,
        lastAudit: '2025-09-01',
        subscription: 'Enterprise'
      }
    ];

    setCompanies(mockCompanies);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'Professional':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Portafolio Empresarial</h1>
        <p className="text-gray-500 mt-1">Gestión multi-tenant y white-labeling</p>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Empresas</div>
              <div className="text-2xl font-bold">{companies.length}</div>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Usuarios Activos</div>
              <div className="text-2xl font-bold text-green-600">
                {companies.reduce((acc, c) => acc + c.activeUsers, 0)}
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Score Promedio</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(companies.reduce((acc, c) => acc + c.resilienceScore, 0) / companies.length)}%
              </div>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Riesgos Críticos</div>
              <div className="text-2xl font-bold text-red-600">
                {companies.reduce((acc, c) => acc + c.criticalRisks, 0)}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            Cargando empresas...
          </div>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedCompany(company.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {company.domain}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionBadge(company.subscription)}`}>
                    {company.subscription}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Score de Resiliencia</span>
                    <span className={`text-lg font-bold ${getScoreColor(company.resilienceScore)}`}>
                      {company.resilienceScore}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usuarios Activos</span>
                    <span className="text-sm font-medium">{company.activeUsers}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Planes Activos</span>
                    <span className="text-sm font-medium">{company.activePlans}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Riesgos Críticos</span>
                    <span className="text-sm font-medium text-red-600">{company.criticalRisks}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Última auditoría: {new Date(company.lastAudit).toLocaleDateString()}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                    Ver Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Company Button */}
      <div className="mt-6 flex justify-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg">
          <Building2 className="w-5 h-5" />
          Agregar Nueva Empresa
        </button>
      </div>
    </div>
  );
}
