import { Order } from '../models/index.js';
import { ApiError } from '../utils/index.js';

class OrderRepository {
  async createOrder(userId, orderData) {
    try {
      const order = new Order({ userId, ...orderData });
      return await order.save();
    } catch (err) {
      throw new ApiError(500, 'Error while creating order', err.message);
    }
  }

  async getOrders(userId, filters) {
    try {
      return await Order.find({ userId, ...filters });
    } catch (err) {
      throw new ApiError(500, 'Error while fetching orders', err.message);
    }
  }

  async getOrderById(orderId) {
    try {
      return await Order.findById(orderId);
    } catch (err) {
      throw new ApiError(500, 'Error while fetching order details', err.message);
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
      if (!order) throw new ApiError(404, 'Order not found');
      return order;
    } catch (err) {
      throw new ApiError(500, 'Error while updating order status', err.message);
    }
  }

  async deleteOrder(orderId) {
    try {
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) throw new ApiError(404, 'Order not found');
      return order;
    } catch (err) {
      throw new ApiError(500, 'Error while deleting order', err.message);
    }
  }

  async getAllOrders(filters) {
    try {
      // Construct the query object based on filters
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.payment_status) {
        query.payment_status = filters.payment_status;
      }
      if (filters.startDate && filters.endDate) {
        query.created_at = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
      // Add more filters as needed

      // Fetch all orders based on the constructed query
      return await Order.find(query).exec();
    } catch (err) {
      throw new ApiError(500, 'Error while fetching all orders', err.message);
    }
  }
}

export const orderRepository = new OrderRepository();
