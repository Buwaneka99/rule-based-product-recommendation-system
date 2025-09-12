import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Store,
  Bell,
  Settings
} from 'lucide-react';
import '../CSS/HomeHeader.css';

interface HomeHeaderProps {
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  cartItemCount?: number;
  isDashboard?: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onSearch,
  onCartClick,
  onProfileClick,
  cartItemCount = 0,
  isDashboard = false
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBrandClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="home-header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <div className="brand-logo" onClick={handleBrandClick}>
            <Store className="logo-icon" size={28} />
            <span className="brand-name">SmartStore</span>
          </div>
          <span className="brand-tagline">AI-Powered Product Discovery</span>
        </div>

        {/* Search Bar */}
        <div className={`header-search ${isSearchFocused ? 'focused' : ''}`}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="clear-search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Dashboard Link - only show on home page */}
          {!isDashboard && (
            <button 
              className="action-button dashboard-button"
              onClick={handleDashboardClick}
              title="Dashboard"
            >
              <Settings size={20} />
              <span className="action-text">Dashboard</span>
            </button>
          )}

          {/* Notifications */}
          <button className="action-button notification-button">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* Cart */}
          <button 
            className="action-button cart-button"
            onClick={onCartClick}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="item-count">{cartItemCount}</span>
            )}
          </button>

          {/* Profile */}
          <button 
            className="action-button profile-button"
            onClick={onProfileClick}
            title="Profile"
          >
            <User size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-search">
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
                <button type="submit" className="search-button">
                  <Search size={18} />
                </button>
              </form>
            </div>
            
            <nav className="mobile-nav">
              {/* Dashboard Link - only show on home page */}
              {!isDashboard && (
                <button className="mobile-nav-item" onClick={handleDashboardClick}>
                  <Settings size={18} />
                  <span>Dashboard</span>
                </button>
              )}
              
              <button className="mobile-nav-item" onClick={onCartClick}>
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="nav-badge">{cartItemCount}</span>
                )}
              </button>
              
              <button className="mobile-nav-item">
                <Bell size={18} />
                <span>Notifications</span>
                <span className="nav-badge">3</span>
              </button>
              
              <button className="mobile-nav-item" onClick={onProfileClick}>
                <User size={18} />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;
