import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './index.js';
import fs from 'fs';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary from the provided local file path.
 * @param {string} localFilePath - Local file path of the file to upload.
 * @returns {Promise<object>} - Cloudinary upload result object.
 * @throws {ApiError} - Throws API error if file path is not found or upload fails.
 */
const uploadOnCloudinary = async (localFilePath) => {
  // check if the local file path is exist
  if (!localFilePath) {
    throw new ApiError(400, 'Local File path not found while uploading file on cloudinary.');
  }

  try {
    // upload file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // remove the locally saved temporary file after successfully upload.
    fs.unlinkSync(localFilePath);

    return uploadResult;
  } catch (err) {
    // if the upload file on cloudinary operation gets fail then remove the locally saved temporary file
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, 'Error occurr while upload the file on cloudinary', err);
  }
};

export { uploadOnCloudinary };
