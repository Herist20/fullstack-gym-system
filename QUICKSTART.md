# 🚀 Quick Start - Gym System

Panduan cepat untuk menjalankan project dalam 5 menit!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
pnpm install
# atau npm install / yarn install
```

### 2. Setup Supabase

#### Option A: Menggunakan Supabase Cloud (Recommended)

1. **Buat Project di Supabase**
   - Buka https://app.supabase.com
   - Klik "New Project"
   - Simpan Database Password!

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Isi `.env.local`** dengan data dari Supabase Dashboard > Settings > API:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```

4. **Install Supabase CLI & Link Project**
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   ```

5. **Run Migrations**
   ```bash
   pnpm db:push
   ```

6. **Seed Data (Optional)**
   - Buka Supabase Dashboard > SQL Editor
   - Copy paste isi `supabase/seed.sql`
   - Klik RUN

#### Option B: Menggunakan Supabase Local

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Copy local credentials ke .env.local
# Credentials akan muncul di terminal setelah 'supabase start'
```

### 3. Run Development Server

```bash
pnpm dev
```

Buka http://localhost:3000 🎉

## 📝 Available Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build production
pnpm lint            # Run linter

# Database (Supabase Cloud)
pnpm db:push         # Push migrations to remote DB
pnpm types:generate  # Generate TypeScript types

# Supabase Local
pnpm supabase:start  # Start local Supabase
pnpm supabase:stop   # Stop local Supabase
pnpm supabase:status # Check status
```

## 🧪 Test Users (After Seeding)

Buat users ini di Supabase Auth dengan password pilihan Anda:

- **Admin**: admin@gymfit.com
- **Trainer**: john.trainer@gymfit.com
- **Member**: member1@gmail.com

> **Important**: Pastikan User UID sama dengan ID di seed.sql!

## 📁 Project Structure

```
gym-system/
├── apps/                    # Applications
│   └── web/                # Next.js web app
├── packages/               # Shared packages
│   └── ui/                # UI components
├── src/
│   ├── types/             # TypeScript types
│   │   └── database.types.ts
│   └── ...
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── seed.sql          # Seed data
│   └── config.toml       # Supabase config
└── .env.local            # Environment variables (create this!)
```

## ❓ Troubleshooting

### "relation does not exist"
```bash
pnpm db:push
```

### "Invalid API key"
Check `.env.local` - pastikan keys dari Supabase Dashboard > Settings > API

### "Cannot connect"
```bash
# For local Supabase
pnpm supabase:status

# For cloud Supabase
# Check project status di dashboard
```

## 📚 Dokumentasi Lengkap

Lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk panduan detail.

## 🎯 Next Steps

1. ✅ Setup Authentication Pages
2. ✅ Create Dashboard Components
3. ✅ Build Booking System
4. ✅ Implement Payment Flow
5. ✅ Create Admin Panel

Happy coding! 💪
