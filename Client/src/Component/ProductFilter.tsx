import React from 'react';
import { Search, Filter } from 'lucide-react';
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
    <section className="search-section">
      <div className="search-bar">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <button
            onClick={onToggleFilters}
            className={`filter-button ${hasActiveFilters ? 'active' : ''}`}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && <span className="filter-badge">Active</span>}
          </button>
          {hasActiveFilters && (
            <button onClick={onClearFilters} className="clear-button">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-item">
              <label>Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Brand</label>
              <select
                value={filters.brand || ''}
                onChange={(e) => onFilterChange('brand', e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-item">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="$999"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-item">
              <label>Sort By</label>
              <select
                value={filters.sortBy || 'name'}
                onChange={(e) => onFilterChange('sortBy', e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductFilter;
