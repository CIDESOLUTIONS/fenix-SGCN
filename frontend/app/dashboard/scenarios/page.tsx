'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search, BookOpen, TrendingUp } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  sector: 'Banca' | 'Salud' | 'Energía' | 'Manufactura' | 'Telecomunicaciones' | 'Retail';
  type: 'Tecnológico' | 'Natural' | 'Humano' | 'Legal' | 'Operacional';
  description: string;
  probability: number;
  impact: number;
  strategySuggestions: string[];
  timeToRecovery: number;
  estimatedCost: number;
}

const scenarioLibrary: Scenario[] = [
  {
    id: '1',
    name: 'Falla Completa del Data Center Principal',
    sector: 'Banca',
    type: 'Tecnológico',
    description: 'Pérdida total de acceso al data center primario por falla eléctrica, incendio o desastre natural.',
    probability: 3,
    impact: 5,
    strategySuggestions: ['Data Center Secundario Activo', 'Replicación en Tiempo Real', 'Cloud Backup'],
    timeToRecovery: 4,
    estimatedCost: 500000
  },
  {
    id: '2',
    name: 'Ciberataque Ransomware',
    sector: 'Salud',
    type: 'Tecnológico',
    description: 'Ataque de ransomware que encripta sistemas críticos incluyendo historiales médicos electrónicos.',
    probability: 4,
    impact: 5,
    strategySuggestions: ['Backups Offline Inmutables', 'Segmentación de Red', 'Plan de Respuesta a Incidentes'],
    timeToRecovery: 8,
    estimatedCost: 300000
  },
  {
    id: '3',
    name: 'Interrupción de Suministro Eléctrico Prolongada',
    sector: 'Energía',
    type: 'Natural',
    description: 'Corte de energía de más de 24 horas afectando instalaciones críticas.',
    probability: 3,
    impact: 4,
    strategySuggestions: ['Generadores de Respaldo', 'UPS Industrial', 'Acuerdos con Proveedores Alternativos'],
    timeToRecovery: 12,
    estimatedCost: 200000
  },
  {
    id: '4',
    name: 'Pérdida de Personal Clave',
    sector: 'Manufactura',
    type: 'Humano',
    description: 'Ausencia súbita de personal crítico por pandemia, renuncia masiva o emergencia.',
    probability: 3,
    impact: 4,
    strategySuggestions: ['Cross-Training', 'Documentación de Procesos', 'Personal Temporal Calificado'],
    timeToRecovery: 72,
    estimatedCost: 150000
  },
  {
    id: '5',
    name: 'Falla de Proveedor Crítico',
    sector: 'Retail',
    type: 'Operacional',
    description: 'Proveedor principal declara quiebra o cesa operaciones súbitamente.',
    probability: 3,
    impact: 4,
    strategySuggestions: ['Proveedores Secundarios', 'Inventario de Seguridad', 'Contratos con SLA'],
    timeToRecovery: 168,
    estimatedCost: 100000
  },
  {
    id: '6',
    name: 'Cambio Regulatorio Abrupto',
    sector: 'Telecomunicaciones',
    type: 'Legal',
    description: 'Nueva regulación que requiere cambios inmediatos en infraestructura o procesos.',
    probability: 2,
    impact: 4,
    strategySuggestions: ['Monitoreo Regulatorio', 'Flexibilidad Arquitectónica', 'Reserva de Cumplimiento'],
    timeToRecovery: 720,
    estimatedCost: 400000
  }
];

export default function ScenariosLibraryPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>(scenarioLibrary);
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>(scenarioLibrary);
  const [selectedSector, setSelectedSector] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = scenarios;

    if (selectedSector !== 'Todos') {
      filtered = filtered.filter(s => s.sector === selectedSector);
    }

    if (selectedType !== 'Todos') {
      filtered = filtered.filter(s => s.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredScenarios(filtered);
  }, [selectedSector, selectedType, searchTerm, scenarios]);

  const sectors = ['Todos', 'Banca', 'Salud', 'Energía', 'Manufactura', 'Telecomunicaciones', 'Retail'];
  const types = ['Todos', 'Tecnológico', 'Natural', 'Humano', 'Legal', 'Operacional'];

  const getRiskLevel = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 15) return { level: 'Crítico', color: 'bg-red-100 text-red-800' };
    if (score >= 9) return { level: 'Alto', color: 'bg-orange-100 text-orange-800' };
    if (score >= 5) return { level: 'Medio', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Bajo', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Escenarios</h1>
        <p className="text-gray-500 mt-1">Escenarios sectoriales y estrategias de continuidad recomendadas</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Amenaza
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar escenarios..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Escenarios</div>
              <div className="text-2xl font-bold">{filteredScenarios.length}</div>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Sectores</div>
              <div className="text-2xl font-bold">{sectors.length - 1}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Riesgo Promedio</div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(filteredScenarios.reduce((acc, s) => acc + (s.probability * s.impact), 0) / filteredScenarios.length) || 0}
              </div>
            </div>
            <Filter className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Costo Promedio</div>
              <div className="text-2xl font-bold text-green-600">
                ${(filteredScenarios.reduce((acc, s) => acc + s.estimatedCost, 0) / filteredScenarios.length / 1000).toFixed(0)}K
              </div>
            </div>
            <Plus className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenarios.map((scenario) => {
          const risk = getRiskLevel(scenario.probability, scenario.impact);
          return (
            <div key={scenario.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {scenario.sector}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {scenario.type}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${risk.color}`}>
                    {risk.level}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Probabilidad</div>
                    <div className="text-sm font-medium">{scenario.probability}/5</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Impacto</div>
                    <div className="text-sm font-medium">{scenario.impact}/5</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">RTO Estimado</div>
                    <div className="text-sm font-medium">{scenario.timeToRecovery}h</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Costo Estimado</div>
                    <div className="text-sm font-medium">${(scenario.estimatedCost / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Estrategias Recomendadas:</div>
                  <div className="flex flex-wrap gap-1">
                    {scenario.strategySuggestions.map((strategy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Aplicar al Proceso
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron escenarios con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}
