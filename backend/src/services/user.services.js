import { ApiError } from '../utils/index.js';
import { userRepository } from '../repository/user.repository.js';

/**
 * Service class for user-related operations.
 */
class UserService {
  /**
   * Verifies the user's role based on contact information.
   * @param {object} contactInfo - User's contact information (email or mobile number).
   * @param {string} role - Role to verify against (e.g., 'ADMIN', 'PARTNER', 'USER').
   * @returns {Promise<object>} User object if role is verified.
   * @throws {ApiError} If user role verification fails.
   */
  async verifyUserRole(contactInfo, role) {
    try {
      // Find user by email or mobile number
      const user = await userRepository.findUserByContactInfo(
        contactInfo.email ? contactInfo.email : contactInfo.mobileNumber,
      );

      // Verify the user's role
      if (user.role !== role) {
        throw new ApiError(403, `Invalid role, user is not a ${role}`);
      }

      return user;
    } catch (err) {
      throw new ApiError(500, 'Failed to verify user role', err.message);
    }
  }

  /**
   * Generates access and refresh tokens for the user.
   * @param {object} user - User object for which tokens are generated.
   * @returns {Promise<object>} Object containing accessToken and refreshToken.
   * @throws {ApiError} If token generation fails.
   */
  async generateAccessAndRefreshToken(user) {
    try {
      // Generate access and refresh tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Save refreshToken to user document
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (err) {
      throw new ApiError(500, 'Failed to generate tokens', err.message);
    }
  }
}

// Export a singleton instance of UserService
export const userService = new UserService();
