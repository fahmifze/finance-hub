import { useQuery } from '@tanstack/react-query';
import * as exchangeRateService from '../services/exchangeRate.service';

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: exchangeRateService.getExchangeRates,
    staleTime: 60 * 60 * 1000, // 1 hour - matches server cache
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useConvertCurrency(amount: number, from: string, to: string) {
  return useQuery({
    queryKey: ['convertCurrency', amount, from, to],
    queryFn: () => exchangeRateService.convertCurrency(amount, from, to),
    enabled: amount > 0 && !!from && !!to && from !== to,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useRateLimitStatus() {
  return useQuery({
    queryKey: ['rateLimitStatus'],
    queryFn: exchangeRateService.getRateLimitStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
