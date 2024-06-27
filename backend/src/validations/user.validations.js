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

class UserValidation {
  /**
   * Schema for validating user data during creation.
   */
  userSchema = z.object({
    name: z.string().min(5, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    mobileNumber: mobileNumberSchema,
    address: z.string().min(1).max(255).trim().optional(),
    pincode: z.string().optional(),
    avatar: z.string().url({ message: 'Invalid Url' }).optional(),
    role: z.enum(['ADMIN', 'PARTNER', 'USER']).optional(),
    isVerify: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    googleId: z.string().optional(),
    facebookId: z.string().optional(),
    appleId: z.string().optional(),
  });

  /**
   * Schema for validating user data during update.
   * Allow fields to be optional for partial updates.
   */
  updateUserSchema = z.object({
    name: z.string().min(5, { message: 'Name is required' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    mobileNumber: mobileNumberSchema.optional(),
    address: z.string().optional(),
    pincode: z.string().optional(),
    avatar: z.string().url({ message: 'Invalid Url' }).optional(),
    role: z.enum(['ADMIN', 'PARTNER', 'USER']).optional(),
    isVerify: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    googleId: z.string().optional(),
    facebookId: z.string().optional(),
    appleId: z.string().optional(),
  });

  /**
   * Validate the user data against userSchema
   * @param {object} userData - The user data object to validate.
   * @returns {object} validated user data or throws zod validation error.
   */
  validateUser(userData) {
    try {
      return this.userSchema.parse(userData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validate the user updated data against updateUserSchema.
   * Allow partial update.
   * @param {object} userData - The user data object to validate.
   * @returns {object} validated user data or throws zod validation error.
   */
  validateUpdateUser(userData) {
    try {
      return this.updateUserSchema.parse(userData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

// create the userValidation object and export it for usage
export const userValidation = new UserValidation();
