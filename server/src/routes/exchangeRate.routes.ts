import { Router } from 'express';
import * as exchangeRateController from '../controllers/exchangeRate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/exchange-rates - Get latest exchange rates
router.get('/', exchangeRateController.getExchangeRates);

// GET /api/exchange-rates/convert - Convert currency
router.get('/convert', exchangeRateController.convertCurrency);

// GET /api/exchange-rates/status - Get API rate limit status
router.get('/status', exchangeRateController.getRateLimitStatus);

export default router;
