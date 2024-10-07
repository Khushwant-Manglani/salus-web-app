import { orderRepository } from '../repository/index.js';
import { ApiError } from '../utils/index.js';

class EarningService {
  async getEarningsByFilter(userId, filter) {
    try {
      return await orderRepository.getEarningsByFilter(userId, filter);
    } catch (err) {
      throw new ApiError(500, 'Failed to get earnings by filter', err.message);
    }
  }

  async getEarningStats(userId) {
    try {
      return await orderRepository.getEarningStats(userId);
    } catch (err) {
      throw new ApiError(500, 'Failed to get earning stats', err.message);
    }
  }
}

export const earningService = new EarningService();
