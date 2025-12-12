import api from './api';

export interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  lastUpdated: number;
}

export interface ConvertResponse {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: number;
}

export interface RateLimitStatus {
  used: number;
  remaining: number;
  resetTime: number;
}

export async function getExchangeRates(): Promise<ExchangeRatesResponse> {
  const response = await api.get('/exchange-rates');
  return response.data;
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConvertResponse> {
  const response = await api.get('/exchange-rates/convert', {
    params: { amount, from, to },
  });
  return response.data;
}

export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  const response = await api.get('/exchange-rates/status');
  return response.data;
}
