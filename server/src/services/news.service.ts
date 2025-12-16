// News Service with caching
// Uses Marketaux API (free tier: 100 requests/day)

export interface NewsArticle {
  uuid: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  relevance_score: number | null;
  entities: Array<{
    symbol: string;
    name: string;
    type: string;
    industry: string | null;
    match_score: number;
    sentiment_score: number | null;
    highlights: Array<{ highlight: string; sentiment: number | null }>;
  }>;
}

export interface MarketauxResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: NewsArticle[];
}

interface NewsCache {
  articles: NewsArticle[];
  query: string;
  lastFetched: number;
}

// API configuration
const API_BASE_URL = 'https://api.marketaux.com/v1';

function getApiKey(): string {
  return process.env.MARKETAUX_API_KEY || '';
}

// Cache duration: 15 minutes
const CACHE_DURATION_MS = 15 * 60 * 1000;

// Rate limit: max 80 requests per day (to stay under 100/day limit)
const MAX_REQUESTS_PER_DAY = 80;
const DAY_MS = 24 * 60 * 60 * 1000;

// In-memory cache - keyed by query string
const newsCache: Map<string, NewsCache> = new Map();
let requestCount = 0;
let requestWindowStart = Date.now();

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

export interface NewsFilters {
  search?: string;
  symbols?: string[];
  industries?: string[];
  countries?: string[];
  filter_entities?: boolean;
  must_have_entities?: boolean;
  limit?: number;
  page?: number;
  sort?: 'published_at' | 'entity_match_score';
  sort_order?: 'asc' | 'desc';
}

function buildCacheKey(filters: NewsFilters): string {
  return JSON.stringify({
    search: filters.search || '',
    symbols: filters.symbols?.sort().join(',') || '',
    industries: filters.industries?.sort().join(',') || '',
    page: filters.page || 1,
    limit: filters.limit || 10,
  });
}

async function fetchNewsFromAPI(filters: NewsFilters): Promise<MarketauxResponse | null> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_marketaux_api_key_here') {
    console.warn('Marketaux API key not configured');
    return null;
  }

  if (!checkRateLimit()) {
    console.warn('Marketaux API rate limit reached for today');
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append('api_token', apiKey);
    params.append('language', 'en');

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.symbols && filters.symbols.length > 0) {
      params.append('symbols', filters.symbols.join(','));
    }

    if (filters.industries && filters.industries.length > 0) {
      params.append('industries', filters.industries.join(','));
    }

    if (filters.countries && filters.countries.length > 0) {
      params.append('countries', filters.countries.join(','));
    }

    if (filters.filter_entities) {
      params.append('filter_entities', 'true');
    }

    if (filters.must_have_entities) {
      params.append('must_have_entities', 'true');
    }

    params.append('limit', String(filters.limit || 10));
    params.append('page', String(filters.page || 1));
    params.append('sort', filters.sort || 'published_at');
    params.append('sort_order', filters.sort_order || 'desc');

    const response = await fetch(`${API_BASE_URL}/news/all?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as MarketauxResponse;

    incrementRequestCount();

    return data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return null;
  }
}

export async function getNews(filters: NewsFilters = {}): Promise<{
  articles: NewsArticle[];
  meta: { found: number; returned: number; page: number; limit: number } | null;
  fromCache: boolean;
}> {
  const cacheKey = buildCacheKey(filters);
  const now = Date.now();

  // Check cache
  const cached = newsCache.get(cacheKey);
  if (cached && (now - cached.lastFetched) < CACHE_DURATION_MS) {
    return {
      articles: cached.articles,
      meta: {
        found: cached.articles.length,
        returned: cached.articles.length,
        page: filters.page || 1,
        limit: filters.limit || 10,
      },
      fromCache: true,
    };
  }

  // Fetch fresh data
  const result = await fetchNewsFromAPI(filters);

  if (result) {
    // Update cache
    newsCache.set(cacheKey, {
      articles: result.data,
      query: cacheKey,
      lastFetched: now,
    });

    return {
      articles: result.data,
      meta: result.meta,
      fromCache: false,
    };
  }

  // Return cached data if available, even if stale
  if (cached) {
    return {
      articles: cached.articles,
      meta: null,
      fromCache: true,
    };
  }

  return {
    articles: [],
    meta: null,
    fromCache: false,
  };
}

export async function getTopFinanceNews(): Promise<NewsArticle[]> {
  const result = await getNews({
    industries: ['Financial', 'Technology'],
    must_have_entities: true,
    limit: 20,
    sort: 'published_at',
    sort_order: 'desc',
  });

  return result.articles;
}

export async function getNewsBySymbols(symbols: string[]): Promise<NewsArticle[]> {
  const result = await getNews({
    symbols,
    filter_entities: true,
    limit: 15,
    sort: 'published_at',
    sort_order: 'desc',
  });

  return result.articles;
}

export async function searchNews(query: string, page: number = 1): Promise<{
  articles: NewsArticle[];
  meta: { found: number; returned: number; page: number; limit: number } | null;
}> {
  const result = await getNews({
    search: query,
    limit: 20,
    page,
    sort: 'published_at',
    sort_order: 'desc',
  });

  return {
    articles: result.articles,
    meta: result.meta,
  };
}

export function getNewsRateLimitStatus(): {
  used: number;
  remaining: number;
  resetTime: number;
} {
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

export function clearNewsCache(): void {
  newsCache.clear();
}
