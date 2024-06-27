import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

/**
 * Configuration keys for the application.
 * These keys are populated from environment variables.
 */
const keys = {
  // Server port
  Port: process.env.PORT,

  // MongoDB URI for database connection
  MongoUri: process.env.MONGO_URI,

  // Node.js environment (development, production, etc.)
  NodeEnvironment: process.env.NODE_ENV,

  // Allowed CORS origin
  CorsOrigin: process.env.CORS_ORIGIN,

  // Twilio configuration for sending SMS
  Twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },

  // Nodemailer configuration for sending emails
  Nodemailer: {
    service: process.env.NODEMAILER_SERVICE, // e.g., 'gmail', 'smtp'
    username: process.env.NODEMAILER_AUTH_USERNAME,
    password: process.env.NODEMAILER_AUTH_PASSWORD,
  },

  // JWT configuration for authentication tokens
  Jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  },

  // Cloudinary configuration for media storage
  Cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default keys;
