import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  trackView,
  toggleLike,
  trackSearch,
  getRecentSearches,
  getLikedIds,
  getViewCounts,
  getCategoryViewCounts,
} from '../controllers/activityController.js';

const router = Router();

router.post('/view', authenticate, trackView);
router.post('/like', authenticate, toggleLike);
router.post('/search', authenticate, trackSearch);
router.get('/recent-searches', authenticate, getRecentSearches);
router.get('/liked-ids', authenticate, getLikedIds);
router.get('/view-counts', authenticate, getViewCounts);
router.get('/category-view-counts', authenticate, getCategoryViewCounts);

export default router;
