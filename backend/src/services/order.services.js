import { orderRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

class OrderService {
  async placeOrder(userId, orderData) {
    try {
      // Validate cart items, process payment, etc.
      const order = await orderRepository.createOrder(userId, orderData);
      return order;
    } catch (err) {
      throw new ApiError(500, 'Failed to place order', err.message);
    }
  }

  async getOrders(userId, filters) {
    try {
      return await orderRepository.getOrders(userId, filters);
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve orders', err.message);
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await orderRepository.getOrderById(orderId);
      if (!order) throw new ApiError(404, 'Order not found');
      return order;
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve order details', err.message);
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const updatedOrder = await orderRepository.updateOrderStatus(orderId, status);
      if (!updatedOrder) throw new ApiError(404, 'Order not found');
      return updatedOrder;
    } catch (err) {
      throw new ApiError(500, 'Failed to update order status', err.message);
    }
  }

  async deleteOrder(orderId) {
    try {
      await orderRepository.deleteOrder(orderId);
    } catch (err) {
      throw new ApiError(500, 'Failed to delete order', err.message);
    }
  }

  async getAllOrders(filters) {
    try {
      return await orderRepository.getAllOrders(filters);
    } catch (err) {
      throw new ApiError(500, 'Failed to retrieve all orders', err.message);
    }
  }
}

export const orderService = new OrderService();
