// Advanced Recommendation Service with AI/ML-like features
import Product from '../Models/Product.js';

/**
 * Rule-based Recommendation Engine
 * 
 * This service implements multiple recommendation strategies:
 * 1. Rule-based matching (category, price, tags, brand)
 * 2. Text similarity analysis (simulating embeddings)
 * 3. Hybrid scoring system
 * 
 * Scoring System (Total: 100 points):
 * - Same category: 40 points
 * - Price similarity: 30 points  
 * - Shared tags: 25 points max
 * - Same brand: 15 points
 * - Text similarity: 10 points max
 */

class RecommendationService {
  
  /**
   * Calculate cosine similarity between two text vectors
   * This simulates a simple text embedding approach
   */
  static calculateTextSimilarity(text1, text2) {
    // Convert texts to lowercase and split into words
    const words1 = text1.toLowerCase().match(/\w+/g) || [];
    const words2 = text2.toLowerCase().match(/\w+/g) || [];
    
    // Create a combined vocabulary
    const vocabulary = [...new Set([...words1, ...words2])];
    
    // Create frequency vectors
    const vector1 = vocabulary.map(word => words1.filter(w => w === word).length);
    const vector2 = vocabulary.map(word => words2.filter(w => w === word).length);
    
    // Calculate cosine similarity
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Extract meaningful keywords from product name and description
   */
  static extractKeywords(product) {
    const text = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'will', 'would', 'should', 'could'];
    
    return text.match(/\w+/g)
      ?.filter(word => word.length > 2 && !stopWords.includes(word))
      ?.slice(0, 20) || []; // Limit to top 20 keywords
  }

  /**
   * Calculate comprehensive recommendation score
   */
  static calculateRecommendationScore(currentProduct, candidateProduct) {
    let score = 0;
    const reasons = [];
    const details = {};

    // Rule 1: Category matching (40 points)
    if (candidateProduct.category.toLowerCase() === currentProduct.category.toLowerCase()) {
      score += 40;
      reasons.push('Same category');
      details.categoryMatch = true;
    } else {
      details.categoryMatch = false;
    }

    // Rule 2: Price similarity (30 points)
    const priceRange = currentProduct.price * 0.3; // 30% tolerance
    const priceDifference = Math.abs(candidateProduct.price - currentProduct.price);
    const priceRatio = priceDifference / currentProduct.price;
    
    if (priceDifference <= priceRange) {
      score += 30;
      reasons.push('Similar price range');
      details.priceScore = 30;
    } else if (priceDifference <= priceRange * 2) {
      const partialScore = Math.max(0, 20 - (priceRatio * 30));
      score += partialScore;
      reasons.push('Moderately similar price');
      details.priceScore = partialScore;
    } else {
      details.priceScore = 0;
    }

    // Rule 3: Tag/keyword similarity (25 points)
    const currentTags = currentProduct.tags.map(tag => tag.toLowerCase());
    const candidateTags = candidateProduct.tags.map(tag => tag.toLowerCase());
    const sharedTags = candidateTags.filter(tag => currentTags.includes(tag));
    
    if (sharedTags.length > 0) {
      const tagScore = Math.min(25, sharedTags.length * 5);
      score += tagScore;
      reasons.push(`${sharedTags.length} shared tag${sharedTags.length > 1 ? 's' : ''}: ${sharedTags.join(', ')}`);
      details.sharedTags = sharedTags;
      details.tagScore = tagScore;
    } else {
      details.tagScore = 0;
    }

    // Rule 4: Brand similarity (15 points)
    if (candidateProduct.brand && currentProduct.brand && 
        candidateProduct.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
      score += 15;
      reasons.push('Same brand');
      details.brandMatch = true;
    } else {
      details.brandMatch = false;
    }

    // Rule 5: Text similarity using AI/ML-like approach (10 points)
    const currentText = `${currentProduct.name} ${currentProduct.description}`;
    const candidateText = `${candidateProduct.name} ${candidateProduct.description}`;
    const textSimilarity = this.calculateTextSimilarity(currentText, candidateText);
    
    if (textSimilarity > 0.1) { // Threshold for meaningful similarity
      const textScore = Math.min(10, textSimilarity * 20);
      score += textScore;
      reasons.push(`Text similarity: ${Math.round(textSimilarity * 100)}%`);
      details.textSimilarity = textSimilarity;
      details.textScore = textScore;
    } else {
      details.textScore = 0;
    }

    return {
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      reasons,
      details,
      matchPercentage: Math.min(100, Math.round(score))
    };
  }

