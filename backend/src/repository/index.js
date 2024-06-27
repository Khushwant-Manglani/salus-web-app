import { userRepository } from './user.repository.js';
import { partnerRepository } from './partner.repository.js';
import { otpSessionRepository } from './otpSession.repository.js';

export {
  userRepository, // Handles user data operations
  partnerRepository, // Manages partner-related operations
  otpSessionRepository, // Deals with OTP session management
};
