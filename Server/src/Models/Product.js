import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  price: { 
    type: Number, 
    required: true 
  },

  category: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },
  
  imageUrl: { 
    type: String, 
    required: false
  },

  tags: {
    type: [String],
    default: []
  },

  brand: {
    type: String,
    required: false
  },

  inStock: {
    type: Boolean,
    default: true
  },

  // New innovative features
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  salesCount: {
    type: Number,
    default: 0
  },

  isEcoFriendly: {
    type: Boolean,
    default: false
  },

  isBestSeller: {
    type: Boolean,
    default: false
  },

  isOnSale: {
    type: Boolean,
    default: false
  },

  salePrice: {
    type: Number,
    required: false
  },

  saleEndDate: {
    type: Date,
    required: false
  }

}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
