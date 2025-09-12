import express from 'express';
import {
  trackProductView,
  getRecentlyViewed,
  clearRecentlyViewed
} from '../Controllers/RecentlyViewedController.js';

const router = express.Router();

router.post('/track', trackProductView);
router.get('/', getRecentlyViewed);
router.delete('/', clearRecentlyViewed);

export default router;
