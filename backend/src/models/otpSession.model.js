import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define OTP Session schema
const otpSessionSchema = new Schema(
  {
    uuidToken: {
      type: String,
      required: true,
      unique: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // TTL(Time To Live) index to auto-remove after 300 seconds (5 minutes)
    },
  },
  { timestamps: true }, // Automatic timestamps for createdAt and updatedAt
);

// Create and export the OTP Session model
export const OtpSession = mongoose.model('OtpSession', otpSessionSchema);
