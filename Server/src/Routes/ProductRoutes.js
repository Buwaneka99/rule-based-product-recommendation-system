import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductRecommendations,
  getRecommendationAlgorithmInfo
} from "../Controllers/ProductController.js";


const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/recommendations', getProductRecommendations);
router.get('/recommendations/algorithm', getRecommendationAlgorithmInfo);

export default router;