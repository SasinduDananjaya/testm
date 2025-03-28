// src/services/product.service.js
import Product from '../models/product.model.js';
import logger from '../utils/logger.js';

class ProductService {
  /**
   * Get all products with filtering, sorting, and pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} sortOptions - Sort options
   * @param {Number} page - Page number
   * @param {Number} limit - Results per page
   * @returns {Object} Products and total count
   */
  static async getAllProducts(filter = {}, sortOptions = { createdAt: -1 }, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      // Execute queries in parallel
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter)
      ]);
      
      return { products, total };
    } catch (error) {
      logger.error('Error in getAllProducts service', { error, filter, sortOptions, page, limit });
      throw error;
    }
  }
  
  /**
   * Get a single product by ID
   * @param {String} id - Product ID
   * @returns {Object} Product document
   */
  static async getProductById(id) {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      logger.error('Error in getProductById service', { error, id });
      throw error;
    }
  }
  
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Object} Created product
   */
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      logger.error('Error in createProduct service', { error, productData });
      throw error;
    }
  }
  
  /**
   * Update an existing product
   * @param {String} id - Product ID
   * @param {Object} updateData - Updated product data
   * @returns {Object} Updated product
   */
  static async updateProduct(id, updateData) {
    try {
      // Find and update with validation
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      return product;
    } catch (error) {
      logger.error('Error in updateProduct service', { error, id, updateData });
      throw error;
    }
  }
  
  /**
   * Delete a product
   * @param {String} id - Product ID
   * @returns {Boolean} Success indicator
   */
  static async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error in deleteProduct service', { error, id });
      throw error;
    }
  }
  
  /**
   * Get all unique product categories
   * @returns {Array} List of categories
   */
  static async getCategories() {
    try {
      return await Product.distinct('category');
    } catch (error) {
      logger.error('Error in getCategories service', { error });
      throw error;
    }
  }
}

export default ProductService;