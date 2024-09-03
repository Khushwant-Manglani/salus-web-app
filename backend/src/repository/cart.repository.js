import { Cart } from '../models/index.js';
import { ApiError } from '../utils/index.js';

class CartRepository {
  async addItemToCart(userId, itemData) {
    try {
      // Add logic to find existing item or create a new one
      const cartItem = new Cart({ userId, ...itemData });
      return await cartItem.save();
    } catch (err) {
      throw new ApiError(500, 'Error while adding item to cart', err.message);
    }
  }

  async getCartItems(userId) {
    try {
      return await Cart.find({ userId });
    } catch (err) {
      throw new ApiError(500, 'Error while fetching cart items', err.message);
    }
  }

  async updateCartItem(userId, itemId, quantity) {
    try {
      const cartItem = await Cart.findOneAndUpdate(
        { _id: itemId, userId },
        { quantity },
        { new: true, runValidators: true },
      );
      if (!cartItem) throw new ApiError(404, 'Cart item not found');
      return cartItem;
    } catch (err) {
      throw new ApiError(500, 'Error while updating cart item', err.message);
    }
  }

  async removeItemFromCart(userId, itemId) {
    try {
      const cartItem = await Cart.findOneAndDelete({ _id: itemId, userId });
      if (!cartItem) throw new ApiError(404, 'Cart item not found');
      return cartItem;
    } catch (err) {
      throw new ApiError(500, 'Error while removing cart item', err.message);
    }
  }
}

export const cartRepository = new CartRepository();
