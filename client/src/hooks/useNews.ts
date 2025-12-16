import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as newsService from '../services/news.service';
import { NewsFilters, SaveArticleRequest } from '../types/news.types';

export function useNews(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => newsService.getNews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useTopNews() {
  return useQuery({
    queryKey: ['news', 'top'],
    queryFn: newsService.getTopNews,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useNewsSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['news', 'search', query, page],
    queryFn: () => newsService.searchNews(query, page),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useNewsBySymbols(symbols: string[]) {
  return useQuery({
    queryKey: ['news', 'symbols', symbols],
    queryFn: () => newsService.getNewsBySymbols(symbols),
    enabled: symbols.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useSavedArticles(page: number = 1, limit: number = 20, isRead?: boolean) {
  return useQuery({
    queryKey: ['news', 'saved', page, limit, isRead],
    queryFn: () => newsService.getSavedArticles(page, limit, isRead),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['news', 'unread-count'],
    queryFn: newsService.getUnreadCount,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useNewsRateLimitStatus() {
  return useQuery({
    queryKey: ['news', 'rate-limit'],
    queryFn: newsService.getRateLimitStatus,
    staleTime: 30000, // 30 seconds
  });
}

export function useSaveArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveArticleRequest) => newsService.saveArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['news', 'unread-count'] });
      // Also invalidate news queries to update isSaved status
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useRemoveSavedArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => newsService.removeSavedArticle(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['news', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useMarkArticleAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => newsService.markArticleAsRead(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['news', 'unread-count'] });
    },
  });
}

export function useMarkArticleAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => newsService.markArticleAsUnread(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['news', 'unread-count'] });
    },
  });
}
