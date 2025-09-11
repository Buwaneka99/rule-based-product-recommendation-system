import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import type { Product, SearchFilters } from '../types';
import ProductService from '../services/ProductService';
import ProductCard from '../Component/ProductCard';
import ProductFilter from '../Component/ProductFilter';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Cache all products
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersToProducts();
    }
  }, [filters, allProducts]);

  const loadInitialData = async () => {
    try {
      const productsData = await ProductService.getAllProducts();
      setAllProducts(productsData.products); // Cache all products
      setProducts(productsData.products); // Initially show all products
      
      try {
        const categoriesData = await ProductService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Could not load categories:', err);
        setCategories([]);
      }
      
      try {
        const brandsData = await ProductService.getBrands();
        setBrands(brandsData);
      } catch (err) {
        console.error('Could not load brands:', err);
        setBrands([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load products. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersToProducts = () => {
    // Apply filters to cached products without making API call
    const filteredProducts = ProductService.applyFilters(allProducts, filters);
    setProducts(filteredProducts);
  };

  const loadRecommendations = async () => {
    setRecommendationsLoading(true);
    try {
      const recommendedProducts = await ProductService.getRecommendations({
        limit: 8
      });
      setRecommendations(recommendedProducts);
      setError(null);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '' });
  };

  const handleProductClick = (product: Product) => {
    // Handle product click - could navigate to product detail page
    console.log('Product clicked:', product.name);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'search' && value !== undefined && value !== ''
  );

  if (error && products.length === 0) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h1>Connection Error</h1>
          <p>{error}</p>
          <p className="error-subtext">
            Make sure your backend server is running on <code>http://localhost:5000</code>
          </p>
          <button onClick={loadInitialData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <main className="main-content">
        {/* Hero Section with Recommendations Button */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="main-title">Product Recommendations</h1>
            <p className="subtitle">Discover products tailored just for you</p>
            <button
              onClick={loadRecommendations}
              disabled={recommendationsLoading}
              className="recommendation-button"
            >
              <Sparkles size={20} />
              {recommendationsLoading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        </section>
        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="recommendations-section">
            <div className="section-header">
              <TrendingUp className="section-icon" size={24} />
              <h2>Recommended for You</h2>
            </div>
            <div className="recommendations-container">
              <div className="product-grid">
                {recommendations.map(product => (
                  <ProductCard key={product._id} product={product} onClick={handleProductClick} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          categories={categories}
          brands={brands}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <h2>
              All Products
              {products.length > 0 && (
                <span className="product-count">({products.length} found)</span>
              )}
            </h2>
          </div>
          
          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="product-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Products Found</h3>
              <p>We couldn't find any products matching your criteria.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onClick={handleProductClick} />
              ))}
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && products.length > 0 && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
