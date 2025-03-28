// src/controllers/product.controller.js
import ProductService from '../services/product.service.js';
import logger from '../utils/logger.js';

// Get all products with filtering and pagination
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, inStock, sort, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    
    // Add text search if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Process sort parameter (e.g., "price:asc,name:desc")
    const sortOptions = {};
    if (sort) {
      const sortParams = sort.split(',');
      sortParams.forEach(param => {
        const [field, order] = param.split(':');
        sortOptions[field] = order === 'desc' ? -1 : 1;
      });
    } else {
      // Default sort by newest first
      sortOptions.createdAt = -1;
    }
    
    const result = await ProductService.getAllProducts(
      filter,
      sortOptions,
      Number(page),
      Number(limit)
    );
    
    res.status(200).json({
      status: 'success',
      results: result.products.length,
      pagination: {
        totalProducts: result.total,
        totalPages: Math.ceil(result.total / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      },
      data: {
        products: result.products
      }
    });
  } catch (error) {
    logger.error('Error in getAllProducts', { error });
    next(error);
  }
};

// Get a single product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    logger.error('Error in getProductById', { error, productId: req.params.id });
    next(error);
  }
};

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    logger.error('Error in createProduct', { error, payload: req.body });
    next(error);
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    logger.error('Error in updateProduct', { error, productId: req.params.id, payload: req.body });
    next(error);
  }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Error in deleteProduct', { error, productId: req.params.id });
    next(error);
  }
};

// Get all unique categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await ProductService.getCategories();
    
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    logger.error('Error in getCategories', { error });
    next(error);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};