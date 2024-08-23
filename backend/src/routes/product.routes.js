import { Router } from 'express';
import { productController } from '../controllers/index.js';
import { checkAuthentication, extractRole, isPartnerOrAdminRole } from '../middlewares/index.js';

const router = Router();

// Public routes (accessible by users)
router.get('/products', productController.getAllProducts); // Get all products
router.get('/products/:id', productController.getProductById); // Get a product by ID

// Filtering products
// Example: /products?filter=value
router.get('/products', productController.getAllProducts); // Use the same route for filtering with query params

// Partner routes (protected, require authentication)
router.use(checkAuthentication, extractRole);
router.post('/products', isPartnerOrAdminRole, productController.createProduct); // Only Admin or Partner can create
router.put('/products/:id', isPartnerOrAdminRole, productController.updateProduct); // Only Admin or Partner can update
router.delete('/products/:id', isPartnerOrAdminRole, productController.deleteProduct); // Only Admin or Partner can delete

export default router;
