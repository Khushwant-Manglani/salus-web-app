import mongoose, { Schema } from 'mongoose';
import { PARTNER } from '../constants.js';

// define the partner schema
const partnerSchema = new Schema(
  {
    // Reference to user model
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Business name of partner
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    // Primary address
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    // Secondary address (Optional)
    address2: {
      type: String,
      trim: true,
    },
    // Reference to document type
    documentTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    // Document number
    documentNumber: {
      type: String,
      required: true,
      trim: true,
    },
    // Front side image of the document
    documentFrontImage: {
      type: String, // cloud url
    },
    // back side image of the document
    documentBackImage: {
      type: String, // cloud url
    },
    // status of partner request
    status: {
      type: String,
      default: PARTNER.Request,
      enum: [PARTNER.Request, PARTNER.Failed, PARTNER.Approved],
    },
  },
  { timestamps: true },
);

// create the Partner model based on partnerSchema and export it
export const Partner = mongoose.model('Partner', partnerSchema);
