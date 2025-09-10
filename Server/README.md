# AI-Powered Product Recommender Backend

🚀 **Rule-based Product Recommendation System** - Backend API

## Project Overview

This is the backend server for an AI-powered product recommendation system built as part of an internship assignment. The system provides CRUD operations for products and implements a rule-based recommendation engine.

## Features

- ✅ RESTful API with Express.js
- ✅ Product CRUD operations
- ✅ Rule-based recommendation engine
- ✅ Clean code architecture
- ✅ Environment configuration
- ✅ Error handling & validation

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (upcoming)
- **Development**: Nodemon for auto-reload
- **Environment**: dotenv for configuration

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Server
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (to be implemented)

## API Endpoints

### Health Check
- `GET /` - Welcome message and API info
- `GET /health` - Server health status

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Recommendations (Coming Soon)
- `GET /api/recommendations/:productId` - Get recommendations for a product

## Project Structure

```
Server/
├── src/
│   └── app.js              # Main Express application
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Development Status

- [x] Initial Express.js setup
- [x] Basic server configuration
- [x] Environment setup
- [x] CORS and middleware configuration
- [ ] Database connection (MongoDB)
- [ ] Product models and routes
- [ ] Recommendation engine
- [ ] Authentication
- [ ] Testing
- [ ] API documentation

## Contributing

This is an internship assignment project. Feedback and suggestions are welcome!

## License

MIT License - see LICENSE file for details
