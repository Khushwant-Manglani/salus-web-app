import { Product } from '../models/index.js';
import { ApiError } from '../utils/index.js';

class ProductRepository {
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (err) {
      throw new ApiError(500, 'Error while creating the product', err.message);
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) throw new ApiError(404, 'Product not found');
      return product;
    } catch (err) {
      throw new ApiError(500, 'Error while fetching the product', err.message);
    }
  }

  // Repository
  async getAllProducts(filters = {}) {
    try {
      const {
        name,
        minPrice,
        maxPrice,
        minStock,
        maxStock,
        sortBy = 'created_at', // Default sort field
        sortOrder = 'asc', // Default sort order
        ...otherFilters
      } = filters;

      const query = {};

      if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
      if (minPrice || maxPrice) query.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
      if (minStock || maxStock) query.stock = { $gte: minStock || 0, $lte: maxStock || Infinity };

      // Other filters can be added similarly
      // Example: query['someField'] = someValue;

      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const products = await Product.find(query).sort(sort);
      return products;
    } catch (err) {
      throw new ApiError(500, 'Error while fetching products', err.message);
    }
  }

  async updateProduct(productId, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct) throw new ApiError(404, 'Product not found');
      return updatedProduct;
    } catch (err) {
      throw new ApiError(500, 'Error while updating the product', err.message);
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) throw new ApiError(404, 'Product not found');
      return deletedProduct;
    } catch (err) {
      throw new ApiError(500, 'Error while deleting the product', err.message);
    }
  }
}

export const productRepository = new ProductRepository();
