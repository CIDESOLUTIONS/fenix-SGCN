type Currency = 'USD' | 'COP' | 'BRL';

const currencyConfig = {
  USD: {
    symbol: '$',
    code: 'USD',
    locale: 'en-US',
    decimals: 2,
  },
  COP: {
    symbol: '$',
    code: 'COP',
    locale: 'es-CO',
    decimals: 0,
  },
  BRL: {
    symbol: 'R$',
    code: 'BRL',
    locale: 'pt-BR',
    decimals: 2,
  },
};

export function formatCurrency(amount: number, currency: Currency = 'COP'): string {
  const config = currencyConfig[currency];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);
}

export function formatNumber(value: number, locale: string = 'es-CO'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(date: Date | string, locale: string = 'es-CO'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string, locale: string = 'es-CO'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
