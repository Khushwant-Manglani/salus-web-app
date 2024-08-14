import { partnerRepository, userRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

/**
  Service class for handling Partner operations.
*/
class PartnerService {
  /**
   * Retrieves the combined user and partner profile by userId.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} The combined profile data.
   * @throws {ApiError} If user or partner profile retrieval fails.
   */
  async getProfile(userId) {
    try {
      const user = await userRepository.findUserById(userId);
      const partner = await partnerRepository.findByUserId(userId);

      if (!user || !partner) {
        throw new ApiError(404, 'User or Partner not found');
      }

      return { ...user.toObject(), ...partner.toObject() };
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve profiles', err.message);
    }
  }

  /**
   * Partially updates the user and partner profiles.
   * @param {string} userId - The ID of the user.
   * @param {object} userProfileData - Partial data to update in the user profile.
   * @param {object} partnerProfileData - Partial data to update in the partner profile.
   * @returns {Promise<object>} The updated combined profile data.
   * @throws {ApiError} If profile update fails.
   */
  async partialUpdateProfile(userId, userProfileData, partnerProfileData) {
    try {
      const existingUserProfile = await userRepository.findUserById(userId);
      const existingPartnerProfile = await partnerRepository.findByUserId(userId);

      if (!existingUserProfile || !existingPartnerProfile) {
        throw new ApiError(404, 'User or Partner not found');
      }

      const updatedUserProfile = { ...existingUserProfile._doc, ...userProfileData };
      const updatedPartnerProfile = { ...existingPartnerProfile._doc, ...partnerProfileData };

      const updatedUser = await userRepository.updateUserById(userId, updatedUserProfile);
      const updatedPartner = await partnerRepository.updateByUserId(userId, updatedPartnerProfile);

      return { ...updatedUser.toObject(), ...updatedPartner.toObject() };
    } catch (err) {
      throw new ApiError(500, 'Failed to update profiles', err.message);
    }
  }
}

// create an PartnerService instance and export it
export const partnerService = new PartnerService();
