import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { extractRole } from '../middlewares/index.js';

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

export default router;
