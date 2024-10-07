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

  // All earning calculation from orders document -

  async getEarningsByFilter(userId, filter) {
    try {
      let startDate;
      const now = new Date();

      switch (filter) {
        case 'Today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'Last Month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'Past 6 Months':
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case 'Past 1 Year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case 'Overall':
          startDate = new Date(0); // Start of time
          break;
        default:
          throw new ApiError(400, 'Invalid filter');
      }

      const earnings = await Order.aggregate([
        {
          $match: {
            created_at: { $gte: startDate },
            user_id: userId,
            payment_status: 'PAID',
          },
        },
        { $group: { _id: null, totalEarnings: { $sum: '$total_amount' } } },
      ]);

      return earnings[0]?.totalEarnings || 0;
    } catch (err) {
      throw new ApiError(500, 'Failed to get earnings by filter', err.message);
    }
  }

  async getEarningStats(userId) {
    try {
      const now = new Date();
      const filters = [
        { label: 'Today', date: new Date(now.setHours(0, 0, 0, 0)) },
        { label: 'Last Month', date: new Date(now.setMonth(now.getMonth() - 1)) },
        { label: 'Past 6 Months', date: new Date(now.setMonth(now.getMonth() - 6)) },
        { label: 'Past 1 Year', date: new Date(now.setFullYear(now.getFullYear() - 1)) },
        { label: 'Overall', date: new Date(0) },
      ];

      const stats = await Promise.all(
        filters.map(async (filter) => {
          const earnings = await this.getEarningsByFilter(userId, filter.label);
          return { label: filter.label, earnings };
        }),
      );

      // Extract overall earnings
      const overallEarnings = stats.find((stat) => stat.label === 'Overall').earnings;

      // Calculate percentage changes relative to overall earnings
      const updatedStats = stats
        .map((stat) => {
          if (stat.label !== 'Overall') {
            const percentageChange =
              overallEarnings === 0
                ? stat.earnings === 0
                  ? 0
                  : Infinity
                : ((stat.earnings - overallEarnings) / overallEarnings) * 100;
            return {
              label: stat.label,
              earnings: stat.earnings,
              percentageChange, // Use 'percentageChange' for clarity
            };
          }
          return null; // Exclude overall earnings from the returned stats
        })
        .filter((stat) => stat !== null); // Remove null values from the stats

      return updatedStats;
    } catch (err) {
      throw new ApiError(500, 'Failed to get earning stats', err.message);
    }
  }
}

export const orderRepository = new OrderRepository();
