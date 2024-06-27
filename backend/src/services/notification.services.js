import twilio from 'twilio';
import { createTransport } from 'nodemailer';
import { ApiError } from '../utils/index.js';
import { verifyOtpEmailTemplate, verifyOtpSMSTemplate } from '../config/template.js';
import keys from '../config/keys.js';

const { Twilio, Nodemailer } = keys;

class NotificationService {
  constructor() {
    // Initialize twilio client
    this.twilioClient = twilio(Twilio.accountSid, Twilio.authToken);

    // Initialize nodemailer transporter
    this.mailTransporter = createTransport({
      service: Nodemailer.service, // Service provider (e.g., 'gmail', 'smtp')
      auth: {
        user: Nodemailer.username,
        pass: Nodemailer.password,
      },
    });
  }

  /**
   * Sends an SMS containing the OTP to the specified mobile number.
   * @param {string} mobileNumber - The mobile number to send the OTP to.
   * @param {string} otp - The OTP to send.
   * @returns {Promise<Object>} The result of the Twilio API call.
   * @throws {ApiError} If the SMS fails to send.
   */
  async sendSMS(mobileNumber, otp) {
    try {
      const message = verifyOtpSMSTemplate(otp); // Generate SMS message

      // Send SMS using Twilio client
      const messageResult = await this.twilioClient.messages.create({
        body: message.body,
        from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
        to: mobileNumber,
      });

      return messageResult;
    } catch (err) {
      throw new ApiError(500, `Failed to send OTP via SMS to ${mobileNumber}`, err.message);
    }
  }

  /**
   * Sends an email containing the OTP to the specified email address.
   * @param {string} email - The email address to send the OTP to.
   * @param {string} otp - The OTP to send.
   * @returns {Promise<Object>} The result of the Nodemailer API call.
   * @throws {ApiError} If the email fails to send.
   */
  async sendEmail(email, otp) {
    try {
      const message = verifyOtpEmailTemplate(otp); // Generate email message

      // Email options
      const mailOptions = {
        from: 'Salus 👻 <salus@gmail.com>', // Sender's email address
        to: email,
        subject: message.subject,
        text: message.text,
      };

      // Send email using nodemailer transporter
      const mailResult = await this.mailTransporter.sendMail(mailOptions);

      return mailResult;
    } catch (err) {
      throw new ApiError(500, `Failed to send OTP via email to ${email}`, err.message);
    }
  }
}

// Export a singleton instance of NotificationService
export const notificationService = new NotificationService();
