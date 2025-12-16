export interface NewsEntity {
  symbol: string;
  name: string;
  type: string;
  industry: string | null;
  match_score: number;
  sentiment_score: number | null;
  highlights: Array<{
    highlight: string;
    sentiment: number | null;
  }>;
}

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
  entities: NewsEntity[];
  isSaved?: boolean;
}

export interface NewsMeta {
  found: number;
  returned: number;
  limit: number;
  page: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  meta: NewsMeta | null;
  fromCache?: boolean;
}

export interface NewsFilters {
  search?: string;
  symbols?: string;
  industries?: string;
  page?: number;
  limit?: number;
}

export interface SavedArticle {
  id: number;
  userId: number;
  articleUuid: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  source: string | null;
  publishedAt: string;
  categories: string[] | null;
  tickers: string[] | null;
  savedAt: string;
  isRead: boolean;
}

export interface SaveArticleRequest {
  uuid: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  source?: string;
  publishedAt: string;
  categories?: string[];
  tickers?: string[];
}

export interface PaginatedSavedArticles {
  data: SavedArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RateLimitStatus {
  used: number;
  remaining: number;
  resetTime: number;
}
