import { OtpSession } from '../models/index.js';
import { ApiError } from '../utils/index.js';
import { v4 as uuidv4 } from 'uuid';

class OtpSessionRepository {
  /**
   * Create a new OTP session in the database.
   * @param {Object} contactInfo - Contains either email or mobileNumber.
   * @param {string} otp - The OTP code to be stored.
   * @returns {string} uuidToken - Unique identifier for the OTP session.
   * @throws {ApiError} Throws error if OTP session creation fails.
   */
  async createOtpSession(contactInfo, otp) {
    try {
      const uuidToken = uuidv4();

      const otpSession = new OtpSession({
        uuidToken,
        contactInfo: contactInfo.email ? contactInfo.email : contactInfo.mobileNumber,
        otp,
        createdAt: new Date(),
      });

      await otpSession.save();

      return uuidToken;
    } catch (err) {
      throw new ApiError(500, 'Failed to create otp session', err.message);
    }
  }

  /**
   * Find an OTP session by uuidToken from the database.
   * @param {string} uuidToken - Unique identifier for the OTP session.
   * @returns {Object} otpSession - OTP session object found in the database.
   * @throws {ApiError} Throws error if OTP session retrieval fails or session not found.
   */
  async findOtpSessionByToken(uuidToken) {
    try {
      const otpSession = await OtpSession.findOne({ uuidToken });

      if (!otpSession) {
        throw new ApiError(402, 'Otp session not found by uuidToken');
      }

      return otpSession;
    } catch (err) {
      throw new ApiError(500, 'Failed to get otp session by uuidToken', err.message);
    }
  }
}

export const otpSessionRepository = new OtpSessionRepository();
