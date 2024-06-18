import { Schema, model } from 'mongoose';
import { ROLES } from '../constants';

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      unique: true,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, // cloud url
    },
    role: {
      type: String,
      default: ROLES.User,
      enum: [ROLES.Admin, ROLES.Partner, ROLES.User],
    },
    refreshToken: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
