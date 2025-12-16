import api from './api';
import {
  NewsResponse,
  NewsFilters,
  SavedArticle,
  SaveArticleRequest,
  PaginatedSavedArticles,
  RateLimitStatus,
} from '../types/news.types';
import { ApiResponse } from '../types/api.types';

export async function getNews(filters: NewsFilters = {}): Promise<NewsResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.symbols) params.append('symbols', filters.symbols);
  if (filters.industries) params.append('industries', filters.industries);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const url = queryString ? `/news?${queryString}` : '/news';

  const response = await api.get<ApiResponse<NewsResponse>>(url);
  return response.data.data!;
}

export async function getTopNews(): Promise<NewsResponse> {
  const response = await api.get<ApiResponse<NewsResponse>>('/news/top');
  return response.data.data!;
}

export async function searchNews(query: string, page: number = 1): Promise<NewsResponse> {
  const response = await api.get<ApiResponse<NewsResponse>>(
    `/news/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  return response.data.data!;
}

export async function getNewsBySymbols(symbols: string[]): Promise<NewsResponse> {
  const response = await api.get<ApiResponse<NewsResponse>>(
    `/news/by-symbols?symbols=${symbols.join(',')}`
  );
  return response.data.data!;
}

export async function getSavedArticles(
  page: number = 1,
  limit: number = 20,
  isRead?: boolean
): Promise<PaginatedSavedArticles> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (isRead !== undefined) params.append('isRead', isRead.toString());

  const response = await api.get<ApiResponse<PaginatedSavedArticles>>(
    `/news/saved?${params.toString()}`
  );
  return response.data.data!;
}

export async function saveArticle(data: SaveArticleRequest): Promise<SavedArticle> {
  const response = await api.post<ApiResponse<SavedArticle>>('/news/saved', data);
  return response.data.data!;
}

export async function removeSavedArticle(uuid: string): Promise<void> {
  await api.delete(`/news/saved/${uuid}`);
}

export async function markArticleAsRead(uuid: string): Promise<void> {
  await api.patch(`/news/saved/${uuid}/read`);
}

export async function markArticleAsUnread(uuid: string): Promise<void> {
  await api.patch(`/news/saved/${uuid}/unread`);
}

export async function getUnreadCount(): Promise<number> {
  const response = await api.get<ApiResponse<{ count: number }>>('/news/saved/unread-count');
  return response.data.data!.count;
}

export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  const response = await api.get<ApiResponse<RateLimitStatus>>('/news/rate-limit');
  return response.data.data!;
}
