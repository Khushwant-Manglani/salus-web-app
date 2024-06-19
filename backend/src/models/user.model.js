import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants';

// define the user schema
const userSchema = new Schema(
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
    // social login Id's
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    appleId: {
      type: String,
    },
  },
  { timestamps: true },
);

// assign function to our methods object in our userSchema
userSchema.methods = {
  /**
   * Generate the access token for user.
   * @returns {string} JWT access token.
   */
  generateAccessToken() {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        mobileNumber: this.mobileNumber,
        name: this.name,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
      },
    );
  },

  /**
   * Generate the refresh token for user.
   * @returns {string} JWT refresh token.
   */
  generateRefreshToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
      },
    );
  },
};

// create user model based on userSchema and export it
export const User = mongoose.model('User', userSchema);
