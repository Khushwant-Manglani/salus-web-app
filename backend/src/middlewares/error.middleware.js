import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';
import keys from '../config/keys.js';

const { NodeEnvironment } = keys;

/**
 * Express error-handling middleware.
 *
 * This middleware function handles errors thrown in the application, differentiating between
 * known `ApiError` instances and unexpected errors. It logs the error details and sends
 * an appropriate response to the client.
 *
 * @function errorHandler
 * @param {Error} err - The error object thrown.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // check if err is instance of ApiError class
  const isApiErrorInstance = err instanceof ApiError;
  const statusCode = isApiErrorInstance ? err.statusCode : 500;
  const message = isApiErrorInstance ? err.message : 'Internal Server Error';
  const errors = isApiErrorInstance ? err.errors : [];

  const errorObject = {
    method: req.method,
    orignalUrl: req.url,
    statusCode,
    message,
    errors: errors,
    ...(NodeEnvironment === 'development' && { stack: err.stack }),
  };

  // %o: This is a placeholder that tells the logger to output the provided object in a pretty-printed format.
  logger.error('Error occurred: %o', errorObject);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};

export { errorHandler };
