import { ApiError, generateRandomOtp } from '../utils/index.js';
import { userService, notificationService } from './index.js';
import { userRepository, otpSessionRepository } from '../repository/index.js';

class AuthService {
  /**
   * Sends OTP to the provided contact information (email or mobile number).
   * @param {object} contactInfo - Object containing either email or mobileNumber.
   * @param {string} otp - OTP code to send.
   * @throws {ApiError} Throws error if sending OTP fails.
   */
  async sendOtp(contactInfo, otp) {
    try {
      if (contactInfo.email) {
        await notificationService.sendEmail(contactInfo.email, otp); // Send OTP via email
      } else if (contactInfo.mobileNumber) {
        await notificationService.sendSMS(contactInfo.mobileNumber, otp); // Send OTP via SMS
      }
    } catch (err) {
      throw new ApiError(500, 'Failed to send OTP', err.message);
    }
  }

  /**
   * Authenticates user role by sending OTP and creating OTP session.
   * @param {object} contactInfo - Object containing email or mobileNumber.
   * @param {string} role - Role to authenticate (e.g., 'USER', 'ADMIN').
   * @returns {Promise<{ user: object, uuidToken: string }>} User and OTP session details.
   * @throws {ApiError} Throws error if authentication fails.
   */
  async authenticateRole(contactInfo, role) {
    try {
      // Verify user role existence
      const user = await userService.verifyUserRole(contactInfo, role);

      // Generate OTP
      const otp = generateRandomOtp();

      // Create OTP session and obtain UUID token
      const uuidToken = await otpSessionRepository.createOtpSession(contactInfo, otp);

      // Send OTP to user's contact information
      await this.sendOtp(contactInfo, otp);

      return { user, uuidToken };
    } catch (err) {
      throw new ApiError(500, `Failed to authenticate ${role}`, err.message);
    }
  }

  /**
   * Verifies user role by OTP.
   * @param {string} uuidToken - UUID token associated with OTP session.
   * @param {string} otp - OTP code to verify.
   * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>} User details and tokens.
   * @throws {ApiError} Throws error if verification fails.
   */
  async verifyRoleByOtp(uuidToken, otp) {
    try {
      // Find OTP session by UUID token
      const otpSession = await otpSessionRepository.findOtpSessionByToken(uuidToken);

      if (!otpSession) {
        throw new ApiError(402, 'OTP session not found');
      }

      // Check OTP session expiration
      const currentTime = new Date();
      if (otpSession.createdAt.getSeconds() + 300 < currentTime.getSeconds()) {
        throw new ApiError(400, 'OTP session is expired');
      }

      // Verify OTP correctness
      if (otpSession.otp !== otp) {
        throw new ApiError(403, 'Invalid OTP, please try again');
      }

      // Find user by contact information associated with OTP session
      const user = await userRepository.findUserByContactInfo(otpSession.contactInfo);

      // Generate access and refresh tokens for the user
      const { accessToken, refreshToken } = await userService.generateAccessAndRefreshToken(user);

      return { user, accessToken, refreshToken };
    } catch (err) {
      throw new ApiError(500, 'Failed to verify role by OTP', err.message);
    }
  }

  /**
   * Resends OTP for an existing OTP session.
   * @param {string} uuidToken - UUID token associated with OTP session.
   * @throws {ApiError} Throws error if resending OTP fails.
   */
  async resendOtp(uuidToken) {
    try {
      // Find OTP session by UUID token
      const otpSession = await otpSessionRepository.findOtpSessionByToken(uuidToken);

      if (!otpSession) {
        throw new ApiError(402, 'OTP session not found');
      }

      // Check OTP session expiration
      const currentTime = new Date();
      if (otpSession.createdAt.getSeconds() + 300 < currentTime.getSeconds()) {
        throw new ApiError(400, 'OTP session is expired');
      }

      // Generate new OTP
      otpSession.otp = generateRandomOtp();

      // Save updated OTP session with new OTP (without validation)
      await otpSession.save({ validateBeforeSave: false });

      // Resend OTP to user's contact information
      await this.sendOtp(otpSession.contactInfo, otpSession.otp);
    } catch (err) {
      throw new ApiError(500, 'Failed to resend OTP', err.message);
    }
  }

  async clearUserRefreshToken(id) {
    try {
      await userRepository.clearUserRefreshTokenById(id);
    } catch (error) {
      throw new ApiError(500, 'Failed to clear user refresh token', err.message);
    }
  }
}

// Export a singleton instance of AuthService
export const authService = new AuthService();
