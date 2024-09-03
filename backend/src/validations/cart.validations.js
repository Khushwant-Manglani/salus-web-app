import { z } from 'zod';
import { ApiError } from '../utils/index.js';

class CartValidation {
  /**
   * Schema for validating cart data during creation.
   */
  cartSchema = z.object({
    user_id: z.string().uuid({ message: 'Invalid user ID' }),
    product_id: z.string().uuid({ message: 'Invalid product ID' }),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
    date_of_delivery: z.string().optional(),
    payment_method: z.enum(['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI'], {
      message: 'Invalid payment method',
    }),
    payment_status: z.enum(['UNPAID', 'PAID'], { message: 'Invalid payment status' }),
    total_amount: z.number().min(0, { message: 'Total amount must be a positive number' }),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Schema for validating cart data during updates (allows partial updates).
   */
  updateCartSchema = z.object({
    user_id: z.string().uuid({ message: 'Invalid user ID' }).optional(),
    product_id: z.string().uuid({ message: 'Invalid product ID' }).optional(),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' }).optional(),
    date_of_delivery: z.string().optional(),
    payment_method: z
      .enum(['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI'], {
        message: 'Invalid payment method',
      })
      .optional(),
    payment_status: z.enum(['UNPAID', 'PAID'], { message: 'Invalid payment status' }).optional(),
    total_amount: z
      .number()
      .min(0, { message: 'Total amount must be a positive number' })
      .optional(),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Validate the cart data against cartSchema.
   * @param {object} cartData - The cart data object to validate.
   * @returns {object} validated cart data or throws zod validation error.
   */
  validateCart(cartData) {
    try {
      return this.cartSchema.parse(cartData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validate the cart data for updates against updateCartSchema.
   * @param {object} cartData - The cart data object to validate.
   * @returns {object} validated cart data or throws zod validation error.
   */
  validateUpdateCart(cartData) {
    try {
      return this.updateCartSchema.parse(cartData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

// Export cart validation instance
export const cartValidation = new CartValidation();
