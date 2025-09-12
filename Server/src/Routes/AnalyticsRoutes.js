import express from 'express';
import {
  getDashboardAnalytics,
  updateProductStats,
  getFlashSaleProducts
} from '../Controllers/AnalyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardAnalytics);
router.post('/products/:productId/stats', updateProductStats);
router.get('/flash-sales', getFlashSaleProducts);

export default router;
