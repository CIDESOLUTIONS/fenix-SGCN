"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'pt';
type Currency = 'COP' | 'USD' | 'BRL';
type Theme = 'light' | 'dark' | 'system';

interface PreferencesContextType {
  language: Language;
  currency: Currency;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [currency, setCurrencyState] = useState<Currency>('COP');
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Cargar preferencias del localStorage al iniciar
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      const savedCurr = localStorage.getItem('currency') as Currency;
      const savedTheme = localStorage.getItem('theme') as Theme;

      if (savedLang) setLanguageState(savedLang);
      if (savedCurr) setCurrencyState(savedCurr);
      if (savedTheme) setThemeState(savedTheme);
    }
  }, []);

  // Funciones para actualizar y guardar preferencias
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', curr);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      
      // Aplicar tema
      if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <PreferencesContext.Provider value={{ 
      language, 
      currency, 
      theme, 
      setLanguage, 
      setCurrency, 
      setTheme
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  
  // Retornar valores por defecto si no está en el provider (SSR-friendly)
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // Durante SSR, retornar valores por defecto sin throw
      return {
        language: 'es' as Language,
        currency: 'COP' as Currency,
        theme: 'light' as Theme,
        setLanguage: () => {},
        setCurrency: () => {},
        setTheme: () => {},
      };
    }
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  return context;
}
