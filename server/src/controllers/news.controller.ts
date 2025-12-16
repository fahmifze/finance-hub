import { Request, Response, NextFunction } from 'express';
import * as newsService from '../services/news.service';
import * as savedArticleModel from '../models/savedArticle.model';
import { sendSuccess, sendCreated, sendNoContent, sendError, sendNotFound } from '../utils/response';

// Get news feed
export async function getNews(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      search,
      symbols,
      industries,
      page = '1',
      limit = '20',
    } = req.query;

    const filters: newsService.NewsFilters = {
      search: search as string,
      symbols: symbols ? (symbols as string).split(',') : undefined,
      industries: industries ? (industries as string).split(',') : undefined,
      page: parseInt(page as string) || 1,
      limit: Math.min(parseInt(limit as string) || 20, 50),
      must_have_entities: true,
      sort: 'published_at',
      sort_order: 'desc',
    };

    const result = await newsService.getNews(filters);

    // If user is logged in, mark which articles are saved
    let savedUuids: string[] = [];
    if (req.user?.userId) {
      savedUuids = await savedArticleModel.getSavedArticleUuids(req.user.userId);
    }

    const articlesWithSavedStatus = result.articles.map((article) => ({
      ...article,
      isSaved: savedUuids.includes(article.uuid),
    }));

    return sendSuccess(res, {
      articles: articlesWithSavedStatus,
      meta: result.meta,
      fromCache: result.fromCache,
    });
  } catch (error) {
    next(error);
  }
}

// Get top finance news
export async function getTopNews(req: Request, res: Response, next: NextFunction) {
  try {
    const articles = await newsService.getTopFinanceNews();

    // If user is logged in, mark which articles are saved
    let savedUuids: string[] = [];
    if (req.user?.userId) {
      savedUuids = await savedArticleModel.getSavedArticleUuids(req.user.userId);
    }

    const articlesWithSavedStatus = articles.map((article) => ({
      ...article,
      isSaved: savedUuids.includes(article.uuid),
    }));

    return sendSuccess(res, { articles: articlesWithSavedStatus });
  } catch (error) {
    next(error);
  }
}

// Search news
export async function searchNews(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, page = '1' } = req.query;

    if (!q) {
      return sendError(res, 'Search query is required', 400);
    }

    const result = await newsService.searchNews(q as string, parseInt(page as string) || 1);

    // If user is logged in, mark which articles are saved
    let savedUuids: string[] = [];
    if (req.user?.userId) {
      savedUuids = await savedArticleModel.getSavedArticleUuids(req.user.userId);
    }

    const articlesWithSavedStatus = result.articles.map((article) => ({
      ...article,
      isSaved: savedUuids.includes(article.uuid),
    }));

    return sendSuccess(res, {
      articles: articlesWithSavedStatus,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

// Get news by stock symbols
export async function getNewsBySymbols(req: Request, res: Response, next: NextFunction) {
  try {
    const { symbols } = req.query;

    if (!symbols) {
      return sendError(res, 'Symbols are required', 400);
    }

    const symbolList = (symbols as string).split(',').map((s) => s.trim().toUpperCase());
    const articles = await newsService.getNewsBySymbols(symbolList);

    // If user is logged in, mark which articles are saved
    let savedUuids: string[] = [];
    if (req.user?.userId) {
      savedUuids = await savedArticleModel.getSavedArticleUuids(req.user.userId);
    }

    const articlesWithSavedStatus = articles.map((article) => ({
      ...article,
      isSaved: savedUuids.includes(article.uuid),
    }));

    return sendSuccess(res, { articles: articlesWithSavedStatus });
  } catch (error) {
    next(error);
  }
}

// Get saved articles
export async function getSavedArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { page = '1', limit = '20', isRead } = req.query;

    const result = await savedArticleModel.findAllByUser(userId, {
      page: parseInt(page as string) || 1,
      limit: Math.min(parseInt(limit as string) || 20, 50),
      isRead: isRead !== undefined ? isRead === 'true' : undefined,
    });

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

// Save an article
export async function saveArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { uuid, title, description, url, imageUrl, source, publishedAt, categories, tickers } = req.body;

    // Check if already saved
    const existing = await savedArticleModel.findByUserAndUuid(userId, uuid);
    if (existing) {
      return sendError(res, 'Article already saved', 400);
    }

    const article = await savedArticleModel.create({
      userId,
      articleUuid: uuid,
      title,
      description,
      url,
      imageUrl,
      source,
      publishedAt: new Date(publishedAt),
      categories,
      tickers,
    });

    return sendCreated(res, article, 'Article saved successfully');
  } catch (error) {
    next(error);
  }
}

// Remove saved article
export async function removeSavedArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { uuid } = req.params;

    const removed = await savedArticleModel.remove(userId, uuid);

    if (!removed) {
      return sendNotFound(res, 'Article not found');
    }

    return sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

// Mark article as read
export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { uuid } = req.params;

    const updated = await savedArticleModel.markAsRead(userId, uuid);

    if (!updated) {
      return sendNotFound(res, 'Article not found');
    }

    return sendSuccess(res, { message: 'Article marked as read' });
  } catch (error) {
    next(error);
  }
}

// Mark article as unread
export async function markAsUnread(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { uuid } = req.params;

    const updated = await savedArticleModel.markAsUnread(userId, uuid);

    if (!updated) {
      return sendNotFound(res, 'Article not found');
    }

    return sendSuccess(res, { message: 'Article marked as unread' });
  } catch (error) {
    next(error);
  }
}

// Get unread count
export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const count = await savedArticleModel.getUnreadCount(userId);

    return sendSuccess(res, { count });
  } catch (error) {
    next(error);
  }
}

// Get rate limit status
export async function getRateLimitStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const status = newsService.getNewsRateLimitStatus();
    return sendSuccess(res, status);
  } catch (error) {
    next(error);
  }
}
