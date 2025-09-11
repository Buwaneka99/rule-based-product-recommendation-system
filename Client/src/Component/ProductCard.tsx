import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Handle add to cart logic here
    console.log('Add to cart:', product.name);
    // You can add more sophisticated cart logic here
  };

  return (
    <div 
      className="product-card"
      tabIndex={-1}
      role="article"
      aria-label={`Product: ${product.name}`}
      onFocus={(e) => (e.target as HTMLElement).blur()} // Prevent focus
      onClick={handleCardClick}
    >
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-placeholder">📦</div>
        )}
        <div className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className="product-details">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        
        <div className="product-price">
          {formatPrice(product.price)}
        </div>
        
        <button 
          className={`add-to-cart ${!product.inStock ? 'disabled' : ''}`}
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
