import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from 'lucide-react';
import type { Product } from '../types';
import ProductService from '../services/ProductService';
import ProductForm from './ProductForm';
import '../CSS/ProductManagement.css';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts();
      setProducts(response.products);
      
      // Extract unique categories and brands
      const uniqueCategories = [...new Set(response.products.map(p => p.category))];
      const uniqueBrands = [...new Set(response.products.map(p => p.brand))];
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
      
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await ProductService.createProduct(productData);
      await loadProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
      showSuccessMessage('Product created successfully!');
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedProduct) return;
    
    try {
      await ProductService.updateProduct(selectedProduct._id, productData);
      await loadProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
      showSuccessMessage('Product updated successfully!');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await ProductService.deleteProduct(productToDelete._id);
      await loadProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      showSuccessMessage('Product deleted successfully!');
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const openCreateForm = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-state">
          <Package size={48} />
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="management-container">
      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={20} />
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className="alert-close">×</button>
        </div>
      )}

      <div className="management-header">
        <div className="header-content">
          <div className="header-title">
            <Package size={28} />
            <h1>Product Management</h1>
          </div>
          <button onClick={openCreateForm} className="btn-primary">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="products-table-container">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No products found</h3>
            <p>{searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first product'}</p>
            {!searchTerm && (
              <button onClick={openCreateForm} className="btn-primary">
                <Plus size={20} />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-image-cell">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className="image-placeholder">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="product-name-cell">
                      <span className="product-name">{product.name}</span>
                      <span className="product-description">{product.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>{product.brand}</td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditForm(product)}
                        className="btn-action btn-edit"
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="btn-action btn-delete"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        categories={categories}
        brands={brands}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <div className="modal-title">
                <AlertTriangle size={24} className="text-red" />
                <h2>Confirm Delete</h2>
              </div>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeDeleteModal} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleDeleteProduct} className="btn-delete">
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
