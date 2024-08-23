import { productService } from '../services/index.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { productValidation } from '../validations/index.js';

class ProductController {
  /**
   * Create a new product.
   * @param {object} req - Express request object containing product data in req.body.
   * @param {object} res - Express response object for sending the response.
   * @return {Promise<void>} - Promise resolving with success message and created product data.
   */
  createProduct = asyncHandler(async (req, res) => {
    try {
      // Validate the product data
      const validatedProductData = productValidation.validateProduct(req.body);

      // Create the product using the validated data
      const createdProduct = await productService.createProduct(validatedProductData);

      // Send response with success message and created product data
      return res
        .status(201)
        .json(new ApiResponse(201, createdProduct, 'Product created successfully'));
    } catch (err) {
      // Handle errors
      throw new ApiError(500, 'Error occurred while creating the product', err.message);
    }
  });

  /**
   * Get a product by ID.
   * @param {object} req - Express request object containing the product ID in req.params.
   * @param {object} res - Express response object for sending the response.
   * @return {Promise<void>} - Promise resolving with the product data.
   */
  getProductById = asyncHandler(async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productService.getProductById(productId);

      // Send response with the product data
      return res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
    } catch (err) {
      // Handle errors
      throw new ApiError(500, 'Error occurred while retrieving the product', err.message);
    }
  });

  /**
   * Get all products with optional filters.
   * @param {object} req - Express request object containing query filters in req.query.
   * @param {object} res - Express response object for sending the response.
   * @return {Promise<void>} - Promise resolving with the list of products.
   */
  getAllProducts = asyncHandler(async (req, res) => {
    try {
      const filters = req.query;
      const products = await productService.getAllProducts(filters);

      // Send response with the list of products
      return res
        .status(200)
        .json(new ApiResponse(200, products, 'Products retrieved successfully'));
    } catch (err) {
      // Handle errors
      throw new ApiError(500, 'Error occurred while retrieving products', err.message);
    }
  });

  /**
   * Update a product by ID.
   * @param {object} req - Express request object containing the product ID in req.params and update data in req.body.
   * @param {object} res - Express response object for sending the response.
   * @return {Promise<void>} - Promise resolving with success message and updated product data.
   */
  updateProduct = asyncHandler(async (req, res) => {
    try {
      const productId = req.params.id;
      const productData = req.body;

      // Validate the updated product data
      const validatedProductData = productValidation.validateUpdateProduct(productData);

      // Update the product using the validated data
      const updatedProduct = await productService.updateProduct(productId, validatedProductData);

      // Send response with success message and updated product data
      return res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
    } catch (err) {
      // Handle errors
      throw new ApiError(500, 'Error occurred while updating the product', err.message);
    }
  });

  /**
   * Delete a product by ID.
   * @param {object} req - Express request object containing the product ID in req.params.
   * @param {object} res - Express response object for sending the response.
   * @return {Promise<void>} - Promise resolving with success message.
   */
  deleteProduct = asyncHandler(async (req, res) => {
    try {
      const productId = req.params.id;
      await productService.deleteProduct(productId);

      // Send response with success message
      return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
    } catch (err) {
      // Handle errors
      throw new ApiError(500, 'Error occurred while deleting the product', err.message);
    }
  });
}

export const productController = new ProductController();
