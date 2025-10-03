# 🚀 Cara Apply Database Migrations

Karena Supabase CLI tidak support di Windows, kita akan apply migrations manual via Supabase Dashboard.

## 📋 Langkah-langkah:

### Step 1: Buka Supabase Dashboard
1. Buka browser: https://app.supabase.com
2. Login dengan akun Anda
3. Pilih project: **lcvaffwkfipwqcqcbjjv**

### Step 2: Buka SQL Editor
1. Di sidebar kiri, klik **SQL Editor**
2. Klik **New Query**

### Step 3: Apply Migration 1 - Initial Schema

Copy paste **SEMUA** isi file ini ke SQL Editor:
```
supabase/migrations/20250101000000_initial_schema.sql
```

Lalu klik **RUN** (atau tekan Ctrl+Enter)

**Cek hasil:**
- Tidak ada error merah
- Di bagian bawah muncul "Success. No rows returned"
- Klik **Table Editor** di sidebar → harus muncul 10 tables

### Step 4: Apply Migration 2 - RLS Policies

Buat **New Query** lagi, copy paste isi file:
```
supabase/migrations/20250101000001_rls_policies.sql
```

Klik **RUN**

**Cek hasil:**
- Pilih salah satu table di Table Editor
- Klik tab **Policies**
- Harus ada beberapa policies

### Step 5: Apply Migration 3 - Functions

Buat **New Query** lagi, copy paste isi file:
```
supabase/migrations/20250101000002_functions.sql
```

Klik **RUN**

**Cek hasil:**
- Klik **Database** di sidebar
- Klik **Functions**
- Harus ada 11 functions

### Step 6: Apply Seed Data (Optional)

Jika ingin data sample untuk testing:

Buat **New Query** lagi, copy paste isi file:
```
supabase/seed.sql
```

⚠️ **PENTING:** Seed data membutuhkan auth users!

**Cara buat auth users:**
1. Klik **Authentication** di sidebar
2. Klik **Users** → **Add user** → **Create new user**
3. Buat user dengan email: `admin@gymfit.com`
4. Set password
5. **COPY User UID yang muncul**
6. Edit `supabase/seed.sql`, ganti UUID dengan UID tadi
7. Baru jalankan seed.sql di SQL Editor

---

## ✅ Verifikasi

Setelah semua migration dijalankan:

### Cek Tables:
Klik **Table Editor**, harus ada:
- [ ] users
- [ ] trainers
- [ ] memberships
- [ ] classes
- [ ] schedules
- [ ] bookings
- [ ] attendance
- [ ] payments
- [ ] equipment
- [ ] notifications

### Cek RLS Policies:
- Pilih table → tab **Policies**
- Harus ada policies, RLS enabled

### Cek Functions:
- **Database** → **Functions**
- Harus ada 11 functions

---

## 🎉 Done!

Setelah semua migration berhasil, jalankan:

```bash
pnpm dev
```

Buka: http://localhost:3001
