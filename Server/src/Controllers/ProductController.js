import Product from '../Models/Product.js';

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