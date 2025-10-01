import { usePreferences } from '@/context/PreferencesContext';
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
  const { preferences } = usePreferences();
  const locale = preferences.locale; // Corregido: usar 'locale' en vez de 'language'

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
