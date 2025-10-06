# 🚀 Quick Test Admin Setup Guide

## How Admin Authentication Works

The admin dashboard uses **2-level authentication**:

1. **Supabase Auth** (`auth.users`) - Handles login/password
2. **Admin Users Table** (`admin_users`) - Determines if user can access admin dashboard

**Flow:**
```
User Login → Check auth.users → Check admin_users table → Grant/Deny Access
```

A user must exist in BOTH tables to access the admin dashboard!

---

## 📋 Quick Setup (2 Methods)

### Method 1: Via Supabase Dashboard (RECOMMENDED)

**Step 1: Create Auth User**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: **Authentication** > **Users**
4. Click **"Add user"** > **"Create new user"**
5. Fill in:
   ```
   Email: admin@test.com
   Password: Admin123!
   ☑️ Auto Confirm User (CHECK THIS!)
   ```
6. Click **"Create user"**
7. **COPY THE USER UID** (e.g., `550e8400-e29b-41d4-a716-446655440000`)

**Step 2: Run SQL to Add to Admin Tables**

1. Go to **SQL Editor** in Supabase
2. Paste this (replace `YOUR_USER_ID` with the UID you copied):

```sql
-- Insert into users table
INSERT INTO public.users (id, email, role, full_name, phone)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- 👈 REPLACE THIS
  'admin@test.com',
  'admin',
  'Admin Test User',
  '+6281234567890'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'Admin Test User';

-- Insert into admin_users table
INSERT INTO public.admin_users (user_id, role, is_active, permissions)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- 👈 REPLACE THIS
  'admin',
  true,
  '{
    "manage_users": true,
    "manage_classes": true,
    "manage_payments": true,
    "manage_bookings": true,
    "manage_trainers": true,
    "manage_settings": true,
    "view_analytics": true
  }'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin', is_active = true;

-- Verify success
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role as user_role,
  au.role as admin_role,
  au.is_active
FROM users u
LEFT JOIN admin_users au ON u.id = au.user_id
WHERE u.email = 'admin@test.com';
```

3. Click **"Run"**
4. Should see success message with user details

**Step 3: Login**

1. Go to: http://localhost:3003
2. Login with:
   - Email: `admin@test.com`
   - Password: `Admin123!`
3. You should see the admin dashboard! 🎉

---

### Method 2: Convert Existing User to Admin

