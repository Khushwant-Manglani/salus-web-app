import { ApiError } from '../utils/index.js';
import { User } from '../models/index.js';

class UserService {
  /**
   * Check if user already exists.
   * @param {string} email - The user email.
   * @param {string} mobileNumber - The user mobile number.
   * @throws {ApiError} Throws an error if user already exists.
   */
  async checkUserAlreadyExist(email, mobileNumber) {
    const user = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (user) {
      throw new ApiError(409, 'User with email and mobileNumber already exist.');
    }
  }

  /**
   * Creates a new user with the provided user data and role.
   * @param {object} userData - User data object to create a new user.
   * @param {string} role - Role of the user (e.g., 'ADMIN', 'PARTNER', 'USER').
   * @returns {Promise<object>} Newly created user object.
   * @throws {ApiError} Throws error if user creation fails.
   */
  async createUser(userData, role) {
    try {
      // check if user already exist
      await this.checkUserAlreadyExist(userData.email, userData.mobileNumber);

      // create the new user
      const newUser = new User({ role: role, ...userData });
      await newUser.save();

      // return the new created user
      return newUser;
    } catch (err) {
      throw new ApiError(500, 'Error occurred while create the user', err);
    }
  }
}

// create an UserService instance and export it
export const userService = new UserService();
