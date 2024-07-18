import passport from 'passport';
import GooglePassport from 'passport-google-oauth20';
import FacebookPassport from 'passport-facebook';
import keys from './keys';

import { userRepository } from '../repository';
import { logger } from './logger';

/**
 * Configure Passport.js with Google and Facebook authentication strategies.
 * Uses keys for client IDs, client secrets, and callback URLs from './keys'.
 */

const GoogleStrategy = GooglePassport.Strategy;
const FacebookStrategy = FacebookPassport.Strategy;

const { Google, Facebook } = keys;

// Configure Google authentication strategy
passport.use(
  new GoogleStrategy({
    clientID: Google.clientId,
    clientSecret: Google.clientSecret,
    callbackURL: Google.callbackUrl,
  }),

  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in the database based on Google profile
      const user = await userRepository.findOrCreateFromProvider(profile);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  },
);

// Configure Facebook authentication strategy
passport.use(
  new FacebookStrategy({
    clientID: Facebook.clientId,
    clientSecret: Facebook.clientSecret,
    callbackURL: Facebook.callbackUrl,
  }),

  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in the database based on Facebook profile
      const user = await userRepository.findOrCreateFromProvider(profile);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  },
);

// Serialize user by ID to store in the session cookie
// This function helps by saving the user's ID in the session.
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from ID stored in the session cookie
// This function retrieves the user from the database using the ID stored in the session.
// Once found, it attaches the user object to req.user for easy access in routes.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findUserById(id);

    if (!user) {
      return done(new Error('User not found'), null);
    }

    done(null, user);
  } catch (err) {
    logger.error('Error deserialize user : %o', err);
    done(err, null);
  }
});
