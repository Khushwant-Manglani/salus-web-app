import { z } from 'zod';
import { ApiError } from '../utils/index.js';

class OrderValidation {
  /**
   * Schema for validating order data during creation.
   */
  orderSchema = z.object({
    user_id: z.string().uuid({ message: 'Invalid user ID' }),
    cart_id: z.string().uuid({ message: 'Invalid cart ID' }),
    status: z.enum(
      [
        'ORDER_PLACED',
        'ORDER_ACCEPTED',
        'ORDER_DISPATCHED',
        'ORDER_SHIPPED',
        'SENT_FOR_DELIVERY',
        'ORDER_DELIVERED',
      ],
      { message: 'Invalid order status' },
    ),
    payment_status: z.enum(['UNPAID', 'PAID'], { message: 'Invalid payment status' }),
    total_amount: z.number().min(0, { message: 'Total amount must be a positive number' }),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Schema for validating order data during updates (allows partial updates).
   */
  updateOrderSchema = z.object({
    user_id: z.string().uuid({ message: 'Invalid user ID' }).optional(),
    cart_id: z.string().uuid({ message: 'Invalid cart ID' }).optional(),
    status: z
      .enum(
        [
          'ORDER_PLACED',
          'ORDER_ACCEPTED',
          'ORDER_DISPATCHED',
          'ORDER_SHIPPED',
          'SENT_FOR_DELIVERY',
          'ORDER_DELIVERED',
        ],
        { message: 'Invalid order status' },
      )
      .optional(),
    payment_status: z.enum(['UNPAID', 'PAID'], { message: 'Invalid payment status' }).optional(),
    total_amount: z
      .number()
      .min(0, { message: 'Total amount must be a positive number' })
      .optional(),
    updated_at: z.date().default(new Date()),
  });

  /**
   * Validate the order data against orderSchema.
   * @param {object} orderData - The order data object to validate.
   * @returns {object} validated order data or throws zod validation error.
   */
  validateOrder(orderData) {
    try {
      return this.orderSchema.parse(orderData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validate the order data for updates against updateOrderSchema.
   * @param {object} orderData - The order data object to validate.
   * @returns {object} validated order data or throws zod validation error.
   */
  validateUpdateOrder(orderData) {
    try {
      return this.updateOrderSchema.parse(orderData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

// Export order validation instance
export const orderValidation = new OrderValidation();
