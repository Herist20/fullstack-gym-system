# 🏋️ Gym Management System - Setup Guide

Panduan lengkap untuk menjalankan project ini dari awal hingga siap digunakan.

## 📋 Prerequisites

Pastikan sudah terinstall:

- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **npm** atau **pnpm** atau **yarn**
- **Supabase Account** - [Sign up gratis](https://supabase.com/)

## 🚀 Langkah-langkah Setup

### 1. Clone & Install Dependencies

```bash
# Clone repository (jika belum)
git clone <repository-url>
cd gym-system

# Install dependencies
npm install
# atau
pnpm install
# atau
yarn install
```

### 2. Setup Supabase Project

#### A. Buat Project di Supabase

1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Klik **"New Project"**
3. Isi detail:
   - **Name**: GymFit (atau nama pilihan Anda)
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (Singapore/Jakarta)
4. Tunggu ~2 menit sampai project siap

#### B. Install Supabase CLI

```bash
# Install Supabase CLI global
npm install -g supabase

# Login ke Supabase
supabase login
```

#### C. Link Project ke Local

```bash
# Link ke project Supabase Anda
supabase link --project-ref <your-project-ref>

# Project ref bisa ditemukan di:
# Supabase Dashboard > Project Settings > General > Reference ID
```

### 3. Setup Database

#### A. Run Migrations

```bash
# Push semua migrations ke database
supabase db push

# Atau jika menggunakan remote database
supabase migration up
```

#### B. Seed Development Data (Opsional)

```bash
# Untuk development, seed dengan data sample
# Cara 1: Via Supabase Dashboard
# - Buka SQL Editor di Supabase Dashboard
# - Copy paste isi file supabase/seed.sql
# - Klik RUN

# Cara 2: Via CLI (jika punya psql)
psql <your-database-url> -f supabase/seed.sql

# Database URL ada di:
# Supabase Dashboard > Project Settings > Database > Connection String > URI
```

⚠️ **PENTING untuk Seed Data**:
Seed data membutuhkan auth users. Anda perlu:
1. Buat user di Supabase Auth dengan email sesuai seed.sql, ATAU
2. Update UUID di seed.sql dengan UUID dari auth.users yang sudah ada

### 4. Setup Environment Variables

#### A. Copy Template

```bash
cp .env.example .env.local
```

#### B. Isi Environment Variables

Buka `.env.local` dan isi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Cara dapat keys:**
1. Buka Supabase Dashboard
2. Settings > API
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Generate TypeScript Types (Opsional)

```bash
# Generate types dari database schema
npm run types:generate

# Atau manual
supabase gen types typescript --local > src/types/database.types.ts
```

### 6. Run Development Server

```bash
# Start development server
npm run dev

# Buka browser di http://localhost:3000
```

## 🎯 Verifikasi Setup

### Cek Database

1. Buka Supabase Dashboard > Table Editor
2. Pastikan ada 10 tables:
   - ✅ users
   - ✅ trainers
   - ✅ memberships
   - ✅ classes
   - ✅ schedules
   - ✅ bookings
   - ✅ attendance
   - ✅ payments
   - ✅ equipment
   - ✅ notifications

### Cek RLS Policies

1. Buka Table Editor > pilih table > Policies tab
2. Pastikan setiap table punya policies

### Test Connection

Buat file `test-connection.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  const { data, error } = await supabase.from('classes').select('*').limit(5)

  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Connection successful!')
    console.log('📊 Sample data:', data)
  }
}

testConnection()
```

Run: `npx tsx test-connection.ts`

## 📁 Struktur Project

```
gym-system/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utilities & configs
│   ├── types/              # TypeScript types
│   │   └── database.types.ts
│   └── hooks/              # Custom hooks
├── supabase/
│   ├── migrations/         # Database migrations
│   │   ├── 20250101000000_initial_schema.sql
│   │   ├── 20250101000001_rls_policies.sql
│   │   └── 20250101000002_functions.sql
│   ├── seed.sql           # Development seed data
│   └── README.md          # Database documentation
├── public/                # Static assets
├── .env.local            # Environment variables (create this)
├── .env.example          # Environment template
├── package.json
└── next.config.js
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push migrations to DB
npm run db:reset        # Reset local DB
npm run db:seed         # Seed development data
npm run types:generate  # Generate TS types from DB

# Supabase
npm run supabase:start  # Start local Supabase
npm run supabase:stop   # Stop local Supabase
npm run supabase:status # Check Supabase status
```

## 🧪 Testing dengan Seed Data

Jika Anda sudah run seed data, bisa login dengan:

### Admin
- **Email**: admin@gymfit.com
- **Password**: (buat di Supabase Auth)

### Trainer
- **Email**: john.trainer@gymfit.com
- **Password**: (buat di Supabase Auth)

### Member
- **Email**: member1@gmail.com
- **Password**: (buat di Supabase Auth)

**Cara buat user di Supabase Auth:**
1. Buka Supabase Dashboard > Authentication > Users
2. Klik "Add user" > "Create new user"
3. Isi email sesuai seed data
4. Set password
5. **PENTING**: Set User UID sama dengan ID di seed.sql!

## 🐛 Troubleshooting

### Error: "relation does not exist"
```bash
# Migration belum jalan, run:
supabase db push
```

### Error: "Invalid API key"
```bash
# Check .env.local, pastikan keys benar
# Regenerate keys di Supabase Dashboard > Settings > API
```

### Error: "Row level security policy"
```bash
# RLS policies belum ada, run:
supabase migration up
```

### Error: Cannot connect to database
```bash
# Check project status
supabase projects list

# Restart project di dashboard
```

### TypeScript errors pada database types
```bash
# Regenerate types
npm run types:generate
```

## 📚 Next Steps

Setelah setup selesai:

1. ✅ **Buat Authentication Pages** - Login, Register, Profile
2. ✅ **Buat Dashboard** - Admin, Trainer, Member dashboards
3. ✅ **Buat Booking System** - Class booking & management
4. ✅ **Buat Payment Integration** - Membership payments
5. ✅ **Buat Admin Panel** - Manage users, classes, schedules

## 🆘 Butuh Bantuan?

- 📖 [Supabase Docs](https://supabase.com/docs)
- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

## 🎉 Setup Complete!

Jika semua langkah di atas berhasil, project Anda sudah siap untuk development! 🚀

Happy coding! 💪
