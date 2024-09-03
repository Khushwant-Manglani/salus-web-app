import { userRepository } from './user.repository.js';
import { partnerRepository } from './partner.repository.js';
import { otpSessionRepository } from './otpSession.repository.js';
import { productRepository } from './product.repository.js';
import { cartRepository } from './cart.repository.js';
import { orderRepository } from './order.repository.js';

export {
  userRepository, // Handles user data operations
  partnerRepository, // Manages partner-related operations
  otpSessionRepository, // Deals with OTP session management
  productRepository, // Deals with product management
  cartRepository, // Deals with cart management
  orderRepository, // Deals with order management
};
