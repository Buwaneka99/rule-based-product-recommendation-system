import api from '../lib/api';
import type { ProductStats, Product } from '../types';

export class AnalyticsService {
  // Get dashboard analytics
  static async getDashboardAnalytics(): Promise<ProductStats> {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data.analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Update product stats (purchase or rating)
  static async updateProductStats(productId: string, action: 'purchase' | 'rate', rating?: number): Promise<Product> {
    try {
      const response = await api.post(`/analytics/products/${productId}/stats`, { action, rating });
      return response.data.product;
    } catch (error) {
      console.error('Error updating product stats:', error);
      throw error;
    }
  }

  // Get flash sale products
  static async getFlashSaleProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/analytics/flash-sales');
      return response.data.flashSaleProducts;
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      throw error;
    }
  }

  // Simulate a purchase (for demo purposes)
  static async simulatePurchase(productId: string): Promise<Product> {
    return this.updateProductStats(productId, 'purchase');
  }

  // Submit a rating (for demo purposes)
  static async submitRating(productId: string, rating: number): Promise<Product> {
    return this.updateProductStats(productId, 'rate', rating);
  }
}

export default AnalyticsService;
