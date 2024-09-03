import { cartService } from '../services/index.js';
import { asyncHandler, ApiResponse, ApiError } from '../utils/index.js';
import { cartValidation } from '../validations/index.js';

class CartController {
  addItemToCart = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      // Validate the incoming item data
      const itemData = cartValidation.validateCart(req.body);

      const cartItem = await cartService.addItemToCart(userId, itemData);

      return res
        .status(201)
        .json(new ApiResponse(201, cartItem, 'Item added to cart successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while adding item to cart', err.message);
    }
  });

  getCartItems = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await cartService.getCartItems(userId);

      return res
        .status(200)
        .json(new ApiResponse(200, cartItems, 'Cart items retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving cart items', err.message);
    }
  });

  updateCartItem = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const itemId = req.params.itemId;

      // Validate the incoming update data
      const quantity = cartValidation.validateUpdateCart(req.body).quantity;

      const updatedItem = await cartService.updateCartItem(userId, itemId, quantity);

      return res
        .status(200)
        .json(new ApiResponse(200, updatedItem, 'Cart item updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while updating cart item', err.message);
    }
  });

  removeItemFromCart = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const itemId = req.params.itemId;
      await cartService.removeItemFromCart(userId, itemId);

      return res.status(200).json(new ApiResponse(200, null, 'Cart item removed successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while removing cart item', err.message);
    }
  });
}

export const cartController = new CartController();
