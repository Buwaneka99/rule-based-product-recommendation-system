import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import type { Product } from '../types';
import '../CSS/ProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => void;
  categories: string[];
  brands: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  categories,
  brands
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    brand: '',
    description: '',
    imageUrl: '',
    inStock: true,
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    isEcoFriendly: false,
    isBestSeller: false,
    isOnSale: false,
    salePrice: 0,
    saleEndDate: ''
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        brand: product.brand,
        description: product.description,
        imageUrl: product.imageUrl || '',
        inStock: product.inStock,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        salesCount: product.salesCount || 0,
        isEcoFriendly: product.isEcoFriendly || false,
        isBestSeller: product.isBestSeller || false,
        isOnSale: product.isOnSale || false,
        salePrice: product.salePrice || 0,
        saleEndDate: product.saleEndDate ? product.saleEndDate.split('T')[0] : ''
      });
      
      // Check if category or brand is not in the lists (indicating custom values)
      setShowCustomCategory(!categories.includes(product.category) && product.category !== '');
      setShowCustomBrand(!brands.includes(product.brand) && product.brand !== '');
      setCustomCategory(!categories.includes(product.category) ? product.category : '');
      setCustomBrand(!brands.includes(product.brand) ? product.brand : '');
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        brand: '',
        description: '',
        imageUrl: '',
        inStock: true,
        rating: 0,
        reviewCount: 0,
        salesCount: 0,
        isEcoFriendly: false,
        isBestSeller: false,
        isOnSale: false,
        salePrice: 0,
        saleEndDate: ''
      });
      setShowCustomCategory(false);
      setShowCustomBrand(false);
      setCustomCategory('');
      setCustomBrand('');
    }
  }, [product, categories, brands]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    // Check for category (either selected or custom)
    const finalCategory = showCustomCategory ? customCategory : formData.category;
    if (!finalCategory.trim()) {
      newErrors.category = 'Category is required';
    }
    
    // Check for brand (either selected or custom)
    const finalBrand = showCustomBrand ? customBrand : formData.brand;
    if (!finalBrand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (showCustomCategory && !customCategory.trim()) {
      newErrors.customCategory = 'Please enter a category name';
    }
    
    if (showCustomBrand && !customBrand.trim()) {
      newErrors.customBrand = 'Please enter a brand name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'other') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
    
    // Clear errors
    if (errors.category || errors.customCategory) {
      setErrors(prev => ({
        ...prev,
        category: '',
        customCategory: ''
      }));
    }
  };

  const handleBrandChange = (value: string) => {
    if (value === 'other') {
      setShowCustomBrand(true);
      setFormData(prev => ({ ...prev, brand: '' }));
    } else {
      setShowCustomBrand(false);
      setCustomBrand('');
      setFormData(prev => ({ ...prev, brand: value }));
    }
    
    // Clear errors
    if (errors.brand || errors.customBrand) {
      setErrors(prev => ({
        ...prev,
        brand: '',
        customBrand: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Use custom values if they're selected
      const finalFormData = {
        ...formData,
        category: showCustomCategory ? customCategory : formData.category,
        brand: showCustomBrand ? customBrand : formData.brand
      };
      
      console.log('Form data being submitted:', finalFormData);
      onSave(finalFormData);
      onClose();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Package size={24} />
            <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={showCustomCategory ? 'other' : formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="other">Other (Add New Category)</option>
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
              
              {showCustomCategory && (
                <div className="custom-input-container">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className={`custom-input ${errors.customCategory ? 'error' : ''}`}
                  />
                  {errors.customCategory && <span className="error-message">{errors.customCategory}</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <select
                id="brand"
                value={showCustomBrand ? 'other' : formData.brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className={errors.brand ? 'error' : ''}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
                <option value="other">Other (Add New Brand)</option>
              </select>
              {errors.brand && <span className="error-message">{errors.brand}</span>}
              
              {showCustomBrand && (
                <div className="custom-input-container">
                  <input
                    type="text"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="Enter new brand name"
                    className={`custom-input ${errors.customBrand ? 'error' : ''}`}
                  />
                  {errors.customBrand && <span className="error-message">{errors.customBrand}</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={errors.price ? 'error' : ''}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={errors.description ? 'error' : ''}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => handleChange('inStock', e.target.checked)}
                />
                <span className="checkmark"></span>
                In Stock
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isEcoFriendly}
                  onChange={(e) => handleChange('isEcoFriendly', e.target.checked)}
                />
                <span className="checkmark"></span>
                Eco-Friendly Product
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  onChange={(e) => handleChange('isOnSale', e.target.checked)}
                />
                <span className="checkmark"></span>
                On Sale
              </label>
            </div>

            {formData.isOnSale && (
              <>
                <div className="form-group">
                  <label htmlFor="salePrice">Sale Price</label>
                  <input
                    type="number"
                    id="salePrice"
                    value={formData.salePrice}
                    onChange={(e) => handleChange('salePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="saleEndDate">Sale End Date</label>
                  <input
                    type="date"
                    id="saleEndDate"
                    value={formData.saleEndDate}
                    onChange={(e) => handleChange('saleEndDate', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="rating">Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salesCount">Sales Count</label>
              <input
                type="number"
                id="salesCount"
                value={formData.salesCount}
                onChange={(e) => handleChange('salesCount', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <Save size={16} />
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
