import { earningService } from '../services/index.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { earningValidation } from '../validations/index.js';

class EarningController {
  getEarningsByFilter = asyncHandler(async (req, res) => {
    try {
      const filter = earningValidation.validateEarningsFilter(req.query.filter); // filter can be Today, Last Month, etc.
      const earnings = await earningService.getEarningsByFilter(req.user._id, filter);

      return res
        .status(200)
        .json(new ApiResponse(200, earnings, 'Earnings retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving earnings', err.message);
    }
  });

  getEarningStats = asyncHandler(async (req, res) => {
    try {
      const stats = await earningService.getEarningStats(req.user._id);

      return res
        .status(200)
        .json(new ApiResponse(200, stats, 'Earning stats retrieved successfully'));
    } catch (err) {
      throw new ApiError(500, 'Error occurred while retrieving earning stats', err.message);
    }
  });
}

export const earningController = new EarningController();
