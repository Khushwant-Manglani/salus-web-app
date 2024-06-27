import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';
import { authValidation } from '../validations/index.js';
import { authService } from '../services/index.js';

/**
 * AuthController class handles the authentication processes like login, OTP verification, and resending OTP.
 */
class AuthController {
  /**
   * Handles the login process for a user role.
   * Validates the user, authenticates role, and sends an OTP.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @throws {ApiError} - If an error occurs during login
   */
  loginRole = asyncHandler(async (req, res) => {
    try {
      // Validate login input
      authValidation.validateLogin(req.body);

      // Authenticate user role and get UUID token for OTP session
      const { user, uuidToken } = await authService.authenticateRole(req.body, req.role);

      // Determine contact info for OTP message
      const contactInfo = req.body.email || req.body.mobileNumber;

      // Send success response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user, uuidToken },
            `${req.role} verified, OTP message is sent to ${contactInfo}, please verify your OTP`,
          ),
        );
    } catch (err) {
      // Log and throw error if login fails
      throw new ApiError(500, `Error occurred while logging in as ${req.role}`, err.message);
    }
  });

  /**
   * Verifies the user role by OTP.
   * Validates the OTP and issues access and refresh tokens.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @throws {ApiError} - If an error occurs during OTP verification
   */
  verifyRole = asyncHandler(async (req, res) => {
    const { uuidToken, otp } = req.body;

    try {
      // Validate OTP input
      authValidation.validateVerify(req.body);

      // Verify user role by OTP and issue tokens
      const { user, accessToken, refreshToken } = await authService.verifyRoleByOtp(uuidToken, otp);

      // Set cookie options for tokens
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      };

      // Send success response with tokens in cookies
      return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { user, accessToken, refreshToken },
            `${req.role} OTP verified successfully`,
          ),
        );
    } catch (err) {
      // Log and throw error if OTP verification fails
      throw new ApiError(500, `Error occurred while verifying OTP for ${req.role}`, err.message);
    }
  });

  /**
   * Resends the OTP to the user.
   * Validates the UUID token and resends OTP.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @throws {ApiError} - If an error occurs during OTP resend
   */
  resendOtp = asyncHandler(async (req, res) => {
    const { uuidToken } = req.body;

    try {
      // Validate UUID token for resending OTP
      authValidation.validateResend(uuidToken);

      // Resend OTP using authService
      await authService.resendOtp(uuidToken);

      // Send success response
      return res.status(200).json(new ApiResponse(200, {}, 'OTP resent successfully.'));
    } catch (err) {
      // Log and throw error if OTP resend fails
      console.log(err);
      throw new ApiError(500, 'Error occurred while resending OTP', err.message);
    }
  });
}

// Exporting an instance of AuthController
export const authController = new AuthController();
