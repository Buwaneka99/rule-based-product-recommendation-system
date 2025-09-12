import RecentlyViewed from '../Models/RecentlyViewed.js';
import Product from '../Models/Product.js';

// Track product view
export const trackProductView = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.query.userId || 'guest';

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Remove existing view record for this product by this user
    await RecentlyViewed.deleteOne({ userId, productId });

    // Add new view record
    const viewRecord = new RecentlyViewed({ userId, productId });
    await viewRecord.save();

    // Keep only the last 20 viewed products per user
    const viewCount = await RecentlyViewed.countDocuments({ userId });
    if (viewCount > 20) {
      const oldestViews = await RecentlyViewed.find({ userId })
        .sort({ viewedAt: 1 })
        .limit(viewCount - 20);
      
      const idsToDelete = oldestViews.map(view => view._id);
      await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(201).json({
      success: true,
      message: 'Product view tracked',
      viewRecord
    });

  } catch (error) {
    console.error('Track product view error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking product view: ' + error.message
    });
  }
};

// Get recently viewed products
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const limit = parseInt(req.query.limit) || 10;

    const recentlyViewed = await RecentlyViewed.find({ userId })
      .populate('productId')
      .sort({ viewedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      recentlyViewed: recentlyViewed.filter(item => item.productId) // Filter out null products
    });

  } catch (error) {
    console.error('Get recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recently viewed products: ' + error.message
    });
  }
};

// Clear recently viewed history
export const clearRecentlyViewed = async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';

    await RecentlyViewed.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Recently viewed history cleared'
    });

  } catch (error) {
    console.error('Clear recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing recently viewed history: ' + error.message
    });
  }
};
