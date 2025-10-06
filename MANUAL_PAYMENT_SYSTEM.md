# Manual Payment System Documentation

## 📋 Overview

Manual Payment System adalah solusi **100% GRATIS** untuk menerima pembayaran tanpa menggunakan payment gateway berbayar seperti Xendit. Sistem ini cocok untuk:

- ✅ Development & Testing
- ✅ MVP (Minimum Viable Product)
- ✅ Gym kecil-menengah (< 500 members)
- ✅ Budget terbatas
- ✅ Preferensi full control atas payments

---

## 🎯 Features

### Admin Features
- ✅ **Payment Confirmation Dashboard** - Review & confirm payments
- ✅ **View Payment Proof** - Lihat bukti transfer yang diupload user
- ✅ **One-Click Confirmation** - Approve payment dengan 1 klik
- ✅ **Rejection with Reason** - Reject payment dengan alasan
- ✅ **Bank Account Management** - Kelola rekening bank untuk terima transfer
- ✅ **Auto Email Notifications** - Otomatis kirim email:
  - Payment instructions saat create payment
  - Payment receipt saat confirm payment
- ✅ **Auto Membership Activation** - Membership otomatis aktif setelah payment confirmed
- ✅ **Real-time Updates** - Auto refresh setiap 30 detik

### User Features
- ✅ **Payment Instructions** - Detail bank account untuk transfer
- ✅ **Upload Payment Proof** - Upload bukti transfer (JPG, PNG, WebP, max 5MB)
- ✅ **Payment Status Tracking** - Track status payment (pending/completed/rejected)
- ✅ **Email Notifications** - Terima email:
  - Payment instructions dengan bank details
  - Payment confirmation receipt

---

## 🚀 Setup Guide

### Step 1: Configure Bank Accounts

1. **Login sebagai Admin**
2. **Navigate to Settings > Bank Accounts** atau `/settings/bank-accounts`
3. **Click "Add Bank Account"**
4. **Fill in details:**
   - Bank Name: BCA, BNI, BRI, Mandiri, dll
   - Account Number: Nomor rekening
   - Account Name: Nama pemilik rekening

5. **Click "Save Changes"**

**Example:**
```
Bank: BCA
Account Number: 1234567890
Account Name: Gym System Indonesia
```

### Step 2: Create Payment Transaction

**API Endpoint:**
```typescript
POST /api/payments/manual/create

Body:
{
  "userId": "user-id-123",
  "membershipId": "membership-id-456", // Optional
  "amount": 500000,
  "type": "membership", // or "class", "product", etc
  "description": "Premium Membership - 3 Months"
}

Response:
{
  "success": true,
  "transaction": {
    "id": "payment-123",
    "amount": 500000,
    "status": "pending",
    ...
  },
  "bankAccounts": {
    "bca": {
      "account": "1234567890",
      "name": "Gym System"
    },
    ...
  },
  "message": "Payment transaction created. Instructions sent to email."
}
```

**What Happens:**
1. Payment transaction created with status `pending`
2. Email sent to user dengan:
   - Bank account details
   - Amount to transfer
   - Payment instructions
   - Invoice number

### Step 3: User Uploads Payment Proof

**API Endpoint:**
```typescript
POST /api/payments/manual/upload-proof

Body: FormData
- paymentId: "payment-123"
- file: [image file]

Response:
{
  "success": true,
  "proofUrl": "https://...storage.../payment-proof.jpg",
  "message": "Payment proof uploaded successfully"
}
```

**Validation:**
- ✅ File type: JPG, JPEG, PNG, WebP only
- ✅ Max size: 5MB
- ✅ Uploaded to Supabase Storage bucket `payment-proofs`
- ✅ Public URL stored in payment metadata

### Step 4: Admin Confirms Payment

1. **Navigate to "Manual Payments"** (`/payments/manual`)
2. **See list of pending payments** dengan info:
   - Member name & email
   - Amount
   - Payment type
   - Upload date
   - Payment proof (if uploaded)

3. **Click "View Proof"** untuk lihat bukti transfer
4. **Click "Confirm Payment"**:
   - Add optional notes
   - Click "Confirm Payment"

**What Happens:**
1. Payment status updated to `completed`
2. Membership (if applicable) activated
3. Email receipt sent to user
4. Available in payment history

---

## 🔄 Payment Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Create Payment
       ▼
┌─────────────────────────┐
│ System creates payment  │
│ Status: PENDING         │
│ Sends email with bank   │
│ account details         │
└──────┬──────────────────┘
       │
       │ 2. User transfers
       │    to bank account
       ▼
┌─────────────────────────┐
│ User uploads proof      │
│ (screenshot/photo)      │
└──────┬──────────────────┘
       │
       │ 3. Admin reviews
       ▼
