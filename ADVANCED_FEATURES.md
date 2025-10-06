# Advanced Features Documentation

This document provides comprehensive setup and usage instructions for all advanced features implemented in the Gym Management System.

## Table of Contents

1. [Payment Integration (Xendit)](#1-payment-integration-xendit)
2. [Email Notifications (Resend)](#2-email-notifications-resend)
3. [QR Code Check-in System](#3-qr-code-check-in-system)
4. [Analytics & Monitoring](#4-analytics--monitoring)
5. [Performance Optimizations](#5-performance-optimizations)
6. [Environment Variables](#6-environment-variables)

---

## 1. Payment Integration (Xendit)

### Overview
Integrated Xendit payment gateway for Indonesian market, supporting multiple payment methods.

### Supported Payment Methods
- **Invoice** - Flexible payment with multiple methods
- **Virtual Account** - BCA, BNI, BRI, Mandiri, Permata
- **QRIS** - QR Code Indonesian Standard
- **E-Wallet** - OVO, DANA, LinkAja, ShopeePay

### Setup

1. **Create Xendit Account**
   - Sign up at https://dashboard.xendit.co/register
   - Verify your business
   - Get API keys from Settings > Developers > API Keys

2. **Environment Variables**
   ```env
   XENDIT_SECRET_KEY=xnd_development_...
   XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token
   NEXT_PUBLIC_APP_URL=http://localhost:3003
   ```

3. **Configure Webhooks**
   - Go to Xendit Dashboard > Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/xendit`
   - Select events: `invoice.paid`, `invoice.expired`, `va.paid`, `qris.paid`, `ewallet.capture`

### Usage

#### Create Payment

```typescript
import { createInvoice, createVirtualAccount } from '@/lib/services/xendit.service';

// Create invoice
const result = await createInvoice({
  externalId: 'membership-123',
  amount: 500000,
  payerEmail: 'user@example.com',
  description: 'Premium Membership',
});

// Create Virtual Account
const va = await createVirtualAccount({
  externalId: 'payment-456',
  bankCode: 'BCA',
  name: 'John Doe',
  expectedAmount: 300000,
});
```

#### API Endpoint

```typescript
// POST /api/payments/create
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-id',
    membershipId: 'membership-id',
    amount: 500000,
    paymentMethod: 'invoice', // or 'va_bca', 'qris', 'ovo', etc.
    type: 'membership',
  }),
});
```

### Features Implemented

✅ Multiple payment methods support
✅ Automatic webhook processing
✅ Payment status tracking
✅ Membership auto-activation on payment
✅ Email receipt on successful payment
✅ Refund handling

### Auto-Renewal System
- Membership expiry monitoring (7 days, 3 days, 1 day warnings)
- Automatic invoice generation for renewal
- Email notifications with payment links
- Auto-activation on payment completion

---

## 2. Email Notifications (Resend)

### Overview
Integrated Resend email service for transactional emails with beautiful HTML templates.

### Setup

1. **Create Resend Account**
   - Sign up at https://resend.com
   - Verify your domain (optional for development)
   - Get API key from API Keys section

2. **Environment Variables**
   ```env
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=Gym System <noreply@yourdomain.com>
   ```

3. **Domain Verification** (Production)
   - Add domain in Resend Dashboard
   - Add DNS records to your domain
   - Verify domain

### Email Templates

#### 1. Welcome Email
Sent when a new user registers.

```typescript
import { sendWelcomeEmail } from '@/lib/services/email.service';

await sendWelcomeEmail('John Doe', 'john@example.com');
```

#### 2. Booking Confirmation
Sent when a class booking is confirmed.

```typescript
import { sendBookingConfirmation } from '@/lib/services/email.service';

await sendBookingConfirmation(
  'john@example.com',
  'John Doe',
  'Yoga Class',
  '2025-01-15',
  '10:00 AM',
  'https://example.com/qr/booking-123.png' // Optional QR code
);
```

#### 3. Class Reminder
Sent 24 hours and 1 hour before class.

```typescript
import { sendClassReminder } from '@/lib/services/email.service';

await sendClassReminder(
  'john@example.com',
  'John Doe',
  'Yoga Class',
  '2025-01-15',
  '10:00 AM',
  24 // hours until class
);
```

#### 4. Payment Receipt
Sent when payment is successful.

```typescript
import { sendPaymentReceipt } from '@/lib/services/email.service';

await sendPaymentReceipt(
  'john@example.com',
  'John Doe',
  'INV-2025-001',
  500000,
  'Bank Transfer',
  [{ name: 'Premium Membership', price: 500000 }],
  'https://example.com/invoices/INV-2025-001.pdf' // Optional PDF
);
```

#### 5. Membership Expiry Warning
Sent 7, 3, and 1 days before expiry.

```typescript
import { sendMembershipExpiryWarning } from '@/lib/services/email.service';

await sendMembershipExpiryWarning(
  'john@example.com',
  'John Doe',
  '2025-02-01',
  7, // days until expiry
  'https://yourdomain.com/renew'
);
```

### Supabase Triggers (To Be Implemented)

Create Supabase Edge Functions for automatic email triggers:

```sql
-- Example trigger for booking confirmation
CREATE OR REPLACE FUNCTION notify_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Call Edge Function to send email
  PERFORM net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-booking-email',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('booking_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_confirmation();
```

---

## 3. QR Code Check-in System

### Overview
Automated check-in system using QR codes for contactless attendance tracking.

### Features

✅ Unique QR code per booking
✅ QR code in email confirmations
✅ Camera-based scanning
✅ Duplicate check-in prevention
✅ Time-based validation (1 hour before class)
✅ Real-time attendance tracking

### Setup

No additional setup required. QR code generation is built-in.

### Usage

#### Generate QR Code for Booking

```typescript
import { generateBookingQRCode } from '@/lib/utils/qr-code';

// Generate QR code as data URL (for display)
const qrCodeDataUrl = await generateBookingQRCode('booking-id-123');

// Use in img tag
<img src={qrCodeDataUrl} alt="Check-in QR Code" />
```

#### API Endpoint

```typescript
// GET /api/checkin?bookingId=123
const response = await fetch('/api/checkin?bookingId=booking-123');
const { qrData } = await response.json();
```

#### Check-in Scanner

Navigate to `/checkin` in admin dashboard to access the QR scanner.

**Features:**
- Camera selection (front/back camera)
- Real-time scanning
- Visual feedback on success/error
- Recent check-ins list
- Validation checks:
  - QR code validity (not expired)
  - Booking status (not cancelled)
  - Time window (1 hour before to 30 min after class)
  - Duplicate check-in prevention

#### Scan QR Code (API)

```typescript
// POST /api/checkin
const response = await fetch('/api/checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    qrData: '{"type":"BOOKING_CHECKIN","bookingId":"123","timestamp":1234567890}',
  }),
});
```

### QR Code Security

- QR codes contain encrypted booking data
- Timestamp validation (24-hour validity)
- One-time use (duplicate check-in prevention)
- Server-side validation

---

## 4. Analytics & Monitoring

### 4.1 Vercel Analytics

#### Setup

1. **Automatic** - Works out of the box when deployed to Vercel
2. **Component Added** - `<Analytics />` in root layout

#### Features
- Real user monitoring (RUM)
- Core Web Vitals tracking
- Page performance metrics
- Audience insights

#### View Analytics
- Deploy to Vercel
- Go to Project > Analytics tab

### 4.2 Sentry Error Tracking

#### Setup

1. **Create Sentry Account**
   - Sign up at https://sentry.io
   - Create new project (Next.js)
   - Get DSN from Project Settings

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

3. **Sentry is Configured**
   - Client-side: `sentry.client.config.ts`
   - Server-side: `sentry.server.config.ts`
   - Edge runtime: `sentry.edge.config.ts`

#### Features

✅ Automatic error capturing
✅ Performance monitoring
✅ Session replay (errors only)
✅ Source maps upload
✅ Release tracking

#### Monitoring

```typescript
// Manual error capture
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}

