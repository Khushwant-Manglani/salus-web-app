import { Router } from 'express';
import { orderController } from '../controllers/index.js';
import { checkAuthentication, extractRole, isPartnerOrAdminRole } from '../middlewares/index.js';

const router = Router();

// Protected routes (require authentication)
router.use(checkAuthentication);

router.post('/orders', orderController.placeOrder); // Place a new order
router.get('/orders', orderController.getOrders); // Get all orders (User-specific)
router.get('/orders/:id', orderController.getOrderById); // Get order details by ID

// Partner/Admin routes for managing orders
router.use(extractRole);

// Route for partners and admins to view all orders
router.get('/orders/all', isPartnerOrAdminRole, orderController.getAllOrders); // Get all orders

router.put('/orders/:id/status', isPartnerOrAdminRole, orderController.updateOrderStatus); // Update order status
router.delete('/orders/:id', isPartnerOrAdminRole, orderController.deleteOrder); // Delete an order

export default router;
