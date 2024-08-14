import { Router } from 'express';
import { profileController } from '../controllers/index.js';
import { checkAuthentication, extractRole, upload } from '../middlewares/index.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(checkAuthentication);

// User Profile Routes
router.get('/', profileController.getUserProfile);
router.patch('/', profileController.partialUpdateUserProfile);

// Partner Profile Routes
router.get('/', profileController.getPartnerProfile);
router.patch('/', profileController.partialUpdatePartnerProfile);

// Admin Profile Routes
router.get('/', profileController.getAdminProfile);
router.patch('/', profileController.partialUpdateAdminProfile);

// Common routes for avatar update and account deletion
router.post('/avatar', upload.single('avatar'), profileController.updateUserAvatar);
router.delete('/account', extractRole, profileController.deleteAccount);

export default router;
