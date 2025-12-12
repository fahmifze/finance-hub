// Exchange Rate Service with caching and rate limiting
// Uses Open Exchange Rates API (free tier: 1000 requests/month)

interface ExchangeRateCache {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
  lastFetched: number;
}

interface ExchangeRateResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

// API configuration - API key should be set in environment variables
const API_BASE_URL = 'https://openexchangerates.org/api';

// Get API key dynamically (to ensure dotenv has loaded)
function getApiKey(): string {
  return process.env.EXCHANGE_RATE_API_KEY || '';
}

// Cache duration: 1 hour (to minimize API calls)
const CACHE_DURATION_MS = 60 * 60 * 1000;

// Rate limit: max 30 requests per day (to stay well under 1000/month limit)
const MAX_REQUESTS_PER_DAY = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// In-memory cache
let exchangeRateCache: ExchangeRateCache | null = null;
let requestCount = 0;
let requestWindowStart = Date.now();

// Popular currencies for display
export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'MYR', 'SGD', 'JPY', 'AUD', 'CAD', 'INR', 'CNY'];

function checkRateLimit(): boolean {
  const now = Date.now();

  // Reset counter if a day has passed
  if (now - requestWindowStart > DAY_MS) {
    requestCount = 0;
    requestWindowStart = now;
  }

  return requestCount < MAX_REQUESTS_PER_DAY;
}

function incrementRequestCount(): void {
  requestCount++;
}

async function fetchLatestRates(): Promise<ExchangeRateCache | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('Exchange rate API key not configured');
    return null;
  }

  if (!checkRateLimit()) {
    console.warn('Exchange rate API rate limit reached for today');
    return exchangeRateCache; // Return cached data if available
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/latest.json?app_id=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json() as ExchangeRateResponse;

    incrementRequestCount();

    exchangeRateCache = {
      rates: data.rates,
      base: data.base,
      timestamp: data.timestamp * 1000, // Convert to milliseconds
      lastFetched: Date.now(),
    };

    return exchangeRateCache;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return exchangeRateCache; // Return cached data on error
  }
}

export async function getExchangeRates(): Promise<ExchangeRateCache | null> {
  const now = Date.now();

  // Return cached data if still valid
  if (exchangeRateCache && (now - exchangeRateCache.lastFetched) < CACHE_DURATION_MS) {
    return exchangeRateCache;
  }

  // Fetch fresh data
  return fetchLatestRates();
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number | null {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }

  // Convert through USD (base currency)
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
}

export function getExchangeRateForPair(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number | null {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }

  // Calculate rate: 1 fromCurrency = X toCurrency
  return rates[toCurrency] / rates[fromCurrency];
}

export function getRateLimitStatus(): { used: number; remaining: number; resetTime: number } {
  const now = Date.now();

  // Reset counter if a day has passed
  if (now - requestWindowStart > DAY_MS) {
    requestCount = 0;
    requestWindowStart = now;
  }

  return {
    used: requestCount,
    remaining: MAX_REQUESTS_PER_DAY - requestCount,
    resetTime: requestWindowStart + DAY_MS,
  };
}
