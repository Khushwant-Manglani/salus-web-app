import { Router } from 'express';
import { earningController } from '../controllers/index.js';
import { checkAuthentication, extractRole, isPartnerOrAdminRole } from '../middlewares/index.js';

const router = Router();

// Protected routes (require authentication)
router.use(checkAuthentication);

// Routes for partner and admin roles
router.use(extractRole);

router.get('/earnings', isPartnerOrAdminRole, earningController.getEarningsByFilter);
router.get('/earnings/stats', isPartnerOrAdminRole, earningController.getEarningStats);

export default router;
