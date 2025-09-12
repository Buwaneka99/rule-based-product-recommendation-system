import api from '../lib/api';
import type { WishlistItem } from '../types';

export class WishlistService {
  // Add product to wishlist
  static async addToWishlist(productId: string, userId: string = 'guest'): Promise<WishlistItem> {
    try {
      const response = await api.post(`/wishlist?userId=${userId}`, { productId });
      return response.data.wishlistItem;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove product from wishlist
  static async removeFromWishlist(productId: string, userId: string = 'guest'): Promise<void> {
    try {
      await api.delete(`/wishlist/${productId}?userId=${userId}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Get user's wishlist
  static async getWishlist(userId: string = 'guest'): Promise<WishlistItem[]> {
    try {
      const response = await api.get(`/wishlist?userId=${userId}`);
      return response.data.wishlist;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  // Check if product is in wishlist
  static async checkWishlistStatus(productId: string, userId: string = 'guest'): Promise<boolean> {
    try {
      const response = await api.get(`/wishlist/check/${productId}?userId=${userId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }
}

export default WishlistService;
