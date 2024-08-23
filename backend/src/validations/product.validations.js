import { z } from 'zod';
import { ApiError } from '../utils/index.js';

class ProductValidation {
  /**
   * Schema for validating product data during creation.
   */
  productSchema = z.object({
    partner_id: z.string().uuid({ message: 'Invalid partner ID' }),
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    image: z.string().url({ message: 'Invalid URL for product image' }).optional(),
    price: z
      .number()
      .min(0.01, { message: 'Price must be greater than zero' })
      .max(99999999.99, { message: 'Price exceeds maximum value' }),
    analysis: z.string().optional(),
    stock: z.number().int().min(0, { message: 'Stock must be a non-negative integer' }),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Schema for validating product data during update.
   * Allow fields to be optional for partial updates.
   */
  updateProductSchema = z.object({
    partner_id: z.string().uuid({ message: 'Invalid partner ID' }).optional(),
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    description: z.string().optional(),
    image: z.string().url({ message: 'Invalid URL for product image' }).optional(),
    price: z
      .number()
      .min(0.01, { message: 'Price must be greater than zero' })
      .max(99999999.99, { message: 'Price exceeds maximum value' })
      .optional(),
    analysis: z.string().optional(),
    stock: z.number().int().min(0, { message: 'Stock must be a non-negative integer' }).optional(),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Validate the product data against productSchema.
   * @param {object} productData - The product data object to validate.
   * @returns {object} validated product data or throws zod validation error.
   */
  validateProduct(productData) {
    try {
      return this.productSchema.parse(productData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validate the product updated data against updateProductSchema.
   * Allow partial update.
   * @param {object} productData - The product data object to validate.
   * @returns {object} validated product data or throws zod validation error.
   */
  validateUpdateProduct(productData) {
    try {
      return this.updateProductSchema.parse(productData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

// create the productValidation object and export it for usage
export const productValidation = new ProductValidation();
