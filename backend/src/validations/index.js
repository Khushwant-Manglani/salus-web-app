import { userValidation } from './user.validations.js';
import { partnerValidation } from './partner.validations.js';
import { authValidation } from './auth.validations.js';
import { productValidation } from './product.validations.js';
import { cartValidation } from './cart.validations.js';
import { orderValidation } from './order.validations.js';

/**
 * Module exporting validation instances for user, partner, and authentication operations.
 * Provides centralized access to validation schemas across the application.
 */
export {
  userValidation,
  partnerValidation,
  authValidation,
  productValidation,
  cartValidation,
  orderValidation,
};
