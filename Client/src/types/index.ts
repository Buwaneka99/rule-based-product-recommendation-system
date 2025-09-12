export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  description: string;
  imageUrl?: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
  // New features
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
  isEcoFriendly?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
  saleEndDate?: string;
}

export interface WishlistItem {
  _id: string;
  productId: string;
  product?: Product;
  dateAdded: string;
}

export interface RecentlyViewedItem {
  productId: string;
  product?: Product;
  viewedAt: string;
}

export interface ProductStats {
  overview: {
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    ecoFriendlyCount: number;
    onSaleCount: number;
    stockPercentage: number;
    ecoPercentage: number;
  };
  topProducts: {
    topRated: Product[];
    bestSellers: Product[];
    recentlyAdded: Product[];
  };
  categoryStats: Array<{
    _id: string;
    count: number;
    totalSales: number;
    avgRating: number;
    ecoFriendlyCount: number;
  }>;
  brandStats: Array<{
    _id: string;
    count: number;
    totalSales: number;
    avgRating: number;
  }>;
  priceRanges: Array<{
    _id: string;
    count: number;
    avgRating: number;
  }>;
  recentActivity: {
    newWishlistItems: number;
    recentViews: number;
  };
}

export interface RecommendationFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

