import React from 'react';
import { Filter } from 'lucide-react';
import type { SearchFilters } from '../types';
import '../CSS/ProductFilter.css';

interface ProductFilterProps {
  filters: SearchFilters;
  onFilterChange: (field: keyof SearchFilters, value: any) => void;
  onClearFilters: () => void;
  categories: string[];
  brands: string[];
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  brands,
  showFilters,
  onToggleFilters,
  hasActiveFilters
}) => {
  return (
    <div className={`sidebar-filter ${showFilters ? 'filters-open' : ''}`}>
      {/* Filter Header */}
      <div className="filter-header">
        <h3 className="filter-title">
          <Filter size={18} />
          Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="clear-all-button">
            Clear All
          </button>
        )}
      </div>

      {/* Always Show Filters in Sidebar */}
      <div className="filters-content">
        {/* In Stock Toggle */}
        <div className="stock-filter">
          <label className="stock-toggle">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => onFilterChange('inStock', e.target.checked)}
              className="stock-checkbox"
            />
            <span className="stock-slider"></span>
            <span className="stock-label">Show only in-stock items</span>
          </label>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Brand</label>
          <select
            className="filter-select"
            value={filters.brand || ''}
            onChange={(e) => onFilterChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="price-range">
          <label className="filter-label">Price Range</label>
          
          {/* Price Display */}
          <div className="price-display">
            <span className="price-value">
              ${filters.minPrice || 0} - ${filters.maxPrice || 10000}
            </span>
          </div>
          
          {/* Dual Range Slider */}
          <div 
            className="dual-range-slider"
            style={{
              '--min-percent': ((filters.minPrice || 0) / 10000) * 100,
              '--max-percent': ((filters.maxPrice || 10000) / 10000) * 100,
            } as React.CSSProperties}
          >
            <div className="slider-track"></div>
            <div className="slider-range"></div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.minPrice || 0}
              className="price-slider range-min"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const maxValue = filters.maxPrice || 10000;
                if (value <= maxValue) {
                  onFilterChange('minPrice', value);
                }
              }}
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.maxPrice || 10000}
              className="price-slider range-max"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const minValue = filters.minPrice || 0;
                if (value >= minValue) {
                  onFilterChange('maxPrice', value);
                }
              }}
            />
          </div>
          
          {/* Manual Input (Compact) */}
          <div className="price-inputs-compact">
            <div className="input-wrapper">
              <label className="input-label">Min</label>
              <input
                type="number"
                placeholder="0"
                className="price-input-small"
                value={filters.minPrice || ''}
                max="10000"
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  const maxValue = filters.maxPrice || 10000;
                  if (!value || value <= maxValue) {
                    onFilterChange('minPrice', value);
                  }
                }}
              />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Max</label>
              <input
                type="number"
                placeholder="10000"
                className="price-input-small"
                value={filters.maxPrice || ''}
                max="10000"
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  const minValue = filters.minPrice || 0;
                  if (!value || value >= minValue) {
                    onFilterChange('maxPrice', value);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={filters.sortBy || 'name'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleFilters}
        className="mobile-filter-toggle"
      >
        <Filter size={16} />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
        {hasActiveFilters && <span className="filter-badge">Active</span>}
      </button>
    </div>
  );
};

export default ProductFilter;