If you already created a user via the user app (http://localhost:3001):

**Step 1: Find Your User ID**

Run this in Supabase SQL Editor:

```sql
-- List recent users
SELECT id, email, full_name, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

**Step 2: Copy the ID of the user you want to make admin**

**Step 3: Run this SQL (replace `YOUR_USER_ID`):**

```sql
-- Update user role
UPDATE users
SET role = 'admin'
WHERE id = 'YOUR_USER_ID_HERE'::uuid;

-- Add to admin_users
INSERT INTO admin_users (user_id, role, is_active, permissions)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- 👈 REPLACE THIS
  'admin',
  true,
  '{"manage_users": true, "manage_classes": true, "manage_payments": true, "manage_bookings": true}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin', is_active = true;

-- Verify
SELECT u.email, u.role, au.role as admin_role, au.is_active
FROM users u
LEFT JOIN admin_users au ON u.id = au.user_id
WHERE u.id = 'YOUR_USER_ID_HERE'::uuid;
```

**Step 4: Logout and Login again** to see admin dashboard

---

## 🧪 Create Multiple Test Users

### Test Admin
```sql
-- After creating auth user with email: admin@test.com
-- Replace USER_ID below

INSERT INTO public.users (id, email, role, full_name, phone)
VALUES ('USER_ID'::uuid, 'admin@test.com', 'admin', 'Admin Test', '+6281234567890')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

INSERT INTO public.admin_users (user_id, role, is_active, permissions)
VALUES ('USER_ID'::uuid, 'admin', true, '{"manage_users": true, "manage_classes": true, "manage_payments": true}'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', is_active = true;
```

### Test Trainer
```sql
-- After creating auth user with email: trainer@test.com
-- Replace USER_ID below

INSERT INTO public.users (id, email, role, full_name, phone)
VALUES ('USER_ID'::uuid, 'trainer@test.com', 'trainer', 'Trainer Test', '+6281234567891')
ON CONFLICT (id) DO UPDATE SET role = 'trainer';

INSERT INTO public.admin_users (user_id, role, is_active, permissions)
VALUES ('USER_ID'::uuid, 'trainer', true, '{"manage_classes": true, "view_bookings": true}'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET role = 'trainer', is_active = true;

-- Also add to trainers table
INSERT INTO trainers (user_id, specialization, bio, years_experience)
VALUES (
  'USER_ID'::uuid,
  ARRAY['Yoga', 'HIIT'],
  'Expert fitness trainer with 5 years experience',
  5
)
ON CONFLICT (user_id) DO UPDATE
SET specialization = ARRAY['Yoga', 'HIIT'];
```

### Test Member (Regular User)
```sql
-- After creating auth user with email: member@test.com
-- Replace USER_ID below

INSERT INTO public.users (id, email, role, full_name, phone)
VALUES ('USER_ID'::uuid, 'member@test.com', 'member', 'Member Test', '+6281234567892')
ON CONFLICT (id) DO UPDATE SET role = 'member';

-- Members don't need admin_users entry
-- They access via user-webapp (localhost:3001)
```

---

## 🔍 Verification Commands

### Check All Admin Users
```sql
SELECT
  u.email,
  u.full_name,
  u.role as user_role,
  au.role as admin_role,
  au.is_active,
  au.last_login
FROM admin_users au
JOIN users u ON au.user_id = u.id
WHERE au.is_active = true
ORDER BY au.created_at DESC;
```

### Check Specific User
```sql
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role as user_role,
  au.role as admin_role,
  au.is_active,
  au.permissions
FROM users u
LEFT JOIN admin_users au ON u.id = au.user_id
WHERE u.email = 'admin@test.com';
```

### Make User Active/Inactive
```sql
-- Deactivate
UPDATE admin_users
SET is_active = false
WHERE user_id = 'USER_ID'::uuid;

-- Activate
UPDATE admin_users
SET is_active = true
WHERE user_id = 'USER_ID'::uuid;
```

---

## 🚨 Troubleshooting

### "Access Denied" or Redirected to /unauthorized

**Cause:** User not in `admin_users` table or `is_active = false`

**Fix:**
```sql
-- Check if user exists in admin_users
SELECT * FROM admin_users WHERE user_id = (
  SELECT id FROM users WHERE email = 'your@email.com'
);

-- If not found, add them:
INSERT INTO admin_users (user_id, role, is_active)
SELECT id, 'admin', true FROM users WHERE email = 'your@email.com'
ON CONFLICT (user_id) DO UPDATE SET is_active = true;
```

### User Redirected to /trainer Instead of Dashboard

**Cause:** User has `role = 'trainer'` in admin_users

**Fix:**
```sql
-- Change to admin
UPDATE admin_users
SET role = 'admin'
WHERE user_id = (SELECT id FROM users WHERE email = 'your@email.com');
```

### Can't Find User in Database

**Cause:** User was created in auth but not in public.users table

**Fix:**
```sql
-- Get user ID from auth
-- Then insert into users:
INSERT INTO users (id, email, role, full_name)
VALUES (
  'USER_ID_FROM_AUTH'::uuid,
  'email@test.com',
  'admin',
  'Full Name'
);
```

---

## 📊 Understanding the Tables

### `auth.users` (Managed by Supabase)
- Handles authentication (email/password)
- Auto-created when user signs up
- Cannot directly edit

### `public.users` (Your app data)
- Stores user profile info
- Has `role` field: 'member', 'trainer', or 'admin'
- Synced with auth.users via trigger (if implemented)

### `public.admin_users` (Admin access control)
- **Required** for admin dashboard access
- Has `role` field: 'admin' or 'trainer'
- Has `is_active` field: must be `true`
- Has `permissions` field: JSONB of capabilities

**A user needs:**
1. Entry in `auth.users` (for login)
2. Entry in `public.users` with `role = 'admin'`
3. Entry in `public.admin_users` with `role = 'admin'` and `is_active = true`

---

## ✅ Success Checklist

After setup, you should be able to:

- [ ] Login at http://localhost:3003
- [ ] See admin dashboard (not /unauthorized page)
- [ ] View sidebar menu (Dashboard, Members, Classes, etc.)
- [ ] Navigate to different pages
- [ ] See your name in top-right corner

If all checked ✅, you're good to go!

---

## 🎯 Next Steps

1. **Setup Bank Accounts**: Settings > Bank Accounts
2. **Create Test Classes**: Classes > Add Class
3. **Create Test Members**: Either via SQL or user signup at localhost:3001
4. **Test Payment Flow**: Manual Payments > Create Payment
5. **Test QR Check-in**: Check-in page

---

## 📞 Need Help?

If stuck, check:
1. Browser console for errors
2. Supabase logs: Dashboard > Logs
3. Middleware.ts file (apps/admin-dashboard/middleware.ts)
4. useAuth.ts hook (apps/admin-dashboard/src/hooks/useAuth.ts)

Common issues are usually:
- User not in admin_users table
- is_active = false
- Wrong role in admin_users
- Auth session expired (logout/login again)
