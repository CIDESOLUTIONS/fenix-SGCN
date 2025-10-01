"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'es' | 'en' | 'pt';
type Currency = 'COP' | 'USD' | 'BRL';
type Theme = 'light' | 'dark' | 'system';

interface UserPreferences {
  locale: Locale;
  currency: Currency;
  theme: Theme;
}

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const translations = {
  es: {
    'dashboard': 'Panel de Control',
    'planning': 'Planeación y Gobierno',
    'business_context': 'Contexto de Negocio',
    'policies': 'Políticas del SGCN',
    'objectives': 'Objetivos SMART',
    'raci_matrix': 'Matriz RACI',
    'risk_analysis': 'Análisis de Riesgos',
    'business_impact': 'Análisis de Impacto',
    'strategies': 'Estrategias',
    'continuity_plans': 'Planes de Continuidad',
    'testing': 'Pruebas',
    'improvement': 'Mejora Continua',
    'logout': 'Cerrar Sesión',
    'settings': 'Configuración',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'delete': 'Eliminar',
    'edit': 'Editar',
    'create': 'Crear',
    'view': 'Ver',
    'approve': 'Aprobar',
    'reject': 'Rechazar',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'upload': 'Cargar',
    'download': 'Descargar',
    'loading': 'Cargando...',
    'no_data': 'No hay datos',
    'error': 'Error',
    'success': 'Éxito',
    'warning': 'Advertencia',
    'info': 'Información',
    'confirm': 'Confirmar',
    'yes': 'Sí',
    'no': 'No',
    'swot_analysis': 'Análisis FODA',
    'strengths': 'Fortalezas',
    'weaknesses': 'Debilidades',
    'opportunities': 'Oportunidades',
    'threats': 'Amenazas',
    'new_context': 'Nuevo Contexto',
    'new_swot': 'Nuevo Análisis FODA',
    'title': 'Título',
    'description': 'Descripción',
    'content': 'Contenido',
    'elaboration_date': 'Fecha de Elaboración',
    'upload_file': 'Cargar Archivo',
    'status': 'Estado',
    'created_by': 'Creado por',
    'updated_at': 'Actualizado',
  },
  en: {
    'dashboard': 'Dashboard',
    'planning': 'Planning & Governance',
    'business_context': 'Business Context',
    'policies': 'BCMS Policies',
    'objectives': 'SMART Objectives',
    'raci_matrix': 'RACI Matrix',
    'risk_analysis': 'Risk Analysis',
    'business_impact': 'Business Impact Analysis',
    'strategies': 'Strategies',
    'continuity_plans': 'Continuity Plans',
    'testing': 'Testing',
    'improvement': 'Continuous Improvement',
    'logout': 'Logout',
    'settings': 'Settings',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'create': 'Create',
    'view': 'View',
    'approve': 'Approve',
    'reject': 'Reject',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',
    'upload': 'Upload',
    'download': 'Download',
    'loading': 'Loading...',
    'no_data': 'No data',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
    'swot_analysis': 'SWOT Analysis',
    'strengths': 'Strengths',
    'weaknesses': 'Weaknesses',
    'opportunities': 'Opportunities',
    'threats': 'Threats',
    'new_context': 'New Context',
    'new_swot': 'New SWOT Analysis',
    'title': 'Title',
    'description': 'Description',
    'content': 'Content',
    'elaboration_date': 'Elaboration Date',
    'upload_file': 'Upload File',
    'status': 'Status',
    'created_by': 'Created by',
    'updated_at': 'Updated',
  },
  pt: {
    'dashboard': 'Painel de Controle',
    'planning': 'Planejamento e Governança',
    'business_context': 'Contexto do Negócio',
    'policies': 'Políticas do SGCN',
    'objectives': 'Objetivos SMART',
    'raci_matrix': 'Matriz RACI',
    'risk_analysis': 'Análise de Riscos',
    'business_impact': 'Análise de Impacto',
    'strategies': 'Estratégias',
    'continuity_plans': 'Planos de Continuidade',
    'testing': 'Testes',
    'improvement': 'Melhoria Contínua',
    'logout': 'Sair',
    'settings': 'Configurações',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'delete': 'Excluir',
    'edit': 'Editar',
    'create': 'Criar',
    'view': 'Ver',
    'approve': 'Aprovar',
    'reject': 'Rejeitar',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'upload': 'Carregar',
    'download': 'Baixar',
    'loading': 'Carregando...',
    'no_data': 'Sem dados',
    'error': 'Erro',
    'success': 'Sucesso',
    'warning': 'Aviso',
    'info': 'Informação',
    'confirm': 'Confirmar',
    'yes': 'Sim',
    'no': 'Não',
    'swot_analysis': 'Análise SWOT',
    'strengths': 'Forças',
    'weaknesses': 'Fraquezas',
    'opportunities': 'Oportunidades',
    'threats': 'Ameaças',
    'new_context': 'Novo Contexto',
    'new_swot': 'Nova Análise SWOT',
    'title': 'Título',
    'description': 'Descrição',
    'content': 'Conteúdo',
    'elaboration_date': 'Data de Elaboração',
    'upload_file': 'Carregar Arquivo',
    'status': 'Status',
    'created_by': 'Criado por',
    'updated_at': 'Atualizado',
  },
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    locale: 'es',
    currency: 'COP',
    theme: 'light',
  });

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      const parsed = JSON.parse(stored);
      setPreferences(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
    
    if (prefs.theme) {
      applyTheme(prefs.theme);
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/auth/preferences`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(prefs),
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const t = (key: string): string => {
    const dict = translations[preferences.locale] as Record<string, string>;
    return dict[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    const formats: Record<Currency, Intl.NumberFormatOptions> = {
      COP: { style: 'currency', currency: 'COP', minimumFractionDigits: 0 },
      USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      BRL: { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 },
    };

    const locales: Record<Currency, string> = {
      COP: 'es-CO',
      USD: 'en-US',
      BRL: 'pt-BR',
    };

    return new Intl.NumberFormat(locales[preferences.currency], formats[preferences.currency]).format(amount);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, t, formatCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
