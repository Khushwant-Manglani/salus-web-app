import { Router } from 'express';
import { userController } from '../controllers/index.js';

const router = Router();

/**
 * POST /api/users/register
 * Route to register a new user.
 * Uses userController to handle registration logic.
 */
router.route('/register').post(userController.registerUser);

export default router;
