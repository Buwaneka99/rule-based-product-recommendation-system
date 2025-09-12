import api from '../lib/api';
import type { Product, RecommendationFilters, SearchFilters } from '../types/index';

export class ProductService {
  // Get all products with optional filters
  static async getAllProducts(filters: SearchFilters = {}): Promise<{ products: Product[] }> {
    try {
      // Your backend returns products directly as an array, not wrapped in a data object
      const response = await api.get<Product[]>('/products');
      let products = response.data;
      
      // Apply client-side filtering
      products = this.applyFilters(products, filters);
      
      return { products };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Apply filters to products array (now public static method)
  static applyFilters(products: Product[], filters: SearchFilters): Product[] {
    let filteredProducts = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === filters.category
      );
    }

    // Brand filter
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product =>
        product.brand === filters.brand
      );
    }

    // Price range filters
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= filters.maxPrice!
      );
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.inStock === filters.inStock
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || '').getTime();
            bValue = new Date(b.createdAt || '').getTime();
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    // Pagination (if needed)
    if (filters.limit) {
      const startIndex = ((filters.page || 1) - 1) * filters.limit;
      filteredProducts = filteredProducts.slice(startIndex, startIndex + filters.limit);
    }

    return filteredProducts;
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await api.post('/products', product);
      return response.data.product; // Your backend returns { success, message, product }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      console.log('Updating product with ID:', id);
      console.log('Product data being sent:', product);
      const response = await api.put(`/products/${id}`, product);
      console.log('Update response:', response.data);
      return response.data.product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get recommendations - using the products/:id/recommendations endpoint
  static async getRecommendations(filters: RecommendationFilters = {}): Promise<Product[]> {
    try {
      // Get all products first to have a product ID for recommendations
      const products = await this.getAllProducts();
      if (products.products.length === 0) {
        return [];
      }
      
      // Use the first product to get recommendations from your backend endpoint
      const productId = products.products[0]._id;
      const response = await api.get(`/products/${productId}/recommendations`, {
        params: {
          limit: filters.limit || 8,
          minScore: 10,
          includeOutOfStock: false,
          diversityBoost: true,
          explain: false
        }
      });
      
      // Your backend returns { success, recommendations, currentProduct, ... }
      if (response.data.success && response.data.recommendations) {
        return response.data.recommendations;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback: return some featured products
      try {
        const products = await this.getAllProducts();
        return products.products
          .filter(product => product.inStock && (product.isBestSeller || product.rating && product.rating >= 4.0))
          .slice(0, filters.limit || 8);
      } catch (fallbackError) {
        console.error('Error in fallback recommendations:', fallbackError);
        return [];
      }
    }
  }

  // Get recommendation algorithm information
  static async getRecommendationAlgorithmInfo(): Promise<any> {
    try {
      const response = await api.get('/products/recommendations/algorithm');
      return response.data;
    } catch (error) {
      console.error('Error fetching algorithm info:', error);
      throw error;
    }
  }

  // Get recommendations for a specific product
  static async getProductRecommendations(
    productId: string, 
    options: {
      limit?: number;
      minScore?: number;
      includeOutOfStock?: boolean;
      diversityBoost?: boolean;
      explain?: boolean;
    } = {}
  ): Promise<any> {
    try {
      const response = await api.get(`/products/${productId}/recommendations`, {
        params: {
          limit: options.limit || 5,
          minScore: options.minScore || 10,
          includeOutOfStock: options.includeOutOfStock || false,
          diversityBoost: options.diversityBoost !== false,
          explain: options.explain || false
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching product recommendations:', error);
      throw error;
    }
  }

  // Search products - now uses the same filtering as getAllProducts
  static async searchProducts(query: string, filters: SearchFilters = {}): Promise<{ products: Product[] }> {
    try {
      // Add the search query to filters
      const searchFilters = { ...filters, search: query };
      return await this.getAllProducts(searchFilters);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get product categories - extract from existing products
  static async getCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products.products.map(p => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get product brands - extract from existing products
  static async getBrands(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const brands = [...new Set(products.products.map(p => p.brand))];
      return brands.sort();
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }
}

export default ProductService;
