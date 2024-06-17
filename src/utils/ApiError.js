class ApiError extends Error {
  /**
   * Create an instance of an ApiError.
   * @param {number} statusCode - The HTTP StatusCode of the error.
   * @param {string} message - The error message.
   * @param {Array} errors - An array of specific error details.
   * @param {string} stack - the stack trace of the error.
   */
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // Attach stack trace if provided, otherwise capture it
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
