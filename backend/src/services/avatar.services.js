import { uploadOnCloudinary, deleteFromCloudinary, ApiError } from '../utils/index.js';

class AvatarService {
  /**
   * Updates the user's avatar by deleting the old one and uploading a new one.
   * @param {string} oldAvatarUrl - The URL of the old avatar.
   * @param {object} newAvatarFile - The new avatar file to upload.
   * @returns {Promise<string>} The URL of the new avatar.
   * @throws {Error} If the upload or deletion process fails.
   */
  async updateAvatar(oldAvatarUrl, newAvatarFile) {
    try {
      // Delete old avatar from Cloudinary if it exists
      if (oldAvatarUrl) {
        const publicId = this.extractPublicIdFromUrl(oldAvatarUrl);
        await deleteFromCloudinary(publicId); // Delete old avatar
      }

      // Upload new avatar to Cloudinary
      const uploadResult = await uploadOnCloudinary(newAvatarFile.path);
      return uploadResult.secure_url; // Return the new avatar URL
    } catch (err) {
      throw new ApiError(`Failed to update avatar: ${err.message}`);
    }
  }

  /**
   * Extracts the public ID from a Cloudinary URL.
   * @param {string} url - The Cloudinary URL.
   * @returns {string} The public ID.
   */
  extractPublicIdFromUrl(url) {
    const parts = url.split('/');
    const fileName = parts.pop();
    return fileName.split('.')[0];
  }
}

export const avatarService = new AvatarService();
