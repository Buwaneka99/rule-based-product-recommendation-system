import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import type { Product, SearchFilters } from '../types';
import ProductService from '../services/ProductService';
import ProductCard from '../Component/ProductCard';
import ProductFilter from '../Component/ProductFilter';
import '../CSS/Home.css';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Cache all products
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recommendationData, setRecommendationData] = useState<any>(null); // Full recommendation response
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [algorithmInfo, setAlgorithmInfo] = useState<any>(null);

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
    setError(null);
    
    try {
      console.log('Loading recommendations from backend endpoint...');
      
      // First, get algorithm information
      try {
        const algInfo = await ProductService.getRecommendationAlgorithmInfo();
        setAlgorithmInfo(algInfo);
        console.log('Algorithm info loaded:', algInfo);
      } catch (algErr) {
        console.log('Algorithm info not available:', algErr);
      }
      
      // Get recommendations using the backend endpoint
      const recommendedProducts = await ProductService.getRecommendations({
        limit: 8
      });
      
      console.log('Recommendations loaded:', recommendedProducts.length);
      setRecommendations(recommendedProducts);
      
      if (recommendedProducts.length === 0) {
        setError('No recommendations available at the moment');
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
      
      // Fallback: show some featured products
      try {
        const fallbackProducts = allProducts
          .filter(product => product.inStock && (product.isBestSeller || product.rating && product.rating >= 4.0))
          .slice(0, 8);
        
        if (fallbackProducts.length > 0) {
          setRecommendations(fallbackProducts);
          setError(null);
          console.log('Using fallback recommendations:', fallbackProducts.length);
        }
      } catch (fallbackErr) {
        console.error('Fallback recommendations failed:', fallbackErr);
      }
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Function to get recommendations for a specific product
  const getProductRecommendations = async (productId: string) => {
    setRecommendationsLoading(true);
    setError(null);
    
    try {
      console.log('Getting recommendations for product:', productId);
      
      // First, get algorithm information
      try {
        const algInfo = await ProductService.getRecommendationAlgorithmInfo();
        setAlgorithmInfo(algInfo);
        console.log('Algorithm info loaded:', algInfo);
      } catch (algErr) {
        console.log('Algorithm info not available:', algErr);
      }
      
      const result = await ProductService.getProductRecommendations(productId, {
        limit: 8,
        explain: true
      });
      
      console.log('Product recommendations:', result);
      setRecommendationData(result);
      
      if (result.recommendations && result.recommendations.length > 0) {
        // Extract the actual product data from each recommendation
        const extractedProducts = result.recommendations.map((rec: any) => {
          console.log('Processing recommendation:', rec);
          console.log('Product data:', rec.product);
          return rec.product;
        });
        console.log('Extracted products:', extractedProducts);
        setRecommendations(extractedProducts);
        setError(null);
        
        // Scroll to recommendations section
        const recommendationsSection = document.getElementById('recommendations-section');
        if (recommendationsSection) {
          recommendationsSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setError('No recommendations found for this product');
      }
    } catch (err) {
      console.error('Error getting product recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
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

  const handleProductClick = async (product: Product) => {
    // Handle product click - could navigate to product detail page
    console.log('Product clicked:', product.name);
    
    // Get recommendations for this specific product
    try {
      console.log('Getting recommendations for:', product.name);
      await getProductRecommendations(product._id);
    } catch (err) {
      console.error('Error getting product-specific recommendations:', err);
    }
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
            <p className="subtitle">Discover products tailored just for you using advanced AI algorithms</p>
            <p className="hero-instruction">
              Click "Get Similar Products" on any product card below to see personalized recommendations!
            </p>
            <div className="hero-buttons">
              {algorithmInfo && (
                <div className="algorithm-summary">
                  <span className="algorithm-name">
                    {algorithmInfo.algorithmName || 'Advanced Recommendation Engine'}
                  </span>
                  {algorithmInfo.description && (
                    <p className="algorithm-desc">{algorithmInfo.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section id="recommendations-section" className="recommendations-section">
            <div className="section-header">
              <TrendingUp className="section-icon" size={24} />
              <div className="section-title-group">
                <h2>Recommended for You</h2>
                {recommendationData && (
                  <div className="recommendation-info">
                    <span className="info-text">
                      {recommendationData.message || `${recommendations.length} recommendations found`}
                    </span>
                    {recommendationData.totalCandidates && (
                      <span className="info-detail">
                        from {recommendationData.totalCandidates} products analyzed
                      </span>
                    )}
                  </div>
                )}
                {algorithmInfo && (
                  <div className="algorithm-info">
                    <span className="algorithm-badge">
                      {algorithmInfo.algorithmName || 'AI-Powered'} Recommendations
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="recommendations-container">
              <div className="product-grid">
                {recommendations.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onProductClick={handleProductClick}
                    showRecommendationButton={false}
                  />
                ))}
              </div>
              
              {/* Show recommendation details */}
              {recommendationData && recommendationData.recommendations && (
                <div className="recommendation-details">
                  <h4>Why these recommendations?</h4>
                  <div className="recommendation-insights">
                    {recommendationData.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="recommendation-insight">
                        <div className="product-match-info">
                          <span className="product-name">{rec.product.name}</span>
                          <span className="match-score">{rec.matchPercentage}% match</span>
                        </div>
                        <div className="match-reasons">
                          {rec.reasons.map((reason: string, reasonIndex: number) => (
                            <span key={reasonIndex} className="reason-tag">{reason}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="recommendation-stats">
                    <span>Found {recommendationData.totalQualified} qualified products from {recommendationData.totalCandidates} candidates</span>
                  </div>
                </div>
              )}
            </div>
            {recommendationData && recommendationData.algorithmExplanation && (
              <div className="algorithm-explanation">
                <h4>How we chose these recommendations:</h4>
                <p>{recommendationData.algorithmExplanation.description}</p>
              </div>
            )}
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
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onProductClick={handleProductClick}
                  onGetRecommendations={getProductRecommendations}
                  showRecommendationButton={true}
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
      </main>
    </div>
  );
};

export default Home;
