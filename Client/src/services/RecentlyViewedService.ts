import api from '../lib/api';
import type { RecentlyViewedItem } from '../types';

export class RecentlyViewedService {
  // Track product view
  static async trackProductView(productId: string, userId: string = 'guest'): Promise<RecentlyViewedItem> {
    try {
      const response = await api.post(`/recently-viewed/track?userId=${userId}`, { productId });
      return response.data.viewRecord;
    } catch (error) {
      console.error('Error tracking product view:', error);
      throw error;
    }
  }

  // Get recently viewed products
  static async getRecentlyViewed(userId: string = 'guest', limit: number = 10): Promise<RecentlyViewedItem[]> {
    try {
      const response = await api.get(`/recently-viewed?userId=${userId}&limit=${limit}`);
      return response.data.recentlyViewed;
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      throw error;
    }
  }

  // Clear recently viewed history
  static async clearRecentlyViewed(userId: string = 'guest'): Promise<void> {
    try {
      await api.delete(`/recently-viewed?userId=${userId}`);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
      throw error;
    }
  }
}

export default RecentlyViewedService;
