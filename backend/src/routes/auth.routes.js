import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { extractRole, isUserRole } from '../middlewares/index.js';
import passport from 'passport';
import '../config/passport.js';

const router = Router();

/**
 * Route for logging in and sending OTP.
 * The extractRole middleware is used to extract the role from the URL.
 */
router.route('/login').post(extractRole, authController.loginRole);

/**
 * Route for verifying the OTP.
 * The extractRole middleware is used to extract the role from the URL.
 */
router.route('/verify').post(extractRole, authController.verifyRole);

/**
 * Route for resending the OTP.
 * No need for extractRole middleware here as it doesn't depend on the role.
 */
router.route('/resend').post(authController.resendOtp);

/**
 * Route for initiating Google OAuth login.
 * Uses extractRole to ensure the user role is present and isUserRole to check if the role is 'USER'.
 */
router
  .route('/google')
  .get(extractRole, isUserRole, passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * Route for handling the Google OAuth callback.
 * Uses extractRole to ensure the user role is present and isUserRole to check if the role is 'USER'.
 */
router
  .route('/google/callback')
  .get(
    extractRole,
    isUserRole,
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.socialAuth,
  );

/**
 * Route for initiating Facebook OAuth login.
 * Uses extractRole to ensure the user role is present and isUserRole to check if the role is 'USER'.
 */
router
  .route('/facebook')
  .get(extractRole, isUserRole, passport.authenticate('facebook', { scope: ['profile', 'email'] }));

/**
 * Route for handling the Facebook OAuth callback.
 * Uses extractRole to ensure the user role is present and isUserRole to check if the role is 'USER'.
 */
router
  .route('/facebook/callback')
  .get(
    extractRole,
    isUserRole,
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    authController.socialAuth,
  );

router.route('/logout').get(extractRole, authController.logoutRole);

export default router;
