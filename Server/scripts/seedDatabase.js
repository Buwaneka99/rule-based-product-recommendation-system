// Test script to populate the database with sample products for testing recommendations
import mongoose from 'mongoose';
import Product from '../src/Models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/productdb'; // Update with your MongoDB URI

// Sample products with rich data for testing recommendations
const sampleProducts = [
  {
    name: "iPhone 14 Pro",
    price: 999,
    category: "Electronics",
    description: "Latest iPhone with advanced camera system, A16 Bionic chip, and Dynamic Island",
    image: "iphone14pro.jpg",
    tags: ["smartphone", "apple", "ios", "camera", "5g", "premium"],
    brand: "Apple",
    inStock: true
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    price: 1199,
    category: "Electronics", 
    description: "Flagship Android phone with S Pen, amazing cameras, and powerful performance",
    image: "galaxy-s23-ultra.jpg",
    tags: ["smartphone", "android", "samsung", "camera", "5g", "premium", "s-pen"],
    brand: "Samsung",
    inStock: true
  },
  {
    name: "Google Pixel 7 Pro",
    price: 899,
    category: "Electronics",
    description: "Pure Android experience with exceptional computational photography",
    image: "pixel7pro.jpg", 
    tags: ["smartphone", "google", "android", "camera", "ai", "photography"],
    brand: "Google",
    inStock: true
  },
  {
    name: "iPhone 13",
    price: 699,
    category: "Electronics",
    description: "Previous generation iPhone with great performance and camera quality",
    image: "iphone13.jpg",
    tags: ["smartphone", "apple", "ios", "camera", "affordable"],
    brand: "Apple",
    inStock: true
  },
  {
    name: "MacBook Pro 14-inch",
    price: 1999,
    category: "Electronics",
    description: "Professional laptop with M2 Pro chip, stunning display, and long battery life",
    image: "macbook-pro-14.jpg",
    tags: ["laptop", "apple", "m2", "professional", "creative", "premium"],
    brand: "Apple", 
    inStock: true
  },
  {
    name: "Dell XPS 13",
    price: 1299,
    category: "Electronics",
    description: "Ultra-portable laptop with Intel processors and premium build quality",
    image: "dell-xps-13.jpg",
    tags: ["laptop", "dell", "portable", "business", "premium", "intel"],
    brand: "Dell",
    inStock: true
  },
  {
    name: "iPad Air 5th Gen",
    price: 599,
    category: "Electronics", 
    description: "Versatile tablet with M1 chip, perfect for creativity and productivity",
    image: "ipad-air.jpg",
    tags: ["tablet", "apple", "m1", "creative", "portable", "ios"],
    brand: "Apple",
    inStock: true
  },
  {
    name: "Nike Air Max 270",
    price: 150,
    category: "Fashion",
    description: "Comfortable running shoes with maximum air cushioning and modern style",
    image: "nike-air-max-270.jpg",
    tags: ["shoes", "running", "comfortable", "casual", "sports", "lifestyle"],
    brand: "Nike",
    inStock: true
  },
  {
    name: "Adidas Ultraboost 22",
    price: 180,
    category: "Fashion",
    description: "Premium running shoes with responsive cushioning and sustainable materials", 
    image: "adidas-ultraboost.jpg",
    tags: ["shoes", "running", "premium", "comfortable", "sports", "sustainable"],
    brand: "Adidas",
    inStock: true
  },
  {
    name: "Levi's 501 Original Jeans",
    price: 89,
    category: "Fashion",
    description: "Classic straight-fit jeans made with traditional craftsmanship and quality denim",
    image: "levis-501.jpg", 
    tags: ["jeans", "classic", "denim", "casual", "timeless", "american"],
    brand: "Levi's",
    inStock: true
  },
  {
    name: "Patagonia Down Jacket",
    price: 299,
    category: "Fashion",
    description: "Warm and lightweight jacket perfect for outdoor adventures and cold weather",
    image: "patagonia-down.jpg",
    tags: ["jacket", "outdoor", "warm", "lightweight", "adventure", "sustainable"],
    brand: "Patagonia", 
    inStock: true
  },
  {
    name: "The Great Gatsby",
    price: 12,
    category: "Books",
    description: "Classic American novel about the Jazz Age, love, and the American Dream",
    image: "great-gatsby.jpg",
    tags: ["fiction", "classic", "american", "literature", "romance", "20s"],
    brand: "Scribner",
    inStock: true
  },
  {
    name: "To Kill a Mockingbird", 
    price: 14,
    category: "Books",
    description: "Powerful story about racial injustice and moral growth in the American South",
    image: "mockingbird.jpg",
    tags: ["fiction", "classic", "american", "social-justice", "literature", "pulitzer"],
    brand: "Harper Lee",
    inStock: true
  },
  {
    name: "1984",
    price: 13,
    category: "Books", 
    description: "Dystopian novel about totalitarianism, surveillance, and the power of language",
    image: "1984.jpg",
    tags: ["fiction", "dystopian", "classic", "political", "thought-provoking", "orwell"],
    brand: "George Orwell",
    inStock: true
  },
  {
    name: "Dune",
    price: 16,
    category: "Books",
    description: "Epic science fiction novel set on a desert planet with political intrigue",
    image: "dune.jpg", 
    tags: ["sci-fi", "epic", "adventure", "politics", "ecology", "space"],
    brand: "Frank Herbert",
    inStock: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} sample products`);

    // Display some statistics
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    const brands = [...new Set(sampleProducts.map(p => p.brand))];
    
    console.log('\nDatabase Statistics:');
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Brands: ${brands.join(', ')}`);
    console.log(`Price range: $${Math.min(...sampleProducts.map(p => p.price))} - $${Math.max(...sampleProducts.map(p => p.price))}`);

    console.log('\nSample products created successfully!');
    console.log('You can now test the recommendation system with these product IDs:');
    
    insertedProducts.forEach((product, index) => {
      if (index < 5) { // Show first 5 for testing
        console.log(`- ${product.name}: ${product._id}`);
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
