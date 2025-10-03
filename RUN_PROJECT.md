# 🏃‍♂️ Cara Menjalankan Project Gym System

## 🎯 Step-by-Step untuk Pemula

### Step 1: Persiapan (One Time Setup)

#### 1.1 Install Tools yang Dibutuhkan

```bash
# Check Node.js version (harus >= 18)
node --version

# Install pnpm (package manager)
npm install -g pnpm

# Install Supabase CLI
npm install -g supabase
```

#### 1.2 Clone & Install Dependencies

```bash
# Masuk ke folder project
cd gym-system

# Install semua dependencies
pnpm install
```

### Step 2: Setup Database Supabase

#### 2.1 Buat Project di Supabase (Gratis)

1. Buka browser → https://app.supabase.com
2. Klik **"New Project"**
3. Isi form:
   - **Name**: GymFit (atau nama apapun)
   - **Database Password**: Buat password kuat & **SIMPAN!**
   - **Region**: Singapore (paling dekat dari Indonesia)
4. Klik **"Create new project"**
5. Tunggu 1-2 menit sampai project ready ✅

#### 2.2 Dapatkan API Keys

Setelah project ready:

1. Di Supabase Dashboard, klik **Settings** (icon gear) di sidebar kiri
2. Klik **API** di menu Settings
3. Anda akan lihat:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (yang panjang dimulai dengan `eyJ...`)
     - `service_role` key (scroll ke bawah)

**COPY semua ini, kita akan pakai di step berikutnya!**

#### 2.3 Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Buka file .env.local dengan text editor
# Isi dengan data dari Supabase:
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # Paste Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...              # Paste anon key
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...                  # Paste service_role key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GymFit
NODE_ENV=development
```

**Simpan file!**

#### 2.4 Link Project ke Supabase

```bash
# Login ke Supabase CLI
supabase login
# Browser akan terbuka, login dengan akun Supabase Anda

# Link project
supabase link --project-ref <your-project-ref>
```

**Cara dapat project-ref:**
- Di Supabase Dashboard → **Settings** → **General**
- Copy **Reference ID** (contoh: `abcdefghijklmnop`)

```bash
# Contoh:
supabase link --project-ref abcdefghijklmnop
```

#### 2.5 Jalankan Database Migrations

```bash
# Push semua migrations ke database
pnpm db:push

# Atau
supabase db push
```

✅ Cek di Supabase Dashboard → **Table Editor**, harus ada 10 tables!

#### 2.6 Seed Data (Optional - untuk testing)

Ada 2 cara:

**Cara 1: Via Supabase Dashboard (Mudah)**
1. Buka Supabase Dashboard
2. Klik **SQL Editor** di sidebar
3. Klik **New Query**
4. Copy semua isi file `supabase/seed.sql`
5. Paste di SQL Editor
6. Klik **RUN** (atau Ctrl+Enter)

**Cara 2: Via Command Line**
```bash
# Jika punya psql installed
psql <database-url> -f supabase/seed.sql
```

Database URL ada di: Supabase Dashboard → Settings → Database → Connection String → URI

⚠️ **PENTING**: Seed data butuh auth users! Buat user manual atau update UUID di seed.sql

### Step 3: Jalankan Development Server 🚀

```bash
# Start semua apps (admin + user)
pnpm dev
```

Atau jalankan specific app:

```bash
# User Web App (Port 3001)
cd apps/user-webapp
pnpm dev

# Admin Dashboard (Port 3002)
cd apps/admin-dashboard
pnpm dev

# User Landing (Port 3003)
cd apps/user-landing
pnpm dev

