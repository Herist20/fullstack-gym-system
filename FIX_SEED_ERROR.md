# 🔧 Fix Seed Error - Foreign Key Constraint

## ❌ Error Yang Terjadi:

```
ERROR: insert or update on table "users" violates foreign key constraint "users_id_fkey"
DETAIL: Key (id)=(00000000-0000-0000-0000-000000000001) is not present in table "users".
```

## 📖 Penjelasan:

Table `public.users` punya **foreign key ke `auth.users`**. Jadi sebelum insert ke `public.users`, user harus exist di `auth.users` dulu.

Seed data menggunakan dummy UUIDs yang tidak ada di auth.users → error!

---

## ✅ **SOLUSI 1: Gunakan Seed Simple (TERMUDAH!)**

Gunakan seed data yang sudah saya buat tanpa perlu auth users:

### **Step 1: Apply Seed Simple**

```sql
-- Copy paste file ini di SQL Editor:
supabase/seed_simple.sql
```

**Isi:**
- ✅ 9 Classes (tanpa trainer)
- ✅ 20 Equipment items
- ❌ No users/memberships/bookings (tambah manual nanti)

**Cara:**
1. SQL Editor → New Query
2. Copy paste isi `seed_simple.sql`
3. RUN

### **Step 2: Buat Users Manual (Optional)**

Setelah itu, bisa buat users manual via:

**Via Supabase Auth:**
1. Authentication → Users → Add user
2. Email: `admin@gymfit.com`
3. Password: (pilihan Anda)
4. Auto Confirm ✅
5. Create

**Via SQL (setelah auth user dibuat):**
```sql
-- Setelah buat auth user, copy UID nya
-- Lalu insert ke public.users:

INSERT INTO public.users (id, email, role, full_name, phone)
VALUES
  ('<paste-uid-here>', 'admin@gymfit.com', 'admin', 'Admin User', '+62812345678');
```

---

## ✅ **SOLUSI 2: Buat Auth Users Dulu, Lalu Seed Lengkap**

Jika mau seed data lengkap (10 users + semua data):

### **Step 1: Buat 10 Auth Users**

Buka: https://app.supabase.com/project/lcvaffwkfipwqcqcbjjv/auth/users

**Buat users ini (klik Add user → Create new user):**

| Email | Password | Role |
|-------|----------|------|
| admin@gymfit.com | admin123 | Admin |
| john.trainer@gymfit.com | john123 | Trainer |
| sarah.trainer@gymfit.com | sarah123 | Trainer |
| mike.trainer@gymfit.com | mike123 | Trainer |
| emma.trainer@gymfit.com | emma123 | Trainer |
| member1@gmail.com | member123 | Member |
| member2@gmail.com | member123 | Member |
| member3@gmail.com | member123 | Member |
| member4@gmail.com | member123 | Member |
| member5@gmail.com | member123 | Member |

⚠️ **Untuk setiap user:**
- ✅ Check "Auto Confirm User"
- **COPY UID** yang muncul setelah create!

### **Step 2: Update seed.sql dengan Real UIDs**

Buka `supabase/seed.sql` di VS Code:

**Find & Replace (Ctrl+H):**

```
Find: '00000000-0000-0000-0000-000000000001'
Replace: '<uid-admin-dari-supabase>'

Find: '00000000-0000-0000-0000-000000000002'
Replace: '<uid-john-dari-supabase>'

... dst untuk semua 10 users
```

**List UIDs yang perlu diganti:**
- `00000000-0000-0000-0000-000000000001` → admin UID
- `00000000-0000-0000-0000-000000000002` → john UID
- `00000000-0000-0000-0000-000000000003` → sarah UID
- `00000000-0000-0000-0000-000000000004` → mike UID
- `00000000-0000-0000-0000-000000000005` → emma UID
- `00000000-0000-0000-0000-000000000010` → member1 UID
- `00000000-0000-0000-0000-000000000011` → member2 UID
- `00000000-0000-0000-0000-000000000012` → member3 UID
- `00000000-0000-0000-0000-000000000013` → member4 UID
- `00000000-0000-0000-0000-000000000014` → member5 UID

### **Step 3: Run Updated seed.sql**

1. SQL Editor → New Query
2. Copy paste isi `seed.sql` yang sudah diupdate
3. RUN

---

## ✅ **SOLUSI 3: Skip Seed, Langsung Development**

Tidak wajib pakai seed data! Bisa langsung development:

1. **Skip seed data**
2. **Run dev server:**
   ```bash
   pnpm dev
   ```
3. **Buat data via UI** saat development

---

## 🎯 **Rekomendasi:**

### **Untuk Testing/Development:**
→ **Gunakan SOLUSI 1** (seed_simple.sql)
- Cepat, mudah, no setup auth users
- Dapat classes & equipment langsung
- Users bisa tambah manual nanti

### **Untuk Demo/Presentation:**
→ **Gunakan SOLUSI 2** (full seed dengan auth users)
- Data lengkap: users, classes, bookings, etc.
- Lebih realistis
- Butuh setup auth users dulu (~10 menit)

### **Untuk Development Serius:**
→ **Gunakan SOLUSI 3** (skip seed)
- Buat data via UI/API saat development
- Lebih real-world scenario

---

## 🔄 **Quick Command:**

```bash
# Setelah seed (apapun metodenya):

# 1. Test connection
node test-connection.js

# 2. Check data
# Supabase Dashboard → Table Editor → lihat tables

# 3. Start dev
pnpm dev

# 4. Open browser
# http://localhost:3001
```

---

## 📝 **Files Reference:**

| File | Purpose |
|------|---------|
| `seed_simple.sql` | ✅ Simple seed (no auth users needed) |
| `seed.sql` | Full seed (perlu auth users + update UIDs) |
| `UPDATE_SEED_UIDS.md` | Guide update UIDs |

---

## 💡 **Pro Tip:**

Jika bingung atau terburu-buru:
1. **Skip seed data** (tidak wajib!)
2. **Run `pnpm dev`**
3. **Buat data manual** via UI saat development
4. **Seed nanti** kalau perlu demo data

---

**Pilih solusi yang paling cocok untuk Anda!** 😊

Saya rekomendasikan **SOLUSI 1** untuk mulai cepat! 🚀
