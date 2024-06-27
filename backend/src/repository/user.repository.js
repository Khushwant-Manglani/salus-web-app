import { ApiError } from '../utils/index.js';
import { User } from '../models/index.js';

// User Data access layer

class UserRepository {
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
      throw new ApiError(500, 'Failed to create the user', err.message);
    }
  }

  /**
   * Finds a user by their contact information (email or mobile number).
   * @param {string} contactInfo - Contact information (email or mobile number) to search for.
   * @returns {Promise<object>} Found user object.
   * @throws {ApiError} Throws error if user retrieval fails.
   */
  async findUserByContactInfo(contactInfo) {
    try {
      // find the user data with contact Information data - {email or password}
      const user = await User.findOne({
        $or: [{ email: contactInfo || null }, { mobileNumber: contactInfo || null }],
      });

      // If user not found
      if (!user) {
        throw new ApiError(404, 'user not found');
      }

      return user;
    } catch (err) {
      throw new ApiError(500, 'Failed to get user by contact Information', err.message);
    }
  }

  /**
   * Deletes a user by their ID.
   * @param {string} userId - The ID of the user to delete.
   * @throws {ApiError} Throws an error if user deletion fails.
   */
  async deleteUser(userId) {
    try {
      await User.deleteOne({ _id: userId });
    } catch (error) {
      throw new ApiError(500, 'Failed to delete the user with specified userId', err.message);
    }
  }
}

// create an UserRepository instance and export it
export const userRepository = new UserRepository();
