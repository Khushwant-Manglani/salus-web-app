import { userValidation, partnerValidation } from '../validations/index.js';
import { userService, partnerService } from '../services/index.js';
import { partnerRepository, userRepository } from '../repository/index.js';
import { avatarService } from '../services/index.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';

/**
 * ProfileController manages user, partner, and admin profile operations.
 * It includes methods for retrieving, updating, and deleting profiles,
 * as well as handling avatar updates.
 * deleting the account
 */

class ProfileController {
  // User Profile Management

  /**
   * Retrieves the profile of the authenticated user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to retrieve the profile.
   */
  getUserProfile = asyncHandler(async (req, res) => {
    try {
      const profile = await userService.getProfile(req.user._id);
      res.status(200).json(new ApiResponse(200, profile, 'User profile retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurr while retrieve user profile', err.message);
    }
  });

  /**
   * Partially updates the profile of the authenticated user.
   * @param {Object} req - The request object containing user profile data.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to update the profile.
   */
  partialUpdateUserProfile = asyncHandler(async (req, res) => {
    const validatedUserProfileData = userValidation.validateUpdateUser(req.body);
    try {
      const updatedProfile = await userService.partialUpdateProfile(
        req.user._id,
        validatedUserProfileData,
      );
      res
        .status(200)
        .json(new ApiResponse(200, updatedProfile, 'User profile updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurr while update user profile', err.message);
    }
  });

  // Partner Profile Management

  /**
   * Retrieves the profile of the authenticated partner.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to retrieve the profile.
   */
  getPartnerProfile = asyncHandler(async (req, res) => {
    try {
      const profile = await partnerService.getProfile(req.user._id);
      res.status(200).json(new ApiResponse(200, profile, 'Partner profile retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieve partner profile', err.message);
    }
  });

  /**
   * Partially updates the profile of the authenticated partner.
   * @param {Object} req - The request object containing partner and user profile data.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to update the profile.
   */
  partialUpdatePartnerProfile = asyncHandler(async (req, res) => {
    // Destructure and separate user and partner details from req.body
    const { name, email, mobileNumber, pincode, ...partnerProfileDetails } = req.body;
    const userProfileDetails = { name, email, mobileNumber, pincode };

    const validatedUserProfileData = userValidation.validateUpdateUser(userProfileDetails);
    const validatedPartnerProfileData =
      partnerValidation.validateUpdatePartner(partnerProfileDetails);

    try {
      const updatedProfile = await partnerService.partialUpdateProfile(
        req.user._id,
        validatedUserProfileData,
        validatedPartnerProfileData,
      );
      res
        .status(200)
        .json(new ApiResponse(200, updatedProfile, 'Partner profile updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while update partner profile', err.message);
    }
  });

  // Admin Profile Management

  /**
   * Retrieves the profile of the authenticated admin.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to retrieve the profile.
   */
  async getAdminProfile(req, res) {
    try {
      const profile = await userService.getProfile(req.user._id);
      res.status(200).json(new ApiResponse(200, profile, 'Admin profile retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieve admin profile', err.message);
    }
  }

  /**
   * Partially updates the profile of the authenticated admin.
   * @param {Object} req - The request object containing admin profile data.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if unable to update the profile.
   */
  async partialUpdateAdminProfile(req, res) {
    const validatedAdminProfileData = userValidation.validateUpdateUser(req.body);
    try {
      const updatedProfile = await userService.partialUpdateProfile(
        req.user._id,
        validatedAdminProfileData,
      );
      res
        .status(200)
        .json(new ApiResponse(200, updatedProfile, 'Admin profile updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while update admin profile', err.message);
    }
  }

  /**
   * Updates the avatar for the authenticated user.
   * @param {Object} req - The request object containing the avatar file.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if avatar update fails or image is not provided.
   */
  updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'Avatar image is required');
    }

    try {
      // Fetch the user's current profile to get the existing avatar URL
      const userProfile = await userRepository.findUserById(req.user._id);
      const oldAvatarUrl = userProfile.avatar;

      // Update avatar using AvatarService
      const newAvatarUrl = await avatarService.updateAvatar(oldAvatarUrl, req.file);

      // Update user profile with the new avatar URL
      const updatedProfile = await userRepository.updateUserById(req.user._id, {
        avatar: newAvatarUrl,
      });

      // Send response with updated profile
      res.status(200).json(new ApiResponse(200, updatedProfile, 'Avatar updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while updating avatar', err.message);
    }
  });

  /**
   * Deletes the account of the authenticated user and associated partner if applicable.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {ApiError} Throws an error if account deletion fails.
   */
  async deleteAccount(req, res) {
    try {
      await userRepository.deleteUser(req.user._id);
      if (req.role === 'partner') {
        await partnerRepository.deleteByUserId(req.user._id);
      }
      res.status(204).json(new ApiResponse(204, {}, 'Account deleted successfully'));
    } catch (err) {
      throw new ApiError(500, 'Failed to delete account', err.message);
    }
  }
}

export const profileController = new ProfileController();
