import { z } from 'zod';
import { ApiError } from '../utils/index.js';

// Define a regular expression for phone numbers with country codes
const mobileNumberRegex = /^\+[1-9]\d{1,14}$/;

// Create a Zod schema for the phone number with country code
const mobileNumberSchema = z.string().refine(
  (value) => {
    return mobileNumberRegex.test(value);
  },
  {
    message:
      "Invalid mobile number format. It should start with a '+' followed by the country code and mobile number.",
  },
);

/**
 * AuthValidation class provides validation schemas for authentication related operations.
 * It uses Zod schemas to define and validate data structures.
 */
class AuthValidation {
  /**
   * Zod schema for login data validation.
   */
  loginSchema = z
    .object({
      email: z.string().email({ message: 'Invalid email address' }).optional(),
      mobileNumber: mobileNumberSchema.optional(),
    })
    .refine((data) => data.email || data.mobileNumber, {
      message: 'Either email or mobile number must be provided',
    });

  /**
   * Zod schema for verify data validation.
   */
  verifySchema = z.object({
    uuidToken: z.string().uuid(),
    otp: z.string().regex(/^\d{6}$/, 'Invalid OTP format'),
  });

  /**
   * Zod schema for resend data validation.
   */
  resendSchema = z.string().uuid();

  /**
   * Validates login request data.
   * @param {object} data - Login request data
   * @returns {object} - Validated data
   * @throws {ApiError} - If validation fails
   */
  validateLogin(data) {
    try {
      return this.loginSchema.parse(data);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validates verify request data.
   * @param {object} data - Verify request data
   * @returns {object} - Validated data
   * @throws {ApiError} - If validation fails
   */
  validateVerify(data) {
    try {
      return this.verifySchema.parse(data);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validates resend request data.
   * @param {string} data - Resend request data (UUID token)
   * @returns {string} - Validated UUID token
   * @throws {ApiError} - If validation fails
   */
  validateResend(data) {
    try {
      return this.resendSchema.parse(data);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

// Export a singleton instance of AuthValidation
export const authValidation = new AuthValidation();
