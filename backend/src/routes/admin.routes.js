import { Router } from 'express';
import { adminController } from '../controllers/index.js';
import { checkAuthentication, extractRole, isAdminRole } from '../middlewares/index.js';

const router = Router();

router.use(checkAuthentication, extractRole, isAdminRole);
router.get('/all-users', adminController.getAllUsers);

export default router;
