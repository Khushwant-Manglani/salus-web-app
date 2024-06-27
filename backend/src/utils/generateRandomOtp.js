/**
 * Generates a random OTP (One-Time Password) of specified length.
 * @param {number} length - Length of the OTP (default is 6).
 * @returns {string} - Generated OTP.
 */
const generateRandomOtp = (length = 6) => {
  let otp = '';

  for (let i = 0; i < length; ++i) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9) and appends to otp
  }

  return otp;
};

export { generateRandomOtp };
