"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'pt';
type Currency = 'COP' | 'USD' | 'BRL';
type Theme = 'light' | 'dark' | 'system';
type Environment = 'production' | 'staging' | 'development';

interface PreferencesContextType {
  language: Language;
  currency: Currency;
  theme: Theme;
  environment: Environment;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  setTheme: (theme: Theme) => void;
  setEnvironment: (env: Environment) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [currency, setCurrencyState] = useState<Currency>('COP');
  const [theme, setThemeState] = useState<Theme>('light');
  const [environment, setEnvironmentState] = useState<Environment>('production');

  // Cargar preferencias del localStorage al iniciar
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedCurr = localStorage.getItem('currency') as Currency;
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedEnv = localStorage.getItem('environment') as Environment;

    if (savedLang) setLanguageState(savedLang);
    if (savedCurr) setCurrencyState(savedCurr);
    if (savedTheme) setThemeState(savedTheme);
    if (savedEnv) setEnvironmentState(savedEnv);
  }, []);

  // Funciones para actualizar y guardar preferencias
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Aplicar tema
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);
    localStorage.setItem('environment', env);
  };

  return (
    <PreferencesContext.Provider value={{ 
      language, 
      currency, 
      theme, 
      environment,
      setLanguage, 
      setCurrency, 
      setTheme,
      setEnvironment
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
