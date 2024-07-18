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
    // Ensure the base URL is not empty
    if (!req.baseUrl) {
      throw new ApiError(400, 'Base url is empty');
    }

    // Extract the role from the base URL
    const role = req.baseUrl.split('/')[3]?.toUpperCase();

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

/**
 * Middleware to check if the user role is 'USER'.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object (not used)
 * @param {Function} next - Express next middleware function
 * @throws {ApiError} - If the role is not 'USER'
 */
const isUserRole = (req, _, next) => {
  if (req.role === 'user') {
    next();
  } else {
    next(new ApiError(403, 'User role not found'));
  }
};

export { extractRole, isUserRole };
