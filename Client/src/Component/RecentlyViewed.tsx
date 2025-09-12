import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Clock } from 'lucide-react';
import type { RecentlyViewedItem } from '../types';
import RecentlyViewedService from '../services/RecentlyViewedService';
import ProductCard from './ProductCard';
import '../CSS/RecentlyViewed.css';

const RecentlyViewed: React.FC = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    try {
      setLoading(true);
      const items = await RecentlyViewedService.getRecentlyViewed();
      setRecentlyViewed(items);
      setError(null);
    } catch (err) {
      setError('Failed to load recently viewed products');
      console.error('Error loading recently viewed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await RecentlyViewedService.clearRecentlyViewed();
      setRecentlyViewed([]);
    } catch (err) {
      console.error('Error clearing recently viewed:', err);
    }
  };

  const formatViewedTime = (viewedAt: string) => {
    const now = new Date();
    const viewed = new Date(viewedAt);
    const diffMs = now.getTime() - viewed.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${Math.max(1, diffMinutes)} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="recently-viewed-container">
        <div className="loading-state">
          <Eye size={48} />
          <h2>Loading recently viewed...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recently-viewed-container">
        <div className="error-state">
          <h2>Error loading recently viewed</h2>
          <p>{error}</p>
          <button onClick={loadRecentlyViewed} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recently-viewed-container">
      <div className="recently-viewed-header">
        <div className="header-content">
          <h1>
            <Eye size={28} />
            Recently Viewed
          </h1>
          <span className="items-count">
            {recentlyViewed.length} {recentlyViewed.length === 1 ? 'product' : 'products'}
          </span>
        </div>
        
        {recentlyViewed.length > 0 && (
          <button 
            onClick={handleClearHistory} 
            className="btn-danger"
            title="Clear viewing history"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {recentlyViewed.length === 0 ? (
        <div className="empty-recently-viewed">
          <Eye size={64} />
          <h3>No recently viewed products</h3>
          <p>Products you view will appear here for easy access</p>
        </div>
      ) : (
        <div className="recently-viewed-grid">
          {recentlyViewed.map((item) => (
            item.product && (
              <div key={`${item.productId}-${item.viewedAt}`} className="recently-viewed-item">
                <ProductCard 
                  product={item.product} 
                  onProductClick={(product) => {
                    console.log('Product re-clicked:', product.name);
                    // Handle product click - could navigate to product detail
                  }}
                />
                <div className="view-info">
                  <Clock size={14} />
                  <span className="view-time">
                    {formatViewedTime(item.viewedAt)}
                  </span>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
