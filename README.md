# Rule-Based Product Recommendation System

A modern, full-stack e-commerce application with AI-powered product recommendations, built with React TypeScript frontend and Node.js/Express backend with MongoDB.

![Product Recommendation System](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

## 🌟 Features

### 🛍️ Core E-commerce Features
- **Product Catalog Management**: Complete CRUD operations for products
- **Advanced Search & Filtering**: Real-time search with category, brand, price, and stock filters
- **Shopping Cart**: Add to cart functionality with quantity management
- **Wishlist System**: Save favorite products for later
- **Product Quick View**: Preview products without leaving the main page
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🤖 AI-Powered Recommendations
- **Rule-Based Algorithm**: Intelligent product recommendations based on:
  - Category similarity
  - Brand preferences
  - Price range compatibility
  - User behavior patterns
  - Product ratings and popularity
- **Real-time Analytics**: Track product views, purchases, and user interactions
- **Dynamic Recommendations**: Contextual suggestions based on browsing history

### 🎨 Modern UI/UX
- **Clean White Theme**: Professional design with blue accent colors
- **Smooth Animations**: Micro-interactions and transitions
- **Modern Components**: Cards, modals, forms with gradient effects
- **Mobile-First Design**: Responsive layout for all screen sizes
- **Accessibility**: WCAG compliant with proper focus states

### 📊 Analytics & Insights
- **Product Analytics**: View counts, purchase tracking, popularity metrics
- **Recently Viewed**: Track and display user's browsing history
- **Sales Tracking**: Monitor product performance and trends

## 🏗️ Project Structure

```
rule-based-product-recommendation-system/
├── Client/                          # React TypeScript Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── vite.svg
│   ├── src/
│   │   ├── Component/              # React Components
│   │   │   ├── Dashboard.tsx       # Admin Dashboard
│   │   │   ├── HomeHeader.tsx      # Navigation Header
│   │   │   ├── ProductCard.tsx     # Product Display Card
│   │   │   ├── ProductFilter.tsx   # Search & Filter Sidebar
│   │   │   ├── ProductForm.tsx     # Add/Edit Product Form
│   │   │   ├── ProductManagement.tsx # Product CRUD Management
│   │   │   ├── QuickViewModal.tsx  # Product Quick Preview
│   │   │   ├── RecentlyViewed.tsx  # Recently Viewed Products
│   │   │   └── Wishlist.tsx        # Wishlist Management
│   │   ├── CSS/                    # Styling Files
│   │   │   ├── ColorTheme.css      # Design System & Variables
│   │   │   ├── Dashboard.css       # Dashboard Styles
│   │   │   ├── Home.css           # Homepage Styles
│   │   │   ├── HomeHeader.css     # Header Component Styles
│   │   │   ├── ProductCard.css    # Product Card Styles
│   │   │   ├── ProductFilter.css  # Filter Sidebar Styles
│   │   │   ├── ProductForm.css    # Form Component Styles
│   │   │   ├── ProductManagement.css # Management Page Styles
│   │   │   ├── QuickViewModal.css # Modal Component Styles
│   │   │   ├── RecentlyViewed.css # Recently Viewed Styles
│   │   │   └── Wishlist.css       # Wishlist Page Styles
│   │   ├── lib/
│   │   │   └── api.ts             # API Configuration
│   │   ├── Pages/
│   │   │   ├── Dashboard.tsx      # Admin Dashboard Page
│   │   │   └── Home.tsx          # Main Homepage
│   │   ├── services/              # API Service Layer
│   │   │   ├── AnalyticsService.ts    # Analytics API calls
│   │   │   ├── ProductService.ts      # Product API calls
│   │   │   ├── RecentlyViewedService.ts # Recently Viewed API
│   │   │   └── WishlistService.ts     # Wishlist API calls
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript Type Definitions
│   │   ├── App.tsx               # Main App Component
│   │   ├── index.css             # Global Styles
│   │   ├── main.tsx             # App Entry Point
│   │   └── vite-env.d.ts        # Vite Environment Types
│   ├── eslint.config.js         # ESLint Configuration
│   ├── index.html              # HTML Template
│   ├── package.json            # Dependencies & Scripts
│   ├── tsconfig.json           # TypeScript Configuration
│   ├── tsconfig.app.json       # App-specific TS Config
│   ├── tsconfig.node.json      # Node-specific TS Config
│   └── vite.config.ts          # Vite Build Configuration
├── Server/                      # Node.js Express Backend
│   ├── src/
│   │   ├── Config/
│   │   │   └── MongoDBConnection.js   # MongoDB Connection Setup
│   │   ├── Controllers/               # Request Handlers
│   │   │   ├── AnalyticsController.js     # Analytics Logic
│   │   │   ├── ProductController.js       # Product CRUD Logic
│   │   │   ├── RecentlyViewedController.js # Recently Viewed Logic
│   │   │   └── WishlistController.js      # Wishlist Logic
│   │   ├── Models/                    # MongoDB Data Models
│   │   │   ├── Product.js             # Product Schema
│   │   │   ├── RecentlyViewed.js      # Recently Viewed Schema
│   │   │   └── Wishlist.js            # Wishlist Schema
│   │   ├── Routes/                    # API Route Definitions
│   │   │   ├── AnalyticsRoutes.js     # Analytics Endpoints
│   │   │   ├── ProductRoutes.js       # Product Endpoints
│   │   │   ├── RecentlyViewedRoutes.js # Recently Viewed Endpoints
│   │   │   └── WishlistRoutes.js      # Wishlist Endpoints
│   │   ├── Services/                  # Business Logic
│   │   │   └── RecommendationService.js # AI Recommendation Engine
│   │   └── app.js                     # Express App Configuration
│   ├── scripts/
│   │   └── seedDatabase.js            # Database Seeding Script
│   ├── package.json                   # Dependencies & Scripts
│   ├── server.js                      # Server Entry Point
│   └── RECOMMENDATION_SYSTEM.md       # Recommendation Algorithm Docs
└── README.md                          # This File
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0 or higher) - Comes with Node.js
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Buwaneka99/rule-based-product-recommendation-system.git
cd rule-based-product-recommendation-system
```

### 2. Backend Setup

#### Navigate to Server Directory
```bash
cd Server
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the Server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI="mongodb+srv://buwanekawijesinghe1_db_user:483X9QOc3HzMw7qh@rule-based-recommendati.7s7refc.mongodb.net/product-recommendation?retryWrites=true&w=majority&appName=product-recommendation"

# CORS Configuration
CLIENT_URL=http://localhost:5173

# API Configuration
API_VERSION=v1
```

#### Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb/brew/mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Seed the Database (Optional)
Populate the database with sample products:

```bash
npm run seed
```

#### Start the Backend Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Backend API Endpoints

**Products API:**
- `GET /api/products` - Get all products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/brands` - Get all brands

**Recommendations API:**
- `GET /api/products/recommendations` - Get general recommendations
- `GET /api/products/:id/recommendations` - Get product-specific recommendations

**Wishlist API:**
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `GET /api/wishlist/check/:productId` - Check if item is in wishlist

**Recently Viewed API:**
- `GET /api/recently-viewed` - Get recently viewed products
- `POST /api/recently-viewed` - Track product view
- `DELETE /api/recently-viewed` - Clear recently viewed

**Analytics API:**
- `POST /api/analytics/purchase` - Track purchase
- `GET /api/analytics/popular` - Get popular products

### 3. Frontend Setup

#### Navigate to Client Directory
```bash
cd ../Client
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the Client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=SmartStore
VITE_APP_VERSION=1.0.0
```

#### Start the Frontend Development Server
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

#### Frontend Build Commands

**Development:**
```bash
npm run dev          # Start development server
```

**Production:**
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

**Code Quality:**
```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🎯 Usage Guide

### For End Users

#### 1. **Browse Products**
- Visit the homepage to see all available products
- Use the search bar to find specific products
- Apply filters in the sidebar (category, brand, price range, stock status)

#### 2. **Product Interaction**
- Click on any product card to view details
- Use "Quick View" button for fast preview
- Add products to cart or wishlist
- View product ratings and reviews

#### 3. **Wishlist Management**
- Click the heart icon to add/remove from wishlist
- Access your complete wishlist from the navigation
- Remove items individually or clear all

#### 4. **Recently Viewed**
- System automatically tracks viewed products
- Access recently viewed items from navigation
- Clear history when needed

### For Administrators

#### 1. **Access Dashboard**
- Click "Dashboard" in the header navigation
- Manage all products from a centralized interface

#### 2. **Product Management**
- **Add New Product**: Click "Add Product" button
- **Edit Product**: Click edit icon on any product row
- **Delete Product**: Click delete icon (with confirmation)
- **Search Products**: Use the search bar to filter products

#### 3. **Product Form Features**
- **Dynamic Categories**: Select existing or add new categories
- **Dynamic Brands**: Select existing or add new brands
- **Complete Product Info**: Name, description, price, images
- **Advanced Options**: Sale pricing, stock status, special badges
- **Validation**: Real-time form validation with error messages

## 🤖 Recommendation System

### Algorithm Overview

The recommendation system uses a sophisticated rule-based approach that considers multiple factors:

#### 1. **Category Similarity (40% weight)**
- Products from the same category get higher scores
- Related categories are also considered

#### 2. **Brand Preference (25% weight)**
- Products from the same brand get bonus points
- Popular brands get additional weight

#### 3. **Price Range Compatibility (20% weight)**
- Products within similar price ranges
- Considers user's price sensitivity

#### 4. **Ratings & Reviews (10% weight)**
- Higher-rated products get preference
- Products with more reviews are favored

#### 5. **Popularity Metrics (5% weight)**
- Best sellers and trending products
- Recently popular items

### How Recommendations Work

1. **Context Analysis**: System analyzes the current product or user behavior
2. **Candidate Selection**: Identifies potential recommendation candidates
3. **Scoring Algorithm**: Applies weighted scoring based on multiple factors
4. **Ranking**: Sorts products by recommendation score
5. **Filtering**: Removes out-of-stock or inappropriate items
6. **Delivery**: Returns top-scored products as recommendations

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Custom Properties
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **CORS**: Express CORS middleware
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-reload

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Vite**: Fast build tool and dev server
- **Git**: Version control

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.8.0",
  "lucide-react": "^0.400.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd Client
npm run test          # Run unit tests
npm run test:coverage # Run tests with coverage
```

### Backend Testing
```bash
cd Server
npm run test          # Run API tests
npm run test:unit     # Run unit tests
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the application:**
```bash
cd Client
npm run build
```

2. **Deploy the `dist` folder** to your hosting service

3. **Environment Variables:** Set production API URL

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment:**
```bash
cd Server
npm run build  # If you have a build script
```

2. **Set environment variables** in your hosting platform

3. **Configure MongoDB** (MongoDB Atlas recommended for production)

### Docker Deployment

**Dockerfile for Backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### MongoDB Configuration
- **Development**: Local MongoDB instance
- **Production**: MongoDB Atlas or hosted MongoDB

### CORS Configuration
The backend is configured to accept requests from the frontend URL. Update the `CLIENT_URL` in the backend `.env` file.

### API Rate Limiting
For production, consider implementing rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
```
Error: MongoNetworkError: failed to connect to server
```
**Solution**: Ensure MongoDB is running and the connection URL is correct.

#### 2. **CORS Error**
```
Access to fetch blocked by CORS policy
```
**Solution**: Check that `CLIENT_URL` in backend `.env` matches your frontend URL.

#### 3. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using the port or change the port in `.env`.

#### 4. **Build Errors**
```
Module not found: Error: Can't resolve...
```
**Solution**: Run `npm install` and ensure all dependencies are installed.

### Debug Mode

#### Backend Debug:
```bash
DEBUG=* npm start
```

#### Frontend Debug:
Enable React Developer Tools browser extension.

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new frontend code
- Follow ESLint rules for code formatting
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design for all components

### Testing Requirements

- Write unit tests for new components
- Test API endpoints with sample data
- Verify responsive design on multiple devices
- Test with different data scenarios

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Buwaneka99** - *Initial work* - [GitHub Profile](https://github.com/Buwaneka99)

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB team for the robust database solution
- Lucide React for beautiful icons
- Vite team for the fast build tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/Buwaneka99/rule-based-product-recommendation-system/issues)
3. Create a new issue with detailed information
4. Contact the maintainer

---

**Happy Coding! 🚀**

Made with ❤️ by [Buwaneka99](https://github.com/Buwaneka99)
