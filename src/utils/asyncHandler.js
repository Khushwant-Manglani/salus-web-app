/**
 * The higher-order function to handle asynchronous route handlers.
 * It catches errors and passes them to the next middleware.
 *
 * @param {function} requestHandler - The asynchronous route handler function.
 * @returns {function} A new function wrapping the route handler with error handling.
 */

const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

export { asyncHandler };
