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
    const email = contactInfo.includes('@') ? contactInfo : null;
    const mobileNumber = !email ? mobileNumber : null;

    try {
      // find the user data with contact Information data - {email or password}
      const user = await User.findOne({
        $or: [{ email }, { mobileNumber }],
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
   * Finds an existing user by their provider ID or creates a new user based on the profile data.
   * @param {object} profile - User profile data received from OAuth provider (e.g., Google, Facebook)
   * @returns {Promise<object>} The found or newly created user object
   * @throws {ApiError} If there's an error finding or creating the user
   */
  async findOrCreateFromProvider(profile) {
    try {
      // Capitalize the first character of the profile.provider and store it in provider
      const provider = profile.provider[0].toUpperCase() + profile.provider.slice(1);

      // provider can be google, facebook etc.
      // put provider id as key value pair in query object to find user
      const query = {};
      query[`${profile.provider}Id`] = profile.id;

      // Try to find the user by query(providerId)
      let user = await User.findOne(query);

      // If user already exists, return it
      if (user) return user;

      // normalize profile data
      const { name, email, avatar } = this.normalizeProfileData(provider, profile);

      // if user not found then create the new user
      user = await User.Create({
        name,
        email,
        provider,
        ...query,
        avatar,
      });

      return user;
    } catch (err) {
      throw new ApiError(
        500,
        `Failed to find and create user from provider: ${profile.provider}`,
        err.message,
      );
    }
  }

  /**
   * Normalizes profile data based on the provider.
   * @param {string} provider - The name of the provider (e.g., 'Google', 'Facebook').
   * @param {object} profile - The profile data from the provider.
   * @returns {object} Normalized user data.
   */
  normalizeProfileData(provider, profile) {
    if (provider === 'Google') {
      return {
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      };
    } else if (provider === 'Facebook') {
      return {
        name: profile.name,
        email: profile.email,
        avatar: profile.picture.data.url,
      };
    }

    throw new ApiError(400, 'Unsupported provider');
  }

  /**
   * Finds a user by their ID in the database.
   * @param {string} id - User ID to search for
   * @returns {Promise<object>} The found user object
   * @throws {ApiError} If user is not found or there's an error during database operation
   */
  async findUserById(id) {
    try {
      // Find user by ID in the database
      const user = await User.findById(id);

      // Throw error if user not found
      if (!user) {
        throw new ApiError(404, 'User not found by ID');
      }

      return user;
    } catch (err) {
      throw new ApiError(500, `Failed to find user by ID`, err.message);
    }
  }

  /**
   * Find all users from the database.
   * @async
   * @returns {Promise<Array<object>>} A promise that resolves to an array of user objects.
   * @throws {ApiError} If no users are found or there is an error during retrieval.
   */
  async findAllUsers() {
    try {
      // Find all users from the database
      const users = await User.find({});

      // Throw error if users not found
      if (!users) {
        throw new ApiError(404, 'No users found');
      }

      return users;
    } catch (err) {
      throw new ApiError(500, `Failed to find all users`, err.message);
    }
  }

  /**
   * Updates a user by their ID.
   * @param {string} userId - The ID of the user to update.
   * @param {object} updateData - The data to update the user with.
   * @returns {Promise<object>} The updated user object.
   * @throws {ApiError} If user update fails or user is not found.
   */
  async updateUserById(userId, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        throw new ApiError(404, 'User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new ApiError(500, 'Failed to update user', error.message);
    }
  }

  /**
   * Clears the refresh token for a user by their ID.
   * @param {string} id - The ID of the user to clear the refresh token for.
   * @throws {ApiError} If there's an error during the operation.
   */
  async clearUserRefreshTokenById(id) {
    try {
      await User.findByIdAndUpdate(id, { $set: { refreshToken: undefined } }, { new: true });
    } catch (err) {
      throw new ApiError(500, 'Not able to update refresh token or User not found', err.message);
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
