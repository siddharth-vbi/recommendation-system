import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getSimilar,
  getPersonalized,
  getTrending,
  getMostViewed,
} from '../controllers/recommendationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/similar/:id', optionalAuth, getSimilar);
router.get('/personalized', authenticate, getPersonalized);
router.get('/trending', authenticate, getTrending);
router.get('/most-viewed', authenticate, getMostViewed);

export default router;
