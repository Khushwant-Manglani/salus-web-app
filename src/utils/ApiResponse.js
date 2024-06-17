class ApiResponse {
  /**
   * Create an instance of ApiResponse.
   * @param {number} statusCode - The HTTP Status code of the response.
   * @param {any} data - The data to be include in the response.
   * @param {string} message - A message describe the response.
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
