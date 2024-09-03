import { orderService } from '../services/index.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { orderValidation } from '../validations/index.js';

class OrderController {
  placeOrder = asyncHandler(async (req, res) => {
    try {
      // Validate order data
      const orderData = orderValidation.validateOrder(req.body);
      const userId = req.user._id;

      // Place the order
      const order = await orderService.placeOrder(userId, orderData);

      return res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while placing the order', err.message);
    }
  });

  getOrders = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const filters = req.query;
      const orders = await orderService.getOrders(userId, filters);

      return res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving orders', err.message);
    }
  });

  getOrderById = asyncHandler(async (req, res) => {
    try {
      const orderId = req.params.id;
      // Validate order ID
      if (!orderId) {
        throw new ApiError(400, 'Order ID is required');
      }

      const order = await orderService.getOrderById(orderId);

      return res
        .status(200)
        .json(new ApiResponse(200, order, 'Order details retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving order details', err.message);
    }
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    try {
      const orderId = req.params.id;
      const status = req.body.status;

      // Validate status update
      if (!orderId) {
        throw new ApiError(400, 'Order ID is required');
      }
      if (!status) {
        throw new ApiError(400, 'Status is required');
      }
      orderValidation.validateUpdateOrder({ status });

      const updatedOrder = await orderService.updateOrderStatus(orderId, status);

      return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, 'Order status updated successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while updating order status', err.message);
    }
  });

  deleteOrder = asyncHandler(async (req, res) => {
    try {
      const orderId = req.params.id;

      // Validate order ID
      if (!orderId) {
        throw new ApiError(400, 'Order ID is required');
      }

      await orderService.deleteOrder(orderId);

      return res.status(200).json(new ApiResponse(200, null, 'Order deleted successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while deleting order', err.message);
    }
  });

  getAllOrders = asyncHandler(async (req, res) => {
    try {
      // Ensure the user has the correct role
      const filters = req.query;
      const orders = await orderService.getAllOrders(filters);

      return res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving all orders', err.message);
    }
  });
}

export const orderController = new OrderController();
