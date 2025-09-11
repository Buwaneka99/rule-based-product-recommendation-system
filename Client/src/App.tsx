import { useState } from 'react';
import { Package, Home as HomeIcon, Settings } from 'lucide-react';
import Home from './Pages/Home';
import ProductManagement from './Component/ProductManagement';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'management'>('home');

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="app-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Package size={24} />
            <span>Product Store</span>
          </div>
          <div className="nav-links">
            <button
              onClick={() => setCurrentPage('home')}
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              <HomeIcon size={18} />
              Home
            </button>
            <button
              onClick={() => setCurrentPage('management')}
              className={`nav-link ${currentPage === 'management' ? 'active' : ''}`}
            >
              <Settings size={18} />
              Manage Products
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="app-main">
        {currentPage === 'home' ? <Home /> : <ProductManagement />}
      </main>
    </div>
  );
}

export default App;