// Add context
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setContext('booking', { bookingId: '123' });
```

### 4.3 Database Monitoring

Use Supabase Dashboard for database monitoring:

1. **Query Performance**
   - Go to Supabase > Database > Query Performance
   - Identify slow queries
   - Add indexes if needed

2. **Real-time Logs**
   - Go to Supabase > Logs
   - Filter by severity

3. **Table Insights**
   - Row counts
   - Storage usage
   - Index usage

---

## 5. Performance Optimizations

### 5.1 Image Optimization

#### Next.js Image Component

```tsx
import Image from 'next/image';

// Optimized image
<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority // For above-the-fold images
  placeholder="blur" // Optional: requires blurDataURL
/>

// External images
<Image
  src="https://example.com/image.jpg"
  alt="External"
  width={300}
  height={300}
  unoptimized={false} // Next.js will optimize
/>
```

#### Configuration
- **Formats**: AVIF, WebP (automatic)
- **Responsive**: Multiple device sizes
- **Lazy Loading**: Automatic for below-fold images
- **CDN**: Automatic when deployed to Vercel

### 5.2 Code Splitting & Lazy Loading

#### Dynamic Imports

```tsx
import dynamic from 'next/dynamic';

// Lazy load component
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Optional: disable SSR for client-only components
});