  /**
   * Get product recommendations with advanced filtering
   */
  static async getRecommendations(productId, options = {}) {
    const {
      limit = 5,
      minScore = 10,
      includeOutOfStock = false,
      diversityBoost = true
    } = options;

    try {
      // Get the current product
      const currentProduct = await Product.findById(productId);
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Get all candidate products
      const query = {
        _id: { $ne: productId }
      };
      
      if (!includeOutOfStock) {
        query.inStock = true;
      }

      const candidateProducts = await Product.find(query);

      if (candidateProducts.length === 0) {
        return {
          recommendations: [],
          totalCandidates: 0,
          currentProduct
        };
      }

      // Calculate scores for all candidates
      const scoredRecommendations = candidateProducts.map(product => {
        const scoreData = this.calculateRecommendationScore(currentProduct, product);
        
        return {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            tags: product.tags,
            brand: product.brand,
            inStock: product.inStock
          },
          ...scoreData
        };
      });

      // Filter by minimum score and sort
      let filteredRecommendations = scoredRecommendations
        .filter(rec => rec.score >= minScore)
        .sort((a, b) => b.score - a.score);

      // Apply diversity boost if enabled
      if (diversityBoost && filteredRecommendations.length > limit) {
        filteredRecommendations = this.applyDiversityBoost(filteredRecommendations, currentProduct);
      }

      // Limit results
      const finalRecommendations = filteredRecommendations.slice(0, limit);

      return {
        recommendations: finalRecommendations,
        totalCandidates: candidateProducts.length,
        totalQualified: scoredRecommendations.filter(rec => rec.score >= minScore).length,
        currentProduct: {
          _id: currentProduct._id,
          name: currentProduct.name,
          category: currentProduct.category,
          price: currentProduct.price,
          tags: currentProduct.tags,
          brand: currentProduct.brand
        }
      };

    } catch (error) {
      throw new Error(`Recommendation service error: ${error.message}`);
    }
  }

  /**
   * Apply diversity boost to avoid too many similar products
   */
  static applyDiversityBoost(recommendations, currentProduct) {
    const diverseRecommendations = [];
    const usedCategories = new Set([currentProduct.category.toLowerCase()]);
    const usedBrands = new Set();
    
    // First, add the highest scoring recommendation
    if (recommendations.length > 0) {
      diverseRecommendations.push(recommendations[0]);
      usedCategories.add(recommendations[0].product.category.toLowerCase());
      if (recommendations[0].product.brand) {
        usedBrands.add(recommendations[0].product.brand.toLowerCase());
      }
    }

    // Then, prioritize diversity while maintaining quality
    for (let i = 1; i < recommendations.length && diverseRecommendations.length < 10; i++) {
      const rec = recommendations[i];
      const category = rec.product.category.toLowerCase();
      const brand = rec.product.brand?.toLowerCase();

      // Calculate diversity bonus
      let diversityBonus = 0;
      if (!usedCategories.has(category)) diversityBonus += 5;
      if (brand && !usedBrands.has(brand)) diversityBonus += 3;

      // Apply diversity bonus to score
      rec.score += diversityBonus;
      if (diversityBonus > 0) {
        rec.reasons.push(`Diversity bonus: +${diversityBonus}`);
      }

      diverseRecommendations.push(rec);
      usedCategories.add(category);
      if (brand) usedBrands.add(brand);
    }

    // Re-sort with diversity bonuses applied
    return diverseRecommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Get explanation of the recommendation algorithm
   */
  static getAlgorithmExplanation() {
    return {
      title: "Rule-Based Product Recommendation System with AI/ML Enhancement",
      description: "This system combines traditional rule-based logic with AI/ML-inspired text similarity analysis.",
      scoringSystem: {
        maxScore: 100,
        rules: [
          {
            rule: "Category Matching",
            points: 40,
            description: "Products in the same category receive the highest score"
          },
          {
            rule: "Price Similarity",
            points: 30,
            description: "Products within 30% price range get full points, with gradual decrease for wider ranges"
          },
          {
            rule: "Tag/Keyword Matching",
            points: 25,
            description: "Shared tags contribute 5 points each, up to maximum of 25 points"
          },
          {
            rule: "Brand Matching",
            points: 15,
            description: "Products from the same brand receive bonus points"
          },
          {
            rule: "Text Similarity (AI/ML)",
            points: 10,
            description: "Cosine similarity between product descriptions using vector space model"
          }
        ]
      },
      features: [
        "Diversity boost to prevent too many similar recommendations",
        "Configurable minimum score threshold",
        "Text similarity using vector space model (simulating embeddings)",
        "Detailed reasoning for each recommendation",
        "Support for out-of-stock filtering"
      ]
    };
  }
}

export default RecommendationService;
