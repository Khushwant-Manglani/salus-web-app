import { z } from 'zod';

class EarningValidation {
  earningsFilterSchema = z.object({
    filter: z.enum(['Today', 'Last Month', 'Past 6 Months', 'Past 1 Year', 'Overall']),
  });

  validateEarningsFilter = (req, res, next) => {
    try {
      return this.earningsFilterSchema.parse(req.query);
      next();
    } catch (err) {
      throw new ApiError(400, err['issues'][0]?.message || 'Validation Error');
    }
  };
}

export const earningValidation = new EarningValidation();
