import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { userValidation, partnerValidation } from '../validations/index.js';
import { userRepository, partnerRepository } from '../repository/index.js';

class PartnerController {
  /**
   * Register a new partner.
   * @param {object} req - Express request object containing partner and user data.
   * @param {object} res - Express response object to send the response.
   * @returns {Promise<void>} - Promise that resolves with the created partner and user data or throws an error.
   */
  registerPartner = asyncHandler(async (req, res) => {
    let user;

    try {
      // Destructure and separate user and partner details from req.body
      const { name, email, mobileNumber, pincode, ...partnerDetails } = req.body;
      const userDetails = { name, email, mobileNumber, pincode };

      // validate the partner data
      partnerValidation.validatePartner(partnerDetails);

      // validate user data also bcz - we store partner - name, email, mobileNumber and role in user model
      userValidation.validateUser(userDetails);

      // create the user (PARTNER role)
      user = await userRepository.createUser(userDetails, 'PARTNER');

      // Create the partner using partner repository
      const partner = await partnerRepository.createPartner(partnerDetails, req.files);

      // Return successful response with merged user and partner data
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { ...user.toObject(), ...partner.toObject() },
            'Partner created successfully.',
          ),
        );
    } catch (err) {
      // Check if user created but partner not and error occurrs then delete user
      if (user) {
        await userRepository.deleteUser(user._id);
      }

      // Throw an API error if any error occurs during registration
      throw new ApiError(500, 'Error occurred while register the partner', err.message);
    }
  });
}

export const partnerController = new PartnerController();
