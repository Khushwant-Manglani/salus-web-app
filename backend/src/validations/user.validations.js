import { z } from 'zod';
import { ApiError } from '../utils/index.js';

class UserValidation {
  /**
   * Schema for validating user data during creation.
   */
  userSchema = z.object({
    name: z.string().min(5, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    mobileNumber: z.string().min(10, { message: 'Mobile number should contain atleast 10 digits' }),
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
    mobileNumber: z
      .string()
      .min(10, { message: 'Mobile number should contain atleast 10 digits' })
      .optional(),
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
