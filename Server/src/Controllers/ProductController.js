import Product from '../Models/Product.js';
import RecommendationService from '../Services/RecommendationService.js';

// Create a new product
export const createProduct = async (req, res) => {

  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {

  try {
    const products = await Product.find();
    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {

  try {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {

  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get product recommendations based on advanced rule-based logic with AI/ML features
export const getProductRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      limit = 5, 
      minScore = 10,
      includeOutOfStock = false,
      diversityBoost = true,
      explain = false
    } = req.query;

    // Convert query params to proper types
    const options = {
      limit: parseInt(limit),
      minScore: parseInt(minScore),
      includeOutOfStock: includeOutOfStock === 'true',
      diversityBoost: diversityBoost === 'true'
    };

    // Get recommendations using the advanced service
    const result = await RecommendationService.getRecommendations(id, options);

    const response = {
      success: true,
      currentProduct: result.currentProduct,
      recommendations: result.recommendations,
      totalCandidates: result.totalCandidates,
      totalQualified: result.totalQualified,
      filters: {
        limit: options.limit,
        minScore: options.minScore,
        includeOutOfStock: options.includeOutOfStock,
        diversityBoost: options.diversityBoost
      },
      message: result.recommendations.length > 0 
        ? `Found ${result.recommendations.length} recommendations` 
        : 'No qualifying recommendations found'
    };

    // Include algorithm explanation if requested
    if (explain === 'true') {
      response.algorithmExplanation = RecommendationService.getAlgorithmExplanation();
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recommendations: ' + error.message
    });
  }
};

// Get algorithm explanation endpoint
export const getRecommendationAlgorithmInfo = async (req, res) => {
  try {
    const explanation = RecommendationService.getAlgorithmExplanation();
    
    res.status(200).json({
      success: true,
      ...explanation
    });

  } catch (error) {
    console.error('Get algorithm info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting algorithm information: ' + error.message
    });
  }
};