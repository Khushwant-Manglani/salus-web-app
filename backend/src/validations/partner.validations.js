import { z } from 'zod';
import { PARTNER } from '../constants.js';
import { ApiError } from '../utils/index.js';

// Define Zod schema for ObjectId
const ObjectIdSchema = z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
  message: 'Invalid ObjectId',
});

class PartnerValidation {
  /**
   * Schema for validating partner data during creation.
   */
  partnerSchema = z.object({
    businessName: z.string().min(1).max(255).trim(),
    address1: z.string().min(1).max(255).trim(),
    address2: z.string().min(1).max(255).trim().optional(),
    documentTypeId: ObjectIdSchema,
    documentNumber: z.string().min(1).max(255).trim(),
    documentFrontUrl: z.string().url().optional(),
    documentBackUrl: z.string().url().optional(),
    status: z.enum([PARTNER.Request, PARTNER.Failed, PARTNER.Approved]).optional(),
  });

  /**
   * Schema for validating partner data during update.
   * Allow fields to be optional for partial updates.
   */
  partnerUpdateSchema = z.object({
    businessName: z.string().min(1).max(255).trim().optional(),
    address1: z.string().min(1).max(255).trim().optional(),
    address2: z.string().min(1).max(255).trim().optional().optional(),
    documentTypeId: ObjectIdSchema,
    documentNumber: z.string().min(1).max(255).trim().optional(),
    documentFrontImage: z.string().url().optional(),
    documentBackImage: z.string().url().optional(),
    status: z.enum([PARTNER.Request, PARTNER.Failed, PARTNER.Approved]).optional(),
  });

  /**
   * Validate the partner data against partnerSchema
   * @param {object} partnerData - The partner data object to validate.
   * @returns {object} validated partner data or throws zod validation error.
   */
  validatePartner(partnerData) {
    try {
      return this.partnerSchema.parse(partnerData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }

  /**
   * Validate the partner updated data against updatePartnerSchema.
   * Allow partial update.
   * @param {object} userData - The partner data object to validate.
   * @returns {object} validated partner data or throws zod validation error.
   */
  validateUpdatePartner(partnerData) {
    try {
      return this.partnerUpdateSchema.parse(partnerData);
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  }
}

export const partnerValidation = new PartnerValidation();
