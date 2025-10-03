# 🎯 START HERE - Gym Management System

> **Selamat datang!** Ini adalah starting point untuk menjalankan Gym Management System.

## 🚀 Quick Start (5 Menit)

### Windows Users:
```bash
# Double click atau run di Command Prompt:
setup.bat
```

### Mac/Linux Users:
```bash
# Run di terminal:
chmod +x setup.sh
./setup.sh
```

### Manual Setup:
```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local dengan Supabase credentials
# Get from: https://app.supabase.com > Settings > API

# 4. Install Supabase CLI
npm install -g supabase

# 5. Link to Supabase
supabase login
supabase link --project-ref <your-project-ref>

# 6. Run migrations
pnpm db:push

# 7. Start development
pnpm dev
```

## 📚 Dokumentasi

Pilih dokumentasi sesuai kebutuhan Anda:

### 🇮🇩 Untuk Pemula (Bahasa Indonesia)
**[📖 RUN_PROJECT.md](./RUN_PROJECT.md)**
- Step-by-step lengkap dari nol
- Penjelasan detail setiap langkah
- Troubleshooting lengkap
- **Mulai dari sini jika baru pertama kali!**

### ⚡ Untuk Developer
**[🚀 QUICKSTART.md](./QUICKSTART.md)**
- Setup cepat 5 menit
- Command-line oriented
- Minimal explanation

### 🔧 Technical Documentation
**[📋 SETUP_GUIDE.md](./SETUP_GUIDE.md)**
- Detailed technical setup
- Architecture overview
- Best practices
- Advanced configuration

### 🗄️ Database Documentation
**[💾 supabase/README.md](./supabase/README.md)**
- Complete database schema
- RLS policies explanation
- Functions & triggers
- Migration guide

### 📊 Project Overview
**[📈 PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**
- What's been built
- Tech stack
- Features overview
- Next steps roadmap

### ✅ Setup Verification
**[✔️ CHECKLIST.md](./CHECKLIST.md)**
- Step-by-step checklist
- Verification tests
- Troubleshooting guide
- Success criteria

## 🎯 Choose Your Path

### Path 1: Saya Pemula (Baru Belajar)
1. ✅ Baca [RUN_PROJECT.md](./RUN_PROJECT.md) dari awal sampai akhir
2. ✅ Ikuti setiap langkah dengan hati-hati
3. ✅ Gunakan [CHECKLIST.md](./CHECKLIST.md) untuk verify
4. ✅ Lihat [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) untuk understand apa yang dibangun

### Path 2: Saya Developer Berpengalaman
1. ⚡ Baca [QUICKSTART.md](./QUICKSTART.md) - 5 menit
2. ⚡ Run setup script: `./setup.sh` atau `setup.bat`
3. ⚡ Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) untuk overview
4. ⚡ Read [supabase/README.md](./supabase/README.md) untuk database

### Path 3: Saya Ingin Deep Dive
1. 🔧 Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk architecture
2. 🔧 Study [supabase/README.md](./supabase/README.md) untuk database design
3. 🔧 Review migrations di `supabase/migrations/`
4. 🔧 Check TypeScript types di `src/types/database.types.ts`

## 📁 File Structure Quick Reference

```
gym-system/
│
├── 📄 START_HERE.md          ← You are here!
├── 📄 RUN_PROJECT.md         ← Setup lengkap (Bahasa Indonesia)
├── 📄 QUICKSTART.md          ← Quick setup guide
├── 📄 SETUP_GUIDE.md         ← Technical documentation
├── 📄 PROJECT_SUMMARY.md     ← Project overview
├── 📄 CHECKLIST.md           ← Verification checklist
├── 📄 README.md              ← Main readme
│
├── 🔧 setup.sh               ← Auto setup (Mac/Linux)
├── 🔧 setup.bat              ← Auto setup (Windows)
├── 🔧 .env.example           ← Environment template
│
├── 📂 apps/                  ← Applications
│   ├── user-webapp/         ← Member app (3001)
│   ├── admin-dashboard/     ← Admin app (3002)
│   ├── user-landing/        ← Landing (3003)
│   └── admin-landing/       ← Admin landing (3004)
│
├── 📂 packages/             ← Shared packages
│   ├── ui/                  ← UI components
│   ├── database/            ← DB utilities
│   └── auth/                ← Auth utilities
│
├── 📂 src/types/            ← TypeScript types
│   └── database.types.ts    ← Auto-generated DB types
│
└── 📂 supabase/             ← Database
    ├── migrations/          ← SQL migrations
    ├── seed.sql            ← Sample data
    ├── config.toml         ← Supabase config
    └── README.md           ← DB documentation
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Build System** | Turborepo |
| **Package Manager** | pnpm |

## ⚡ Quick Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm build           # Build for production
pnpm lint            # Lint code

# Database
pnpm db:push         # Push migrations
pnpm db:reset        # Reset database
pnpm types:generate  # Generate TypeScript types

# Supabase
pnpm supabase:start  # Start local Supabase
pnpm supabase:stop   # Stop local Supabase
pnpm supabase:status # Check status
```

## 🌐 Application Ports

| App | URL | Port |
|-----|-----|------|
| User WebApp | http://localhost:3001 | 3001 |
| Admin Dashboard | http://localhost:3002 | 3002 |
| User Landing | http://localhost:3003 | 3003 |
| Admin Landing | http://localhost:3004 | 3004 |

## ✅ Quick Health Check

Pastikan ini semua OK sebelum mulai coding:

```bash
# 1. Check Node.js version
node --version        # Should be >= v18

# 2. Check if pnpm installed
pnpm --version

# 3. Check if dependencies installed
ls node_modules       # Should have folders

# 4. Check environment file
cat .env.local        # Should have Supabase keys

# 5. Check database connection
pnpm supabase:status  # Should show "Running"

# 6. Start dev server
pnpm dev             # Should start without errors
```

## 🆘 Need Help?

### Common Issues:

**"command not found: pnpm"**
```bash
npm install -g pnpm
```

**"Invalid API key"**
```bash
# Check .env.local
# Copy paste ulang dari Supabase Dashboard > Settings > API
```

**"relation does not exist"**
```bash
pnpm db:push
```

**"Port already in use"**
```bash
# Change port in package.json atau kill process
```

### Get More Help:

1. 📖 Check [RUN_PROJECT.md](./RUN_PROJECT.md) - Troubleshooting section
2. 📋 Use [CHECKLIST.md](./CHECKLIST.md) - Verify your setup
3. 💬 Ask in project issues/discussions
4. 📚 Read Supabase docs: https://supabase.com/docs

## 🎉 You're Ready!

Setelah setup selesai:

1. ✅ Open http://localhost:3001
2. ✅ Lihat aplikasi running
3. ✅ Baca [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) untuk next steps
4. ✅ Start building! 💪

---

## 📌 Quick Links

- [🏠 Main README](./README.md)
- [🇮🇩 Setup Guide Indonesia](./RUN_PROJECT.md)
- [⚡ Quick Start](./QUICKSTART.md)
- [📊 Project Summary](./PROJECT_SUMMARY.md)
- [✅ Setup Checklist](./CHECKLIST.md)
- [🗄️ Database Docs](./supabase/README.md)

---

**Happy Coding! 🚀**

Last updated: 2025-01-03
