import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductManagement from '../Component/ProductManagement';
import HomeHeader from '../Component/HomeHeader';
import '../CSS/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleHeaderSearch = (query: string) => {
    console.log('Dashboard search:', query);
    // You can implement dashboard-specific search here
  };

  const handleCartClick = () => {
    console.log('Cart clicked from dashboard');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked from dashboard');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked from dashboard');
  };

  const handleGetRecommendations = () => {
    console.log('Get recommendations clicked from dashboard');
    // Navigate back to home with recommendations
    navigate('/?showRecommendations=true');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <HomeHeader
        onSearch={handleHeaderSearch}
        onCartClick={handleCartClick}
        onWishlistClick={handleWishlistClick}
        onProfileClick={handleProfileClick}
        onGetRecommendations={handleGetRecommendations}
        cartItemCount={0}
        wishlistItemCount={0}
        isDashboard={true}
      />
      
      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <button onClick={handleBackToHome} className="back-button">
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <div className="dashboard-title">
            <h1>Product Management Dashboard</h1>
            <p>Manage your product catalog and inventory</p>
          </div>
        </div>
        
        {/* Product Management Component */}
        <div className="dashboard-main">
          <ProductManagement />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
