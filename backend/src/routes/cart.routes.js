import { Router } from 'express';
import { cartController } from '../controllers/index.js';
import { checkAuthentication, extractRole, isUserRole } from '../middlewares/index.js';

const router = Router();

// Protected routes (require authentication)
router.use(checkAuthentication, extractRole);

router.post('/cart', isUserRole, cartController.addItemToCart); // Add an item to the cart
router.get('/cart', isUserRole, cartController.getCartItems); // Get all items in the cart
router.put('/cart/:itemId', isUserRole, cartController.updateCartItem); // Update item quantity
router.delete('/cart/:itemId', isUserRole, cartController.removeItemFromCart); // Remove an item

export default router;
