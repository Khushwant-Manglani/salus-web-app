import { cartRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

class CartService {
  async addItemToCart(userId, itemData) {
    try {
      // Validate product availability, check for duplicates, etc.
      return await cartRepository.addItemToCart(userId, itemData);
    } catch (err) {
      throw new ApiError(500, 'Failed to add item to cart', err.message);
    }
  }

  async getCartItems(userId) {
    try {
      return await cartRepository.getCartItems(userId);
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve cart items', err.message);
    }
  }

  async updateCartItem(userId, itemId, quantity) {
    try {
      return await cartRepository.updateCartItem(userId, itemId, quantity);
    } catch (err) {
      throw new ApiError(500, 'Failed to update cart item', err.message);
    }
  }

  async removeItemFromCart(userId, itemId) {
    try {
      return await cartRepository.removeItemFromCart(userId, itemId);
    } catch (err) {
      throw new ApiError(500, 'Failed to remove cart item', err.message);
    }
  }
}

export const cartService = new CartService();
