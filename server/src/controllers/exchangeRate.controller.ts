import { Request, Response } from 'express';
import * as exchangeRateService from '../services/exchangeRate.service';

export async function getExchangeRates(req: Request, res: Response) {
  try {
    const cache = await exchangeRateService.getExchangeRates();

    if (!cache) {
      return res.status(503).json({
        error: 'Exchange rate service temporarily unavailable',
      });
    }

    // Return only popular currencies to reduce payload size
    const popularRates: Record<string, number> = {};
    for (const currency of exchangeRateService.POPULAR_CURRENCIES) {
      if (cache.rates[currency]) {
        popularRates[currency] = cache.rates[currency];
      }
    }

    res.json({
      base: cache.base,
      rates: popularRates,
      timestamp: cache.timestamp,
      lastUpdated: cache.lastFetched,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
}

export async function convertCurrency(req: Request, res: Response) {
  try {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
      return res.status(400).json({
        error: 'Missing required parameters: amount, from, to',
      });
    }

    const amountNum = parseFloat(amount as string);
    if (isNaN(amountNum)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const cache = await exchangeRateService.getExchangeRates();
    if (!cache) {
      return res.status(503).json({
        error: 'Exchange rate service temporarily unavailable',
      });
    }

    const convertedAmount = exchangeRateService.convertCurrency(
      amountNum,
      from as string,
      to as string,
      cache.rates
    );

    if (convertedAmount === null) {
      return res.status(400).json({
        error: 'Invalid currency code',
      });
    }

    const rate = exchangeRateService.getExchangeRateForPair(
      from as string,
      to as string,
      cache.rates
    );

    res.json({
      from: from,
      to: to,
      amount: amountNum,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate: rate,
      timestamp: cache.timestamp,
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
}

export function getRateLimitStatus(req: Request, res: Response) {
  try {
    const status = exchangeRateService.getRateLimitStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    res.status(500).json({ error: 'Failed to get rate limit status' });
  }
}
