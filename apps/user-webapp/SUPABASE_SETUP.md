# Supabase Setup Guide untuk User WebApp

## Status Saat Ini

✅ **Environment variables sudah dikonfigurasi**
✅ **Development server running di http://localhost:3001**
✅ **Database schema migrations sudah tersedia**

---

## Yang Perlu Dilakukan

Karena Anda sudah memiliki Supabase project dengan credentials di `.env.local`, sekarang Anda perlu menjalankan migrations untuk membuat semua database tables.

### Opsi 1: Menggunakan Supabase CLI (Recommended)

1. **Install Supabase CLI** (jika belum):
```bash
npm install -g supabase
```

2. **Login ke Supabase**:
```bash
supabase login
```

3. **Link project Anda**:
```bash
supabase link --project-ref lcvaffwkfipwqcqcbjjv
```

4. **Push migrations ke database**:
```bash
supabase db push
```

### Opsi 2: Manual via Supabase Dashboard

1. Buka **Supabase Dashboard**: https://supabase.com/dashboard/project/lcvaffwkfipwqcqcbjjv

2. Klik **SQL Editor** di sidebar kiri

3. Jalankan migrations dalam urutan berikut:

#### Migration 1: Initial Schema
Copy dan paste isi file:
```
supabase/migrations/20250101000000_initial_schema.sql
```
Lalu klik **RUN**

#### Migration 2: RLS Policies
Copy dan paste isi file:
```
supabase/migrations/20250101000001_rls_policies.sql
```
Lalu klik **RUN**

#### Migration 3: Functions
Copy dan paste isi file:
```
supabase/migrations/20250101000002_functions.sql
```
Lalu klik **RUN**

#### Migration 4: WebApp Adjustments
Copy dan paste isi file:
```
supabase/migrations/20250104000000_webapp_adjustments.sql
```
Lalu klik **RUN**

---

## Tables yang Akan Dibuat

Setelah menjalankan migrations, tables berikut akan tersedia:

### Core Tables
- `users` - User profiles (extends auth.users)
- `instructors` - Gym instructors/trainers
- `classes` - Class types (Yoga, Pilates, etc.)
- `class_schedules` - Class timetable/schedule
- `bookings` - User class bookings
- `waitlist` - Waitlist for full classes

### Membership Tables
- `membership_plans` - Available membership plans
- `memberships` - User memberships
- `payments` - Payment history

### Other Tables
- `notifications` - User notifications
- `attendance` - Check-in/check-out records
- `equipment` - Gym equipment management

---

## Seed Data (Optional)

Untuk testing, Anda bisa menjalankan seed data:

```bash
supabase db seed
```

Atau manual via SQL Editor, copy dan paste isi file:
```
supabase/seed.sql
```

---

## Verifikasi Setup

Setelah migrations selesai:

1. **Cek di Dashboard**:
   - Pergi ke **Database** → **Tables**
   - Pastikan semua tables sudah ada

2. **Test di WebApp**:
   - Buka http://localhost:3001
   - Coba register user baru
   - Login dan explore fitur-fitur

---

## Row Level Security (RLS)

RLS policies sudah dikonfigurasi untuk:

✅ Users hanya bisa read/update profile mereka sendiri
✅ Users bisa lihat semua classes & schedules
✅ Users hanya bisa manage bookings mereka sendiri
✅ Users bisa create memberships untuk diri sendiri
✅ Users hanya bisa lihat notifications mereka sendiri

---

## Troubleshooting

### Error: "column already exists" atau "relation already exists"
➡️ **SOLUSI**: Migration sudah pernah dijalankan sebagian. Ini normal, skip error dan lanjutkan ke migration berikutnya.

Atau, jalankan fix script:
```sql
-- Copy paste di SQL Editor:
supabase/migrations/20250104000001_fix_errors.sql
```

### Error: "relation does not exist"
➡️ Migrations belum dijalankan. Jalankan migrations di atas dalam urutan yang benar.

### Error: "JWT expired" atau "Invalid API key"
➡️ Check `.env.local`, pastikan credentials benar.

### Error: "permission denied"
➡️ RLS policies belum di-apply. Jalankan migration RLS policies.

### Server error setelah login
➡️ Pastikan `users` table sudah ada dan RLS policies sudah di-apply.

### Error saat rename column "phone" ke "phone_number"
➡️ **SOLUSI**: Column sudah di-rename sebelumnya. Ini normal, migration script sudah diperbaiki untuk handle ini.

---

## Environment Variables

File `.env.local` di apps/user-webapp sudah berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lcvaffwkfipwqcqcbjjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Sudah configured dan ready to use!**

---

## Next Steps

1. ✅ Jalankan migrations (pilih Opsi 1 atau 2 di atas)
2. ✅ (Optional) Jalankan seed data untuk testing
3. ✅ Buka http://localhost:3001 dan mulai test aplikasi!
4. ✅ Register user baru dan explore semua fitur

---

## API Endpoints yang Tersedia

WebApp akan menggunakan Supabase client untuk:

- **Auth**: Login, Register, Logout, Password Reset
- **Classes**: Browse classes, view schedules
- **Bookings**: Book class, cancel booking, view history
- **Membership**: View plan, payment history, usage stats
- **Profile**: Update info, change password, upload avatar
- **Notifications**: View, mark as read

Semua sudah terimplementasi dengan TypeScript + Zod validation! 🎉
