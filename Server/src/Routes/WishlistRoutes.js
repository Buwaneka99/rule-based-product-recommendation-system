import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus
} from '../Controllers/WishlistController.js';

const router = express.Router();

router.post('/', addToWishlist);
router.get('/', getWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlistStatus);

export default router;
