import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart, Leaf, Clock, TrendingUp, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import WishlistService from '../services/WishlistService';
import AnalyticsService from '../services/AnalyticsService';
import RecentlyViewedService from '../services/RecentlyViewedService';
import '../CSS/ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  onGetRecommendations?: (productId: string) => void;
  showRecommendationButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  onGetRecommendations, 
  showRecommendationButton = false 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
    // Debug log to check product data
    console.log('ProductCard received product:', {
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      category: product.category
    });
  }, [product._id]);

  const checkWishlistStatus = async () => {
    try {
      const status = await WishlistService.checkWishlistStatus(product._id);
      setIsInWishlist(status);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleCardClick = async () => {
    // Track product view
    try {
      await RecentlyViewedService.trackProductView(product._id);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }

    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(product._id);
        setIsInWishlist(false);
      } else {
        await WishlistService.addToWishlist(product._id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Simulate a purchase to update analytics
      await AnalyticsService.simulatePurchase(product._id);
      console.log('Product added to cart:', product.name);
      // You can add more sophisticated cart logic here
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleGetRecommendations = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onGetRecommendations) {
      onGetRecommendations(product._id);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="star half" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="star empty" />);
    }

    return stars;
  };

  const calculateTimeLeft = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    return 'Expired';
  };

  return (
    <div 
      className="product-card enhanced"
      onClick={handleCardClick}
    >
      <div className="product-image">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            onError={(e) => {
              console.log('Image failed to load:', product.imageUrl);
              const target = e.currentTarget;
              const placeholder = target.parentElement?.querySelector('.product-placeholder') as HTMLElement;
              if (placeholder) {
                target.style.display = 'none';
                placeholder.style.display = 'flex';
              }
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', product.imageUrl);
            }}
          />
        ) : null}
        <div 
          className="product-placeholder" 
          style={{ display: product.imageUrl ? 'none' : 'flex' }}
        >
          📦
        </div>
        
        {/* Badges */}
        <div className="product-badges">
          {product.isEcoFriendly && (
            <span className="badge eco-friendly">
              <Leaf size={12} />
              Eco
            </span>
          )}
          {product.isBestSeller && (
            <span className="badge best-seller">
              <TrendingUp size={12} />
              Best Seller
            </span>
          )}
          {product.isOnSale && product.saleEndDate && (
            <span className="badge flash-sale">
              <Clock size={12} />
              {calculateTimeLeft(product.saleEndDate)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          disabled={isLoading}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} />
        </button>

        <div className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className="product-details">
        <div className="product-header">
          <span className="product-category">{product.category}</span>
          {product.rating && product.rating > 0 && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating.toFixed(1)} ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        
        <div className="product-pricing">
          {product.isOnSale && product.salePrice ? (
            <>
              <span className="sale-price">{formatPrice(product.salePrice)}</span>
              <span className="original-price">{formatPrice(product.price)}</span>
              <span className="discount">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="regular-price">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.salesCount && product.salesCount > 0 && (
          <div className="sales-info">
            <span className="sales-count">{product.salesCount} sold</span>
          </div>
        )}
        
        <button 
          className={`add-to-cart ${!product.inStock ? 'disabled' : ''}`}
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>

        {showRecommendationButton && (
          <button 
            className="get-recommendations-btn"
            onClick={handleGetRecommendations}
            title="Get recommendations based on this product"
          >
            <Sparkles size={16} />
            Get Similar Products
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
