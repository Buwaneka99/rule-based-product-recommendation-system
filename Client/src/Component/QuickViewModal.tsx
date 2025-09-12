import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingCart, Star, Leaf, TrendingUp, Clock } from 'lucide-react';
import type { Product } from '../types';
import WishlistService from '../services/WishlistService';
import '../CSS/QuickViewModal.css';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      checkWishlistStatus();
    }
  }, [product]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const checkWishlistStatus = async () => {
    if (!product) return;
    
    try {
      const status = await WishlistService.checkWishlistStatus(product._id);
      setIsInWishlist(status);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

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
    if (!product) return;
    
    try {
      console.log('Adding to cart:', product.name);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="star half" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="star empty" />);
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

  if (!isOpen || !product) return null;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>
          <X size={32} />
        </button>

        <div className="quickview-container">
          {/* Left Side - Image */}
          <div className="quickview-image-section">
            <div className="quickview-image-wrapper">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="quickview-image"
                />
              ) : (
                <div className="quickview-image-placeholder">
                  📦
                </div>
              )}
              
              {/* Image Badges */}
              <div className="quickview-badges">
                {product.isEcoFriendly && (
                  <span className="quickview-badge eco">
                    <Leaf size={12} />
                    Eco-Friendly
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="quickview-badge bestseller">
                    <TrendingUp size={12} />
                    Best Seller
                  </span>
                )}
                {product.isOnSale && product.saleEndDate && (
                  <span className="quickview-badge sale">
                    <Clock size={12} />
                    {calculateTimeLeft(product.saleEndDate)}
                  </span>
                )}
              </div>

              {/* Stock Badge */}
              <div className={`quickview-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="quickview-details">
            {/* Category */}
            <div className="quickview-category">{product.category}</div>
            
            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="quickview-rating">
                <div className="quickview-stars">
                  {renderStars(product.rating)}
                </div>
                <span className="quickview-rating-text">
                  {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="quickview-title">{product.name}</h1>
            
            {/* Brand */}
            <p className="quickview-brand">{product.brand}</p>

            {/* Pricing */}
            <div className="quickview-pricing">
              {product.isOnSale && product.salePrice ? (
                <>
                  <span className="quickview-sale-price">{formatPrice(product.salePrice)}</span>
                  <span className="quickview-original-price">{formatPrice(product.price)}</span>
                  <span className="quickview-discount">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="quickview-regular-price">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="quickview-description">
                <h4>Description</h4>
                <p>{product.description}</p>
              </div>
            )}

            {/* Sales Count */}
            {product.salesCount && product.salesCount > 0 && (
              <div className="quickview-sales">
                <span>{product.salesCount} people bought this</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="quickview-actions">
              <button 
                className={`quickview-add-cart ${!product.inStock ? 'disabled' : ''}`}
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button 
                className={`quickview-wishlist ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                disabled={isLoading}
              >
                <Heart size={18} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;