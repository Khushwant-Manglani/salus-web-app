import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

/**
 * POST /api/partners/register
 * Route to register a new partner with document images upload.
 * Uses multer middleware for file uploads.
 */
router.route(
  '/register',
  upload.fields([
    { name: 'documentFrontImage', maxCount: 1 },
    { name: 'documentBackImage', maxCount: 1 },
  ]),
  partnerController.registerPartner,
);

export default router;
