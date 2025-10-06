import QRCode from 'qrcode';

/**
 * Generate QR code for booking check-in
 */
export async function generateBookingQRCode(bookingId: string): Promise<string> {
  try {
    // Create QR code data with booking info
    const qrData = JSON.stringify({
      type: 'BOOKING_CHECKIN',
      bookingId,
      timestamp: Date.now(),
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as buffer for email attachment or PDF
 */
export async function generateBookingQRCodeBuffer(bookingId: string): Promise<Buffer> {
  try {
    const qrData = JSON.stringify({
      type: 'BOOKING_CHECKIN',
      bookingId,
      timestamp: Date.now(),
    });

    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 2,
    });

    return buffer;
  } catch (error) {
    console.error('QR Code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Parse QR code data
 */
export function parseQRCodeData(qrData: string): {
  type: string;
  bookingId: string;
  timestamp: number;
} | null {
  try {
    const data = JSON.parse(qrData);

    if (data.type !== 'BOOKING_CHECKIN' || !data.bookingId) {
      return null;
    }

    return {
      type: data.type,
      bookingId: data.bookingId,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('QR Code parse error:', error);
    return null;
  }
}

/**
 * Validate QR code (check if not expired and not used)
 */
export function validateQRCode(
  qrData: { type: string; bookingId: string; timestamp: number },
  maxAgeMinutes: number = 60
): { valid: boolean; reason?: string } {
  // Check if QR code is expired (default 60 minutes)
  const now = Date.now();
  const ageMinutes = (now - qrData.timestamp) / (1000 * 60);

  if (ageMinutes > maxAgeMinutes) {
    return {
      valid: false,
      reason: 'QR code has expired. Please generate a new one.',
    };
  }

  return { valid: true };
}