// Usage
<HeavyComponent />
```

#### Route-based Code Splitting
Automatic with Next.js App Router - each page is a separate chunk.

### 5.3 TanStack Query Caching

#### Global Configuration
Already configured in `src/components/providers.tsx`:

- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Retry**: 2 times with exponential backoff
- **Refetch on Window Focus**: Development only

#### Custom Cache Times

```typescript
import { useQuery } from '@tanstack/react-query';

// Short cache (1 minute) for real-time data
const { data } = useQuery({
  queryKey: ['bookings'],
  queryFn: fetchBookings,
  staleTime: 60 * 1000,
});

// Long cache (30 minutes) for static data
const { data } = useQuery({
  queryKey: ['classes'],
  queryFn: fetchClasses,
  staleTime: 30 * 60 * 1000,
});
```

### 5.4 Bundle Size Optimization

#### Analyze Bundle

```bash
ANALYZE=true pnpm build
```

View reports in `.next/analyze/`

#### Optimizations Applied

- Console logs removed in production (errors/warnings kept)
- Tree shaking enabled
- Package imports optimized (lucide-react, @tanstack/react-query)
- CSS optimization enabled

### 5.5 Security Headers

Added security headers in `next.config.js`:

- `X-DNS-Prefetch-Control`: DNS prefetching
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `Referrer-Policy`: Control referrer information

---

## 6. Environment Variables

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Xendit
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Gym System <noreply@yourdomain.com>

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3003
NEXT_PUBLIC_USER_APP_URL=http://localhost:3001

# Sentry (Optional but recommended)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token

# Node Environment
NODE_ENV=development
```

### Optional Variables

```env
# Vercel Analytics (automatic when deployed to Vercel)
# No env vars needed

# Bundle Analysis
ANALYZE=true # Set when running build to analyze bundle size
```

---

## Testing

### Payment Testing (Xendit)

Use Xendit test mode:
- Test cards: https://docs.xendit.co/test-cards
- Test virtual accounts: Use any amount
- Test e-wallets: Use test phone numbers

### Email Testing (Resend)

In development:
- Emails are sent to your verified email
- Use Resend Dashboard to view all emails

### QR Code Testing

1. Generate QR code for a booking
2. Open `/checkin` page
3. Scan QR code with camera or upload QR image
4. Verify check-in success

---

## Deployment Checklist

### Pre-deployment

- [ ] Set all production environment variables
- [ ] Configure Xendit webhooks with production URL
- [ ] Verify domain in Resend
- [ ] Create Sentry project and set DSN
- [ ] Test payment flows in Xendit test mode
- [ ] Test email delivery
- [ ] Test QR code scanning

### Post-deployment

- [ ] Verify Vercel Analytics is collecting data
- [ ] Verify Sentry is receiving errors
- [ ] Test payment webhooks with real transactions
- [ ] Monitor email delivery rates
- [ ] Check bundle size and performance metrics

---

## Troubleshooting

### Payments Not Working

1. Check Xendit API key is correct
2. Verify webhook URL is accessible
3. Check webhook token matches
4. Review Xendit Dashboard > Logs

### Emails Not Sending

1. Verify Resend API key
2. Check FROM email is verified
3. Review Resend Dashboard > Logs
4. Check rate limits

### QR Scanner Not Working

1. Allow camera permissions in browser
2. Use HTTPS (required for camera access)
3. Check QR code data format
4. Verify booking exists in database

### Sentry Not Capturing Errors

1. Verify DSN is correct
2. Check Sentry project settings
3. Ensure errors are being thrown
4. Review Sentry quota

---

## Support & Resources

- **Xendit Docs**: https://docs.xendit.co
- **Resend Docs**: https://resend.com/docs
- **Sentry Docs**: https://docs.sentry.io
- **Next.js Docs**: https://nextjs.org/docs
- **TanStack Query Docs**: https://tanstack.com/query/latest

---

## Future Enhancements

- [ ] Auto-renewal cron job
- [ ] Supabase Edge Functions for email triggers
- [ ] WhatsApp notifications (via Twilio)
- [ ] SMS reminders
- [ ] Multi-currency support
- [ ] Subscription management
- [ ] Advanced analytics dashboard
- [ ] A/B testing integration

---

*Last Updated: 2025-01-06*
