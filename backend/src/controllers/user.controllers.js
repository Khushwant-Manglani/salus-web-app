import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { userValidation } from '../validations/index.js';
import { userRepository } from '../repository/index.js';

class UserController {
  /**
   * Register a new user.
   * @param {object} req - Express request object contains the user data in req.body.
   * @param {object} res - Express response object sends the response.
   * @return {Promise<void>} - Promise resolve the registered user data or error
   */
  registerUser = asyncHandler(async (req, res) => {
    try {
      // validate the user data present in req.body
      const validatedUserData = userValidation.validateUser(req.body);

      // the data is validate safely, pass it to the userService and create the user
      const createdUserData = await userRepository.createUser(validatedUserData, 'USER');

      // send responce with success message and create user data
      return res
        .status(201)
        .json(new ApiResponse(201, createdUserData, 'User registered successfully'));
    } catch (err) {
      // handle the error
      throw new ApiError(500, 'Error occurr while register the user', err.message);
    }
  });
}

export const userController = new UserController();
