import { userService } from './user.services.js';
import { partnerService } from './partner.services.js';
import { authService } from './auth.services.js';
import { notificationService } from './notification.services.js';
import { otpSessionService } from './otpSession.services.js';
import { avatarService } from './avatar.services.js';
import { productService } from './product.services.js';

/**
 * Centralized exports for all services used in the application.
 * These services handle business logic and operations related to users, partners,
 * authentication, notifications, and OTP sessions.
 */
export {
  userService, // Handles user-related operations
  partnerService, // Handles partner-related operations
  authService, // Handles authentication-related operations
  notificationService, // Handles notification-related operations
  otpSessionService, // Handles OTP session-related operations
  avatarService, // Handles avatar-related operations
  productService, // Handles product-related operations
};
