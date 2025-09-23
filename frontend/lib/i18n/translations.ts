export const translations = {
  es: {
    // Common
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      logout: 'Salir',
    },
    // Dashboard
    dashboard: {
      title: 'Panel de Control',
      welcome: 'Bienvenido',
      systemActive: 'Sistema Activo',
      viewConsolidated: 'Vista consolidada del estado del Sistema de Gestión de Continuidad del Negocio',
      criticalProcesses: 'Procesos Críticos',
      highCriticalRisks: 'Riesgos Altos/Críticos',
      developedPlans: 'Planes Desarrollados',
      lastTest: 'Última Prueba',
      identifiedInBIA: 'Identificados en BIA',
      treatmentAreas: 'Áreas de tratamiento',
      pendingApproval: 'Pendientes de aprobación',
      nextIn90Days: 'Próxima: dentro de 90 días',
    },
    // Modules
    modules: {
      planning: 'Planeación',
      riskAnalysis: 'Análisis de Riesgos',
      impactAnalysis: 'Análisis de Impacto',
      strategy: 'Estrategia de Continuidad',
      plans: 'Planes de Continuidad',
      tests: 'Pruebas de Continuidad',
      maintenance: 'Mantenimiento SGCN',
      criteria: 'Criterios de Estrategia',
      configuration: 'Configuración',
    },
  },
  en: {
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      logout: 'Logout',
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      systemActive: 'Active System',
      viewConsolidated: 'Consolidated view of Business Continuity Management System status',
      criticalProcesses: 'Critical Processes',
      highCriticalRisks: 'High/Critical Risks',
      developedPlans: 'Developed Plans',
      lastTest: 'Last Test',
      identifiedInBIA: 'Identified in BIA',
      treatmentAreas: 'Treatment areas',
      pendingApproval: 'Pending approval',
      nextIn90Days: 'Next: within 90 days',
    },
    // Modules
    modules: {
      planning: 'Planning',
      riskAnalysis: 'Risk Analysis',
      impactAnalysis: 'Impact Analysis',
      strategy: 'Continuity Strategy',
      plans: 'Continuity Plans',
      tests: 'Continuity Tests',
      maintenance: 'BCMS Maintenance',
      criteria: 'Strategy Criteria',
      configuration: 'Configuration',
    },
  },
  pt: {
    // Common
    common: {
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      export: 'Exportar',
      logout: 'Sair',
    },
    // Dashboard
    dashboard: {
      title: 'Painel de Controle',
      welcome: 'Bem-vindo',
      systemActive: 'Sistema Ativo',
      viewConsolidated: 'Vista consolidada do estado do Sistema de Gestão de Continuidade de Negócios',
      criticalProcesses: 'Processos Críticos',
      highCriticalRisks: 'Riscos Altos/Críticos',
      developedPlans: 'Planos Desenvolvidos',
      lastTest: 'Último Teste',
      identifiedInBIA: 'Identificados no BIA',
      treatmentAreas: 'Áreas de tratamento',
      pendingApproval: 'Pendentes de aprovação',
      nextIn90Days: 'Próximo: dentro de 90 dias',
    },
    // Modules
    modules: {
      planning: 'Planejamento',
      riskAnalysis: 'Análise de Riscos',
      impactAnalysis: 'Análise de Impacto',
      strategy: 'Estratégia de Continuidade',
      plans: 'Planos de Continuidade',
      tests: 'Testes de Continuidade',
      maintenance: 'Manutenção SGCN',
      criteria: 'Critérios de Estratégia',
      configuration: 'Configuração',
    },
  },
};

export type Language = 'es' | 'en' | 'pt';
export type TranslationKey = keyof typeof translations.es;
