import React, { useState, useEffect } from 'react';
import { Heart, X, Trash2 } from 'lucide-react';
import type { WishlistItem } from '../types';
import WishlistService from '../services/WishlistService';
import ProductCard from './ProductCard';
import '../CSS/Wishlist.css';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await WishlistService.getWishlist();
      setWishlistItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await WishlistService.removeFromWishlist(productId);
      setWishlistItems(items => items.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      // Remove each item individually (since we don't have a clear all endpoint)
      await Promise.all(
        wishlistItems.map(item => WishlistService.removeFromWishlist(item.productId))
      );
      setWishlistItems([]);
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loading-state">
          <Heart size={48} />
          <h2>Loading wishlist...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <div className="error-state">
          <h2>Error loading wishlist</h2>
          <p>{error}</p>
          <button onClick={loadWishlist} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <div className="header-content">
          <h1>
            <Heart size={28} />
            My Wishlist
          </h1>
          <span className="wishlist-count">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleClearAll} 
            className="btn-danger"
            title="Clear all wishlist items"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={64} />
          <h3>Your wishlist is empty</h3>
          <p>Start adding products you love to your wishlist</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            item.product && (
              <div key={item._id} className="wishlist-item">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  title="Remove from wishlist"
                >
                  <X size={16} />
                </button>
                <ProductCard 
                  product={item.product} 
                  onProductClick={(product) => {
                    console.log('Product clicked:', product.name);
                    // Handle product click - could navigate to product detail
                  }}
                />
                <div className="wishlist-item-footer">
                  <span className="date-added">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
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

export default Wishlist;
