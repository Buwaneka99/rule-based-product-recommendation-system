import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, Eye, Leaf, Clock, Star } from 'lucide-react';
import type { ProductStats, Product } from '../types';
import AnalyticsService from '../services/AnalyticsService';
import ProductCard from './ProductCard';
import '../CSS/Dashboard.css';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<ProductStats | null>(null);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, flashSales] = await Promise.all([
        AnalyticsService.getDashboardAnalytics(),
        AnalyticsService.getFlashSaleProducts()
      ]);
      
      setAnalytics(analyticsData);
      setFlashSaleProducts(flashSales);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <BarChart3 size={48} />
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h2>Error loading dashboard</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <BarChart3 size={28} />
          Analytics Dashboard
        </h1>
        <button onClick={loadDashboardData} className="btn-secondary">
          Refresh Data
        </button>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{analytics.overview.totalProducts}</p>
            <span className="stat-detail">
              {analytics.overview.stockPercentage}% in stock
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Leaf size={24} />
          </div>
          <div className="stat-content">
            <h3>Eco-Friendly</h3>
            <p className="stat-number">{analytics.overview.ecoFriendlyCount}</p>
            <span className="stat-detail">
              {analytics.overview.ecoPercentage}% of products
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>On Sale</h3>
            <p className="stat-number">{analytics.overview.onSaleCount}</p>
            <span className="stat-detail">Flash sales active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3>Recent Views</h3>
            <p className="stat-number">{analytics.recentActivity.recentViews}</p>
            <span className="stat-detail">Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Flash Sales Section */}
      {flashSaleProducts.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Clock size={24} />
              Flash Sales
            </h2>
            <span className="section-count">{flashSaleProducts.length} active</span>
          </div>
          <div className="products-grid">
            {flashSaleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Top Rated Products */}
      {analytics.topProducts.topRated.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Star size={24} />
              Top Rated Products
            </h2>
            <span className="section-count">{analytics.topProducts.topRated.length} products</span>
          </div>
          <div className="products-grid">
            {analytics.topProducts.topRated.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Best Sellers */}
      {analytics.topProducts.bestSellers.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              Best Sellers
            </h2>
            <span className="section-count">{analytics.topProducts.bestSellers.length} products</span>
          </div>
          <div className="products-grid">
            {analytics.topProducts.bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Category Analytics */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Category Performance</h2>
        </div>
        <div className="analytics-charts">
          <div className="chart-container">
            <h3>Sales by Category</h3>
            <div className="bar-chart">
              {analytics.categoryStats.slice(0, 5).map((category, index) => (
                <div key={category._id} className="bar-item">
                  <div className="bar-label">{category._id}</div>
                  <div className="bar-wrapper">
                    <div 
                      className="bar-fill"
                      style={{
                        width: `${(category.totalSales / Math.max(...analytics.categoryStats.map(c => c.totalSales))) * 100}%`
                      }}
                    ></div>
                    <span className="bar-value">{category.totalSales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      {analytics.topProducts.recentlyAdded.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recently Added Products</h2>
            <span className="section-count">{analytics.topProducts.recentlyAdded.length} products</span>
          </div>
          <div className="products-grid">
            {analytics.topProducts.recentlyAdded.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
