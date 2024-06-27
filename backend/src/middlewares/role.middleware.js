import { ApiError } from '../utils/index.js';

/**
 * Middleware to extract the user role from the base URL.
 * The role is expected to be the last segment of the base URL.
 *
 * @param {Object} req - Express request object
 * @param {Object} _ - Express response object (not used)
 * @param {Function} next - Express next middleware function
 * @throws {ApiError} - If the role is not specified in the base URL
 */
const extractRole = (req, _, next) => {
  try {
    // Extract the role from the base URL
    const role = req.baseUrl.split('/').pop().toUpperCase();

    // Check if the role is present
    if (!role) {
      throw new ApiError(400, 'Role is not specified in base URL');
    }

    // Attach the role to the request object
    req.role = role;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

export { extractRole };
