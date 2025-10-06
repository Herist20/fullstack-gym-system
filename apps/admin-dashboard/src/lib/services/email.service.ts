import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail(params: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: params.from || process.env.RESEND_FROM_EMAIL || 'Gym System <noreply@gym-system.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Email service error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Welcome email template
 */
export function getWelcomeEmailTemplate(name: string, email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #ea580c; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Gym! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We're excited to have you join our fitness community. Your account has been successfully created!</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>You can now:</p>
            <ul>
              <li>Browse and book fitness classes</li>
              <li>Track your attendance and progress</li>
              <li>Manage your membership</li>
              <li>View your booking history</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_USER_APP_URL}/login" class="button">Start Your Fitness Journey</a>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Gym System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Booking confirmation email template
 */
export function getBookingConfirmationTemplate(
  name: string,
  className: string,
  date: string,
  time: string,
  qrCodeUrl?: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; width: 120px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { max-width: 200px; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! ✅</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your class booking has been confirmed. We can't wait to see you!</p>

            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <div class="detail-label">Class:</div>
                <div>${className}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div>${date}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Time:</div>
                <div>${time}</div>
              </div>
            </div>

            ${qrCodeUrl ? `
              <div class="qr-code">
                <h3>Check-in QR Code</h3>
                <p>Show this QR code at the gym to check in:</p>
                <img src="${qrCodeUrl}" alt="Check-in QR Code" />
              </div>
            ` : ''}

            <p><strong>Important:</strong></p>
            <ul>
              <li>Please arrive 10 minutes early</li>
              <li>Bring your own water bottle</li>
              <li>Cancel at least 2 hours before if you can't make it</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; 2025 Gym System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Class reminder email template (1 day before or 1 hour before)
 */
export function getClassReminderTemplate(
  name: string,
  className: string,
  date: string,
  time: string,
  hoursUntil: number
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .reminder-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Class Reminder ⏰</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <div class="reminder-box">
              <p><strong>Your class starts in ${hoursUntil} ${hoursUntil === 1 ? 'hour' : 'hours'}!</strong></p>
            </div>
            <p><strong>Class:</strong> ${className}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Don't forget to:</p>
            <ul>
              <li>Bring workout clothes and shoes</li>
              <li>Bring a water bottle</li>
              <li>Arrive 10 minutes early</li>
            </ul>
            <p>See you soon! 💪</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Gym System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Payment receipt email template
 */
export function getPaymentReceiptTemplate(
  name: string,
  invoiceNumber: string,
  amount: number,
  paymentMethod: string,
  items: { name: string; price: number }[],
  pdfUrl?: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .items { margin: 20px 0; }
          .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 20px; font-weight: bold; color: #3b82f6; margin-top: 15px; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Received! 💳</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for your payment. Here's your receipt:</p>

            <div class="invoice-details">
              <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>

              <div class="items">
                <h3>Items:</h3>
                ${items.map(item => `
                  <div class="item-row">
                    <div>${item.name}</div>
                    <div>Rp ${item.price.toLocaleString('id-ID')}</div>
                  </div>
                `).join('')}

                <div class="item-row total">
                  <div>Total Paid:</div>
                  <div>Rp ${amount.toLocaleString('id-ID')}</div>
                </div>
              </div>
            </div>

            ${pdfUrl ? `
              <a href="${pdfUrl}" class="button">Download PDF Invoice</a>
            ` : ''}

            <p>This is an automated receipt. If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Gym System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Membership expiry warning email template
 */
export function getMembershipExpiryWarningTemplate(
  name: string,
  expiryDate: string,
  daysUntilExpiry: number,
  renewalUrl: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .warning-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Membership Expiring Soon! ⚠️</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <div class="warning-box">
              <p><strong>Your membership expires in ${daysUntilExpiry} days!</strong></p>
              <p>Expiry Date: ${expiryDate}</p>
            </div>
            <p>Don't let your fitness journey stop! Renew your membership now to continue enjoying:</p>
            <ul>
              <li>Unlimited access to all classes</li>
              <li>Personal training sessions</li>
              <li>State-of-the-art equipment</li>
              <li>Exclusive member benefits</li>
            </ul>
            <a href="${renewalUrl}" class="button">Renew Membership Now</a>
            <p>Questions? Our team is here to help!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Gym System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(name: string, email: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Our Gym! 🎉',
    html: getWelcomeEmailTemplate(name, email),
  });
}

/**
 * Send booking confirmation
 */
export async function sendBookingConfirmation(
  email: string,
  name: string,
  className: string,
  date: string,
  time: string,
  qrCodeUrl?: string
) {
  return sendEmail({
    to: email,
    subject: `Booking Confirmed: ${className}`,
    html: getBookingConfirmationTemplate(name, className, date, time, qrCodeUrl),
  });
}

/**
 * Send class reminder
 */
export async function sendClassReminder(
  email: string,
  name: string,
  className: string,
  date: string,
  time: string,
  hoursUntil: number
) {
  return sendEmail({
    to: email,
    subject: `Reminder: ${className} starts ${hoursUntil === 1 ? 'in 1 hour' : `in ${hoursUntil} hours`}!`,
    html: getClassReminderTemplate(name, className, date, time, hoursUntil),
  });
}

/**
 * Send payment receipt
 */
export async function sendPaymentReceipt(
  email: string,
  name: string,
  invoiceNumber: string,
  amount: number,
  paymentMethod: string,
  items: { name: string; price: number }[],
  pdfUrl?: string
) {
  return sendEmail({
    to: email,
    subject: `Payment Receipt - Invoice #${invoiceNumber}`,
    html: getPaymentReceiptTemplate(name, invoiceNumber, amount, paymentMethod, items, pdfUrl),
  });
}

/**
 * Send membership expiry warning
 */
export async function sendMembershipExpiryWarning(
  email: string,
  name: string,
  expiryDate: string,
  daysUntilExpiry: number,
  renewalUrl: string
) {
  return sendEmail({
    to: email,
    subject: `Your Membership Expires in ${daysUntilExpiry} Days`,
    html: getMembershipExpiryWarningTemplate(name, expiryDate, daysUntilExpiry, renewalUrl),
  });
}