┌─────────────────────────┐
│ Admin confirms payment  │
│ Status: COMPLETED       │
│ Membership activated    │
│ Email receipt sent      │
└─────────────────────────┘
```

---

## 📡 API Reference

### 1. Create Manual Payment

**Endpoint:** `POST /api/payments/manual/create`

**Request:**
```json
{
  "userId": "required - user ID",
  "membershipId": "optional - membership ID",
  "amount": "required - amount in IDR",
  "type": "optional - payment type (default: 'membership')",
  "description": "optional - payment description"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { ... },
  "bankAccounts": { ... },
  "message": "Payment transaction created..."
}
```

---

### 2. Upload Payment Proof

**Endpoint:** `POST /api/payments/manual/upload-proof`

**Request:** `multipart/form-data`
- `paymentId`: string (required)
- `file`: File (required, image only, max 5MB)

**Response:**
```json
{
  "success": true,
  "proofUrl": "https://...storage.../file.jpg",
  "message": "Payment proof uploaded successfully"
}
```

**Errors:**
- `400` - Invalid file type or size
- `404` - Payment not found
- `500` - Upload failed

---

### 3. Confirm Payment

**Endpoint:** `POST /api/payments/manual/confirm`

**Request:**
```json
{
  "paymentId": "required - payment ID",
  "notes": "optional - confirmation notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

**Side Effects:**
- Payment status → `completed`
- Membership activated (if applicable)
- Email receipt sent to user

---

### 4. Reject Payment

**Endpoint:** `POST /api/payments/manual/reject`

**Request:**
```json
{
  "paymentId": "required - payment ID",
  "reason": "required - rejection reason"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment rejected successfully"
}
```

**Side Effects:**
- Payment status → `failed`
- Rejection reason saved in metadata

---

## 🗄️ Database Schema

### Payment Transactions Table

```sql
payment_transactions (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users,
  membership_id: uuid REFERENCES memberships (nullable),
  amount: numeric NOT NULL,
  payment_method: text DEFAULT 'bank_transfer',
  type: text DEFAULT 'membership',
  status: text DEFAULT 'pending', -- pending, completed, failed
  metadata: jsonb DEFAULT '{}',
  created_at: timestamp,
  updated_at: timestamp
)
```

### Metadata Structure

```json
{
  "payment_type": "manual",
  "description": "Premium Membership",
  "bank_accounts": { ... },
  "proof_url": "https://...storage.../proof.jpg",
  "proof_uploaded_at": "2025-01-06T10:30:00Z",
  "confirmed_at": "2025-01-06T12:00:00Z",
  "confirmed_by": "admin",
  "confirmation_notes": "Payment verified via BCA",
  "rejected_at": null,
  "rejection_reason": null
}
```

---

## 📧 Email Templates

### 1. Payment Instructions Email

**Sent:** When payment is created

**Contains:**
- Bank account details (all configured banks)
- Amount to transfer (exact amount)
- Step-by-step instructions
- Invoice number
- Upload proof reminder

### 2. Payment Receipt Email

**Sent:** When payment is confirmed

**Contains:**
- Payment confirmation
- Amount paid
- Payment method (Bank Transfer)
- Invoice number
- Membership activation info

---

## 🔐 Security Features

### File Upload Security
- ✅ Type validation (images only)
- ✅ Size limit (5MB max)
- ✅ Unique filename generation
- ✅ Secure storage (Supabase Storage)
- ✅ Public URLs only for confirmed payments

### Payment Validation
- ✅ User ownership verification
- ✅ Duplicate confirmation prevention
- ✅ Status validation
- ✅ Amount tampering protection

### Admin Actions
- ✅ Admin-only access
- ✅ Audit trail (metadata tracks who confirmed/rejected)
- ✅ Notes for documentation

---

## 🎨 UI Components

### Admin Dashboard (`/payments/manual`)

**Features:**
- Real-time pending payments list
- Auto-refresh every 30 seconds
- Quick actions (Confirm/Reject)
- View payment proof modal
- Confirmation modal with notes
- Rejection modal with reason
- Empty state with CTA

**Columns:**
- Member (name + email)
- Amount
- Type
- Payment Proof (button or badge)
- Created Date
- Actions (Confirm/Reject buttons)

---

### Bank Settings (`/settings/bank-accounts`)

**Features:**
- Add multiple bank accounts
- Edit/delete accounts
- Bank selection dropdown
- Account number formatting
- Visual bank cards
- Instructions panel

**Fields per Account:**
- Bank Name (dropdown)
- Account Number (numeric)
- Account Name (text)

---

## 💡 Best Practices

### For Admins

1. **Check Payment Proof Carefully**
   - Verify amount matches
   - Check transfer date
   - Verify sender name
   - Look for edited screenshots

2. **Use Confirmation Notes**
   - Document verification details
   - Note any discrepancies
   - Reference number from proof

3. **Quick Response Time**
   - Aim for < 24 hours confirmation
   - Set up notifications
   - Check dashboard regularly

4. **Handle Rejections Professionally**
   - Provide clear rejection reason
   - Suggest how to fix (if applicable)
   - Contact user if unclear

### For Users

1. **Transfer Exact Amount**
   - Don't round up/down
   - Include admin fees if applicable

2. **Upload Clear Proof**
   - Full screenshot showing:
     - Amount
     - Date
     - Destination account
     - Transaction ID
   - Don't crop important details

3. **Wait for Confirmation**
   - Usually 1-24 hours
   - Check email for updates
   - Don't create duplicate payments

---

## 🆚 Manual Payment vs Xendit

| Feature | Manual Payment | Xendit |
|---------|---------------|--------|
| **Cost** | FREE | 0.7% - 3% per transaction |
| **Setup Time** | 5 minutes | 1-2 days (verification) |
| **Payment Methods** | Bank Transfer only | VA, QRIS, E-wallet, Cards |
| **Confirmation** | Manual (admin) | Automatic (instant) |
| **Response Time** | 1-24 hours | Instant |
| **Maintenance** | Low | None |
| **Best For** | Small gyms, MVP | Growing gyms, scale |

---

## 🔄 Migration to Xendit (Future)

Jika suatu saat Anda ingin upgrade ke Xendit:

1. **Code sudah siap!** Xendit integration sudah ada di:
   - `src/lib/services/xendit.service.ts`
   - `src/app/api/payments/create/route.ts`

2. **Tinggal:**
   - Sign up Xendit
   - Add API keys ke `.env`
   - Enable Xendit payment methods
   - **Manual payment tetap bisa digunakan bersamaan!**

3. **Tidak perlu rewrite** - Architecture sudah support both methods

---

## 📊 Usage Statistics

### Typical Payment Flow Times

- Payment Creation: < 1 second
- User Transfer: 1-30 minutes (depends on bank)
- Proof Upload: < 5 seconds
- Admin Confirmation: 1-24 hours (depends on admin availability)
- **Total**: ~1-24 hours average

### Scalability

- ✅ Handles: Up to 500 pending payments smoothly
- ✅ Storage: Unlimited (Supabase Storage)
- ✅ Email: 3,000/month free (Resend)

---

## 🐛 Troubleshooting

### "Failed to upload proof"

**Cause:** File too large or wrong format

**Solution:**
- Check file size (max 5MB)
- Check format (JPG, PNG, WebP only)
- Compress image if needed

---

### "Payment not found"

**Cause:** Invalid payment ID

**Solution:**
- Verify payment ID is correct
- Check if payment exists in database
- Ensure user has access to this payment

---

### "Failed to send email"

**Cause:** Resend API issue or invalid email

**Solution:**
- Check Resend API key
- Verify email address is valid
- Check Resend logs
- Ensure not hitting rate limits

---

### Supabase Storage bucket not found

**Setup Needed:**
1. Go to Supabase Dashboard
2. Storage > Create bucket: `payment-proofs`
3. Make it public
4. Add RLS policies if needed

---

## ✅ Testing Checklist

### Admin Testing

- [ ] Can view pending payments list
- [ ] Can view payment proof images
- [ ] Can confirm payments successfully
- [ ] Membership activates after confirmation
- [ ] Email receipt sent after confirmation
- [ ] Can reject payments with reason
- [ ] Can add/edit bank accounts
- [ ] Bank accounts saved correctly

### User Testing (Manual)

- [ ] Create test payment
- [ ] Receive email with instructions
- [ ] Upload payment proof
- [ ] File upload works
- [ ] Proof appears in admin dashboard
- [ ] Receive confirmation email
- [ ] Membership activated

---

## 🎓 Support & Resources

### Internal Resources
- Main Docs: `ADVANCED_FEATURES.md`
- API Docs: This file
- Code: `apps/admin-dashboard/src/app/`

### External Resources
- Supabase Storage: https://supabase.com/docs/guides/storage
- Resend Email: https://resend.com/docs
- Next.js: https://nextjs.org/docs

---

## 🚀 Future Enhancements

- [ ] Auto-detect payment amount from uploaded image (OCR)
- [ ] WhatsApp notifications
- [ ] Bulk payment confirmation
- [ ] Payment reminders (auto-send after 24h)
- [ ] Analytics dashboard
- [ ] Export payment reports
- [ ] Mobile app integration

---

*Last Updated: 2025-01-06*
*Version: 1.0.0*
