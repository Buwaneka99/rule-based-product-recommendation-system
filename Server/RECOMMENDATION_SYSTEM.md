# Product Recommendation System Implementation

This document explains the implementation of the rule-based product recommendation system as requested in the assignment.

## Overview

The recommendation system combines traditional rule-based logic with AI/ML-inspired features to provide accurate and relevant product suggestions when users view a product.

## Architecture

### 1. Enhanced Product Model
```javascript
// Added fields to support recommendations
{
  // Existing fields...
  tags: [String],        // Keywords for matching
  brand: String,         // Brand information
  inStock: Boolean       // Availability status
}
```

### 2. Recommendation Service (`RecommendationService.js`)
A comprehensive service that implements:
- Rule-based scoring system
- Text similarity analysis (AI/ML approach)
- Diversity algorithms
- Configurable filtering options

### 3. API Endpoints
- `GET /api/products/:id/recommendations` - Get recommendations for a product
- `GET /api/products/recommendations/algorithm` - Get algorithm explanation

## Rule-Based Logic Implementation

### Scoring System (Total: 100 points)

1. **Category Matching (40 points)**
   - Same category: Full 40 points
   - Logic: Direct string comparison (case-insensitive)

2. **Price Similarity (30 points)**
   - Within 30% price range: Full 30 points
   - Within 60% price range: Partial points (gradual decrease)
   - Logic: `Math.abs(price1 - price2) / currentPrice`

3. **Tag/Keyword Matching (25 points max)**
   - 5 points per shared tag
   - Maximum of 25 points
   - Logic: Array intersection with case-insensitive comparison

4. **Brand Matching (15 points)**
   - Same brand: Full 15 points
   - Logic: String comparison (case-insensitive)

5. **Text Similarity - AI/ML Approach (10 points max)**
   - Uses cosine similarity on text vectors
   - Simulates embedding-like behavior
   - Logic: Vector space model with term frequency

## AI/ML Enhancement (Bonus Feature)

### Text Similarity Algorithm
```javascript
// Simulates embeddings using vector space model
calculateTextSimilarity(text1, text2) {
  // 1. Tokenize and create vocabulary
  // 2. Create frequency vectors
  // 3. Calculate cosine similarity
  // 4. Return similarity score (0-1)
}
```

This approach:
- Extracts meaningful keywords from product names and descriptions
- Creates term frequency vectors
- Calculates cosine similarity between vectors
- Provides AI/ML-like text matching without external dependencies

### Features Implemented

#### Core Requirements
- ✅ **Similar Category**: Products in the same category get highest priority
- ✅ **Similar Price Range**: Configurable price tolerance (default 30%)
- ✅ **Shared Tags/Keywords**: Flexible tagging system for product attributes

#### Bonus AI/ML Features
- ✅ **Text Similarity**: Cosine similarity for description matching
- ✅ **Diversity Boost**: Prevents too many similar recommendations
- ✅ **Configurable Algorithms**: Multiple parameters for fine-tuning
- ✅ **Detailed Explanations**: Clear reasoning for each recommendation

## API Usage Examples

### Basic Recommendation Request
```bash
GET /api/products/:productId/recommendations
```

### Advanced Options
```bash
GET /api/products/:productId/recommendations?limit=10&minScore=15&diversityBoost=true&explain=true
```

#### Query Parameters:
- `limit`: Number of recommendations (default: 5)
- `minScore`: Minimum score threshold (default: 10)
- `includeOutOfStock`: Include out-of-stock products (default: false)  
- `diversityBoost`: Apply diversity algorithm (default: true)
- `explain`: Include algorithm explanation (default: false)

### Response Structure
```json
{
  "success": true,
  "currentProduct": {
    "_id": "...",
    "name": "Product Name",
    "category": "Electronics",
    "price": 999,
    "tags": ["tag1", "tag2"],
    "brand": "Brand Name"
  },
  "recommendations": [
    {
      "product": { /* Product details */ },
      "score": 85.5,
      "matchPercentage": 86,
      "reasons": [
        "Same category",
        "Similar price range", 
        "2 shared tags: smartphone, premium",
        "Text similarity: 45%"
      ],
      "details": {
        "categoryMatch": true,
        "priceScore": 30,
        "tagScore": 10,
        "textSimilarity": 0.45
      }
    }
  ],
  "totalCandidates": 50,
  "totalQualified": 12,
  "message": "Found 5 recommendations"
}
```

## Algorithm Explanation

### Logic Flow:
1. **Input Validation**: Verify product exists
2. **Candidate Filtering**: Get all other products (excluding current)
3. **Score Calculation**: Apply all rules to each candidate
4. **Diversity Enhancement**: Apply diversity boost if enabled
5. **Ranking & Filtering**: Sort by score and apply limits
6. **Response Formatting**: Structure response with explanations

### Key Features:
- **Transparent Scoring**: Each recommendation includes detailed reasoning
- **Configurable Parameters**: Adjust algorithm behavior via API parameters
- **Performance Optimized**: Efficient database queries and calculations
- **Extensible Design**: Easy to add new rules or modify existing ones

## Testing the System

### 1. Seed Test Data
```bash
cd Server
node scripts/seedDatabase.js
```

### 2. Test API Endpoints
```bash
# Get basic recommendations
curl "http://localhost:5000/api/products/{productId}/recommendations"

# Get detailed recommendations with explanation
curl "http://localhost:5000/api/products/{productId}/recommendations?explain=true&limit=10"

# Get algorithm information
curl "http://localhost:5000/api/products/recommendations/algorithm"
```

### 3. Test Scenarios
The seed data includes products from different categories (Electronics, Fashion, Books) with various price ranges and tags to test all recommendation rules.

## Implementation Benefits

1. **Rule-Based Foundation**: Reliable, explainable recommendations
2. **AI/ML Enhancement**: Advanced text similarity without external dependencies
3. **Flexible Configuration**: Adaptable to different use cases
4. **Detailed Explanations**: Users understand why products are recommended  
5. **Performance Optimized**: Efficient algorithms suitable for real-time use
6. **Extensible Architecture**: Easy to add new recommendation rules

This implementation successfully fulfills the assignment requirements while providing bonus AI/ML features and comprehensive explanations of the recommendation logic.
