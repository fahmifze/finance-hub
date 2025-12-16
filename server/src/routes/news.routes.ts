import { Router } from 'express';
import * as newsController from '../controllers/news.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes (with optional auth to track saved status)
router.get('/', optionalAuthenticate, newsController.getNews);
router.get('/top', optionalAuthenticate, newsController.getTopNews);
router.get('/search', optionalAuthenticate, newsController.searchNews);
router.get('/by-symbols', optionalAuthenticate, newsController.getNewsBySymbols);
router.get('/rate-limit', newsController.getRateLimitStatus);

// Protected routes (require authentication)
router.get('/saved', authenticate, newsController.getSavedArticles);
router.get('/saved/unread-count', authenticate, newsController.getUnreadCount);
router.post('/saved', authenticate, newsController.saveArticle);
router.delete('/saved/:uuid', authenticate, newsController.removeSavedArticle);
router.patch('/saved/:uuid/read', authenticate, newsController.markAsRead);
router.patch('/saved/:uuid/unread', authenticate, newsController.markAsUnread);

export default router;
