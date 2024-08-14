import { userRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

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

  /**
   * Retrieves the user's profile by userId.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} The user's profile.
   */
  async getProfile(userId) {
    try {
      const userProfile = await userRepository.findUserById(userId);
      if (!userProfile) {
        throw new ApiError(404, 'User not found');
      }
      return userProfile;
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve user profile', err.message);
    }
  }

  /**
   * Partially updates the user's profile.
   * @param {string} userId - The ID of the user.
   * @param {object} profileData - Partial profile data to update.
   * @returns {Promise<object>} The updated user profile.
   * @throws {ApiError} If profile update fails.
   */
  async partialUpdateProfile(userId, profileData) {
    try {
      const existingProfile = await userRepository.findUserById(userId);
      if (!existingProfile) {
        throw new ApiError(404, 'User not found');
      }

      const updatedProfile = { ...existingProfile._doc, ...profileData };
      await userRepository.updateUserById(userId, updatedProfile);

      return updatedProfile;
    } catch (err) {
      throw new ApiError(500, 'Failed to update user profile', err.message);
    }
  }
}

// Export a singleton instance of UserService
export const userService = new UserService();
