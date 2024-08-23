import { productRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

class ProductService {
  async createProduct(productData) {
    try {
      return await productRepository.createProduct(productData);
    } catch (err) {
      throw new ApiError(500, 'Failed to create product', err.message);
    }
  }

  async getProductById(productId) {
    if (!productId || typeof productId !== 'string') {
      throw new ApiError(400, 'Invalid product ID');
    }

    try {
      return await productRepository.getProductById(productId);
    } catch (err) {
      throw new ApiError(500, 'Failed to get product by id', err.message);
    }
  }

  async getAllProducts(filters = {}) {
    // Apply filters and sorting logic here if needed
    try {
      return await productRepository.getAllProducts(filters);
    } catch (err) {
      throw new ApiError(500, 'Failed to get all products', err.message);
    }
  }

  async updateProduct(productId, productData) {
    if (!productId || typeof productId !== 'string') {
      throw new ApiError(400, 'Invalid product ID');
    }

    try {
      return await productRepository.updateProduct(productId, productData);
    } catch (err) {
      throw new ApiError(500, 'Failed to update product', err.message);
    }
  }

  async deleteProduct(productId) {
    if (!productId || typeof productId !== 'string') {
      throw new ApiError(400, 'Invalid product ID');
    }

    try {
      return await productRepository.deleteProduct(productId);
    } catch (err) {
      throw new ApiError(500, 'Failed to delete product', err.message);
    }
  }
}

export const productService = new ProductService();