# Admin Landing (Port 3004)
cd apps/admin-landing
pnpm dev
```

### Step 4: Buka di Browser 🌐

- **User Web App**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3002
- **User Landing**: http://localhost:3003
- **Admin Landing**: http://localhost:3004

## 🧪 Testing dengan Seed Data

Jika sudah run seed data, buat user di Supabase Auth:

### Cara Buat User:

1. Buka Supabase Dashboard
2. Klik **Authentication** → **Users**
3. Klik **Add user** → **Create new user**
4. Isi:
   - **Email**: admin@gymfit.com (atau email dari seed.sql)
   - **Password**: Buat password
   - **Auto Confirm User**: ✅ Check ini!
5. Klik **Create user**

**User ID HARUS sama dengan seed.sql:**
- Setelah user dibuat, copy User UID
- Update `id` di tabel `users` agar match dengan seed data

### Default Users untuk Testing:

| Role    | Email                      | User ID (dari seed.sql)              |
|---------|----------------------------|--------------------------------------|
| Admin   | admin@gymfit.com          | 00000000-0000-0000-0000-000000000001 |
| Trainer | john.trainer@gymfit.com   | 00000000-0000-0000-0000-000000000002 |
| Member  | member1@gmail.com         | 00000000-0000-0000-0000-000000000010 |

## 📝 Perintah Berguna

```bash
# Development
pnpm dev                  # Run all apps
pnpm build               # Build for production
pnpm lint                # Check code quality

# Database
pnpm db:push             # Push migrations to Supabase
pnpm types:generate      # Generate TypeScript types from DB

# Supabase
pnpm supabase:status     # Check Supabase status
supabase projects list   # List your Supabase projects
```

## ❌ Troubleshooting - Solusi Error Umum

### ❌ Error: "relation does not exist"

**Penyebab**: Migrations belum dijalankan

**Solusi**:
```bash
pnpm db:push
```

### ❌ Error: "Invalid API key" / "Unauthorized"

**Penyebab**: API keys salah di `.env.local`

**Solusi**:
1. Cek `.env.local`
2. Pastikan keys dari Supabase Dashboard → Settings → API
3. Restart dev server: Ctrl+C, lalu `pnpm dev` lagi

### ❌ Error: "Cannot connect to database"

**Penyebab**: Project Supabase mati/paused (gratis tier)

**Solusi**:
1. Buka Supabase Dashboard
2. Project akan auto-resume
3. Tunggu beberapa menit

### ❌ Error: "pnpm not found"

**Penyebab**: pnpm belum diinstall

**Solusi**:
```bash
npm install -g pnpm
```

### ❌ Error: "supabase command not found"

**Penyebab**: Supabase CLI belum diinstall

**Solusi**:
```bash
npm install -g supabase
```

### ❌ Error: "Port already in use"

**Penyebab**: Port sudah dipakai app lain

**Solusi**:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### ❌ Seed data error: "insert or update on table violates foreign key constraint"

**Penyebab**: User UUID di seed.sql tidak match dengan auth.users

**Solusi**:
1. Buat users di Supabase Auth terlebih dahulu, ATAU
2. Update UUID di seed.sql dengan UUID user yang sudah ada

## 🎯 Checklist Setup Berhasil

- [ ] Node.js v18+ installed
- [ ] pnpm installed
- [ ] Supabase project created
- [ ] `.env.local` filled dengan keys yang benar
- [ ] `pnpm install` berhasil
- [ ] `pnpm db:push` berhasil
- [ ] 10 tables muncul di Supabase Table Editor
- [ ] `pnpm dev` running tanpa error
- [ ] Browser bisa buka http://localhost:3001

## 🆘 Masih Error?

1. Check file `.env.local` - apakah keys sudah benar?
2. Check Supabase project - apakah masih active?
3. Restart terminal & dev server
4. Delete `node_modules` & `pnpm-lock.yaml`, lalu `pnpm install` ulang

## 🚀 Selamat!

Jika semua checklist ✅, project Anda sudah running!

Sekarang bisa mulai development! 💪

---

**Next Steps:**
1. Lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk detail teknis
2. Lihat [supabase/README.md](./supabase/README.md) untuk database docs
3. Start coding! 🎉
