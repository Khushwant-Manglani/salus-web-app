/**
 * Generates an email template for OTP verification.
 *
 * @param {string} otp - The OTP code for verification
 * @returns {Object} - The email template with subject and text
 */
export const verifyOtpEmailTemplate = (otp) => {
  const message = {
    subject: 'Your OTP Code for Verification',
    text: `Hello Dear!,

    Your OTP for verification is: ${otp}
    
    This is an auto-generated email. Please do not reply to this email.
    
    Regards,
    Salus`,
  };

  return message;
};

/**
 * Generates an SMS template for OTP verification.
 *
 * @param {string} otp - The OTP code for verification
 * @returns {Object} - The SMS template with body text
 */
export const verifyOtpSMSTemplate = (otp) => {
  const message = {
    body: `Hello Dear!,
    
    Your OTP for verification is: ${otp}
    
    This is an auto-generated SMS. Please do not reply to this SMS.
    
    Regards,
    Salus`,
  };

  return message;
};
