import { asyncHandler, ApiResponse, ApiError } from '../utils/index.js';
import { userRepository } from '../repository/index.js';

class AdminController {
  getAllUsers = asyncHandler(async (req, res) => {
    try {
      const users = await userRepository.findAllUsers();
      return res.status(200).json(new ApiResponse(200, users, 'All users found successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving all users', err.message);
    }
  });
}

export const adminController = new AdminController();
