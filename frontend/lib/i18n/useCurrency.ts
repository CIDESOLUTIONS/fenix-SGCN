"use client";
import { usePreferences } from '../../contexts/PreferencesContext';

// Tasas de conversión (configurables desde admin)
const DEFAULT_EXCHANGE_RATES = {
  COP: 4000, // Pesos por dólar
  USD: 1,    // Dólar base
  BRL: 5.30  // Reales por dólar
};

export function useCurrency() {
  const { currency } = usePreferences();

  // Obtener tasas de localStorage o usar defaults
  const getExchangeRates = () => {
    if (typeof window === 'undefined') return DEFAULT_EXCHANGE_RATES;
    
    const saved = localStorage.getItem('exchangeRates');
    return saved ? JSON.parse(saved) : DEFAULT_EXCHANGE_RATES;
  };

  const formatCurrency = (amountUSD: number): string => {
    const rates = getExchangeRates();
    const convertedAmount = Math.round(amountUSD * rates[currency]);

    switch (currency) {
      case 'COP':
        return `$${convertedAmount.toLocaleString('es-CO')}`;
      case 'USD':
        return `USD$${convertedAmount.toLocaleString('en-US')}`;
      case 'BRL':
        return `R$${convertedAmount.toLocaleString('pt-BR')}`;
      default:
        return `$${convertedAmount}`;
    }
  };

  const convertAmount = (amountUSD: number): number => {
    const rates = getExchangeRates();
    return Math.round(amountUSD * rates[currency]);
  };

  return { formatCurrency, convertAmount, currency };
}

// Función para actualizar tasas (solo admin)
export function updateExchangeRates(rates: typeof DEFAULT_EXCHANGE_RATES) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('exchangeRates', JSON.stringify(rates));
  }
}

// Función para obtener tasas actuales
export function getExchangeRates() {
  if (typeof window === 'undefined') return DEFAULT_EXCHANGE_RATES;
  
  const saved = localStorage.getItem('exchangeRates');
  return saved ? JSON.parse(saved) : DEFAULT_EXCHANGE_RATES;
}
