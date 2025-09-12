import express from 'express';
import cors from 'cors';
import 'dotenv/config';

//Import routes paths
import productRoutes from './Routes/ProductRoutes.js';
import wishlistRoutes from './Routes/WishlistRoutes.js';
import recentlyViewedRoutes from './Routes/RecentlyViewedRoutes.js';
import analyticsRoutes from './Routes/AnalyticsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'AI-powered Product Recommender API',
    version: '1.0.0',
    status: 'Server is running successfully!'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🚀 Server host at http://localhost:${PORT}`);
});





export default app;