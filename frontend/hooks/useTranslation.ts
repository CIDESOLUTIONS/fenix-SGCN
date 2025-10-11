import { usePreferences } from '@/contexts/PreferencesContext';
import esTranslations from '@/locales/es.json';
import enTranslations from '@/locales/en.json';
import ptTranslations from '@/locales/pt.json';

type Translations = typeof esTranslations;

const translations: Record<string, Translations> = {
  es: esTranslations,
  en: enTranslations,
  pt: ptTranslations,
};

export function useTranslation() {
  const { language } = usePreferences();
  const locale = language; // Usar 'language' del contexto

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale] || translations['es'];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
        return key;
      }
    }
    
    return value;
  };

  return { t, locale };
}
