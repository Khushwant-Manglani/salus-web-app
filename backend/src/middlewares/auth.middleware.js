import jwt from 'jsonwebtoken';
import keys from '../config/keys.js';
import { ApiError } from '../utils/index.js';
import { userRepository } from '../repository/index.js';

const { accessTokenSecret } = keys.Jwt;

/**
 * Middleware to check user authentication status.
 * If req.user exists, assumes user is authenticated via social logins.
 * If not, checks for accessToken in cookies or Authorization header for email/mobile login.
 * Verifies accessToken and assigns user to req.user if valid.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @throws {ApiError} 401 - Unauthorized access if authentication fails
 */
const checkAuthentication = (req, res, next) => {
  if (req.user) {
    // means user is logged in via social logins (google, facebook etc)
    if (req.isAuthenticated()) {
      // user is authenticated, proceed with next middleware
      next();
    } else {
      // Redirect to login if authentication fails
      req.redirect('/login');
      // throw new ApiError(401, 'Unauthorized access');
    }
  } else {
    // means user is logged in via email or mobile number so we have an accessToken in cookies so we check authentication with that

    try {
      // Extract the token from cookies or Authorization header
      const token = req.cookies.accessToken || req.header('Authorization')?.split(' ')[1];

      if (!token) {
        throw new ApiError(401, 'Access denied, token not found');
      }

      // verify token and get the decoded payload
      const decoded = jwt.verify(token, accessTokenSecret);

      // find the user by decoded information by user id
      const user = userRepository.findUserById(decoded?._id).select(['-refreshToken']);

      // if user not found
      if (!user) {
        throw new ApiError(401, 'Invalid access token, user not found');
      }

      // if user find then assign it in req.user
      req.user = user;

      // Proceed to next middleware
      next();
    } catch (err) {
      // Throw an ApiError with a 401 status and the error message
      throw new ApiError(401, err.message || 'Invalid access token');
    }
  }
};

export { checkAuthentication };
