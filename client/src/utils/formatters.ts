// Exchange rates relative to USD (base currency)
// These are approximate rates - in production, you'd fetch these from an API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  MYR: 4.47,
  SGD: 1.34,
  AUD: 1.53,
  CAD: 1.36,
  INR: 83.12,
  CNY: 7.24,
};


/**
 * Convert amount from base currency (USD) to target currency
 */
export function convertCurrency(amount: number, toCurrency: string): number {
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return amount * rate;
}

/**
 * Format currency with conversion from USD to display currency
 * @param amount - Amount in USD (base currency)
 * @param displayCurrency - Currency to display in
 * @param skipConversion - If true, just format without converting (for already converted amounts)
 */
export function formatCurrency(
  amount: number,
  displayCurrency = 'USD',
  skipConversion = false
): string {
  const convertedAmount = skipConversion ? amount : convertCurrency(amount, displayCurrency);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
}

/**
 * Get exchange rate for a currency relative to USD
 */
export function getExchangeRate(currency: string): number {
  return EXCHANGE_RATES[currency] || 1;
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    MYR: 'RM',
    SGD: 'S$',
    AUD: 'A$',
    CAD: 'C$',
    INR: '\u20B9',
    CNY: '\u00A5',
  };
  return symbols[currency] || currency;
}

export function formatDate(dateStr: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateStr).toLocaleDateString('en-US', options || defaultOptions);
}

export function formatDateShort(dateStr: string | Date): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
}
