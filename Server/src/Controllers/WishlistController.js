import Wishlist from '../Models/Wishlist.js';
import Product from '../Models/Product.js';

// Add product to wishlist
export const addToWishlist = async (req, res) => {
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

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      wishlistItem
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist: ' + error.message
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.query.userId || 'guest';

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });
    
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist: ' + error.message
    });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';

    const wishlistItems = await Wishlist.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      wishlist: wishlistItems
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist: ' + error.message
    });
  }
};

// Check if product is in wishlist
export const checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.query.userId || 'guest';

    const wishlistItem = await Wishlist.findOne({ userId, productId });
    
    res.status(200).json({
      success: true,
      inWishlist: !!wishlistItem
    });

  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist status: ' + error.message
    });
  }
};
