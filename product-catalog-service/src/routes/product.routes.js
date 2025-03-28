// src/routes/product.routes.js
import express from 'express';
import productController from '../controllers/product.controller.js';
import validationMiddleware from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post(
  '/',
  validationMiddleware.validateProductInput,
  productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  validationMiddleware.validateProductInput,
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  productController.deleteProduct
);

/**
 * @route   GET /api/products/categories
 * @desc    Get all unique categories
 * @access  Public
 */
router.get('/categories', productController.getCategories);

export default router;