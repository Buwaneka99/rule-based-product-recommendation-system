import Product from '../Models/Product.js';
import Wishlist from '../Models/Wishlist.js';
import RecentlyViewed from '../Models/RecentlyViewed.js';

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Basic product statistics
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = totalProducts - inStockProducts;
    const ecoFriendlyCount = await Product.countDocuments({ isEcoFriendly: true });
    const onSaleCount = await Product.countDocuments({ isOnSale: true });

    // Top rated products (rating >= 4.0)
    const topRatedProducts = await Product.find({ 
      rating: { $gte: 4.0 }, 
      reviewCount: { $gt: 0 } 
    })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5);

    // Best seller products (highest sales count)
    const bestSellerProducts = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5);

    // Recently added products
    const recentlyAddedProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Category statistics
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSales: { $sum: '$salesCount' },
          avgRating: { $avg: '$rating' },
          ecoFriendlyCount: {
            $sum: { $cond: ['$isEcoFriendly', 1, 0] }
          }
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ]);

    // Brand statistics
    const brandStats = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          totalSales: { $sum: '$salesCount' },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Price range distribution
    const priceRanges = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 50, 100, 200, 500, 1000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      }
    ]);

    // Recent activity
    const recentWishlistCount = await Wishlist.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const recentViewsCount = await RecentlyViewed.countDocuments({
      viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalProducts,
          inStockProducts,
          outOfStockProducts,
          ecoFriendlyCount,
          onSaleCount,
          stockPercentage: totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0,
          ecoPercentage: totalProducts > 0 ? Math.round((ecoFriendlyCount / totalProducts) * 100) : 0
        },
        topProducts: {
          topRated: topRatedProducts,
          bestSellers: bestSellerProducts,
          recentlyAdded: recentlyAddedProducts
        },
        categoryStats,
        brandStats,
        priceRanges,
        recentActivity: {
          newWishlistItems: recentWishlistCount,
          recentViews: recentViewsCount
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics: ' + error.message
    });
  }
};

// Update product ratings and sales
export const updateProductStats = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action, rating } = req.body; // action: 'purchase' or 'rate'

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (action === 'purchase') {
      // Increment sales count
      product.salesCount = (product.salesCount || 0) + 1;
      
      // Update best seller status if sales > 10
      product.isBestSeller = product.salesCount >= 10;
    }

    if (action === 'rate' && rating) {
      // Update rating (simplified - in real app, you'd track individual ratings)
      const currentTotal = (product.rating || 0) * (product.reviewCount || 0);
      product.reviewCount = (product.reviewCount || 0) + 1;
      product.rating = (currentTotal + rating) / product.reviewCount;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product stats updated',
      product
    });

  } catch (error) {
    console.error('Update product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product stats: ' + error.message
    });
  }
};

// Get flash sale products
export const getFlashSaleProducts = async (req, res) => {
  try {
    const now = new Date();
    
    const flashSaleProducts = await Product.find({
      isOnSale: true,
      saleEndDate: { $gt: now }
    }).sort({ saleEndDate: 1 });

    res.status(200).json({
      success: true,
      flashSaleProducts,
      message: `Found ${flashSaleProducts.length} flash sale products`
    });

  } catch (error) {
    console.error('Get flash sale products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flash sale products: ' + error.message
    });
  }
};
