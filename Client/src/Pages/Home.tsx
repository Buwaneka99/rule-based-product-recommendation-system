import { useState, useEffect } from 'react';
import type { Product, SearchFilters } from '../types';
import ProductService from '../services/ProductService';
import ProductCard from '../Component/ProductCard';
import ProductFilter from '../Component/ProductFilter';
import HomeHeader from '../Component/HomeHeader';
import QuickViewModal from '../Component/QuickViewModal';
import '../CSS/Home.css';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Cache all products
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Header state
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '' });
  };

  const handleProductClick = async (product: Product) => {
    // Handle product click - could navigate to product detail page
    console.log('Product clicked:', product.name);
  };

  // Header handler functions
  const handleHeaderSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
    // TODO: Navigate to cart page or open cart modal
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // TODO: Navigate to profile page or open profile modal
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'search' && value !== undefined && value !== '' && value !== false
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
      {/* Header */}
      <HomeHeader
        onSearch={handleHeaderSearch}
        onCartClick={handleCartClick}
        onProfileClick={handleProfileClick}
        cartItemCount={cartItemCount}
      />
      
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Discover Your Perfect Products</h1>
            <p className="welcome-subtitle">
              Browse our extensive collection of products below to find exactly what you're looking for
            </p>
          </div>
        </section>

        {/* Main Layout with Sidebar and Content */}
        <div className="content-layout">
          {/* Left Sidebar - Filters */}
          <aside className="filters-sidebar">
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
          </aside>

          {/* Right Content - Products */}
          <div className="products-content">
            {/* Products Section */}
            <section className="products-section">
              <div className="section-header">
                <h2>
                  <span>All Products</span>
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
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onProductClick={handleProductClick}
                      onQuickView={handleQuickView}
                      showRecommendationButton={false}
                    />
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
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default Home;
