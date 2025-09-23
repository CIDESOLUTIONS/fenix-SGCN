"use client";
import { usePreferences } from '../../contexts/PreferencesContext';
import { translations, Language } from './translations';

export function useTranslation() {
  const { language } = usePreferences();

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language as Language];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
  };

  return { t, language };
}
