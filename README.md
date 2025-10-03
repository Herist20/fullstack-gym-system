# 🏋️‍♂️ Gym Management System

A comprehensive gym management system built with a monorepo architecture using Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🎯 NEW? START HERE!

### 👉 [**START_HERE.md**](./START_HERE.md) ← Baca ini dulu!

Atau pilih sesuai kebutuhan:

| Dokumentasi | Untuk Siapa | Waktu |
|------------|-------------|-------|
| [🎯 START_HERE.md](./START_HERE.md) | **Semua orang** - Navigation hub | 2 min |
| [🇮🇩 RUN_PROJECT.md](./RUN_PROJECT.md) | Pemula - Step-by-step lengkap | 15 min |
| [⚡ QUICKSTART.md](./QUICKSTART.md) | Developer - Setup cepat | 5 min |
| [📋 SETUP_GUIDE.md](./SETUP_GUIDE.md) | Technical - Detail lengkap | 20 min |
| [📊 PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Overview - Apa yang sudah dibuat | 10 min |
| [✅ CHECKLIST.md](./CHECKLIST.md) | Verification - Cek setup Anda | 10 min |

## 🚀 Quick Start (TL;DR)

```bash
# Windows: Double click setup.bat
# Mac/Linux: ./setup.sh

# Atau manual:
pnpm install
cp .env.example .env.local  # Edit dengan Supabase credentials
supabase link --project-ref <your-ref>
pnpm db:push
pnpm dev
```

📖 **Detail lengkap:** [RUN_PROJECT.md](./RUN_PROJECT.md)

## 🏗️ Project Structure

```
gym-system/
├── apps/
│   ├── user-landing/       # User landing page (Port 3000)
│   ├── user-webapp/        # User web application (Port 3001)
│   ├── admin-landing/      # Admin landing page (Port 3002)
│   └── admin-dashboard/    # Admin dashboard (Port 3003)
├── packages/
│   ├── ui/                 # Shared UI components (shadcn/ui)
│   ├── database/           # Database types and clients
│   ├── auth/               # Authentication utilities
│   └── config/             # Shared configuration
└── ...
```

## 🚀 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom gym theme
- **Database:** Supabase
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **UI Components:** shadcn/ui + Radix UI
- **Build System:** Turbo
- **Package Manager:** pnpm

## 📦 Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials

# 3. Install Supabase CLI
npm install -g supabase

# 4. Link to Supabase project
supabase link --project-ref <your-project-ref>

# 5. Run database migrations
pnpm db:push

# 6. Start development
pnpm dev
```

Lihat [RUN_PROJECT.md](./RUN_PROJECT.md) untuk panduan lengkap!

## 🎨 Theme Colors

**Light Mode:**
- Primary: Vibrant Orange (#FF5500)
- Secondary: Dark Blue Gray (#3A4D5C)
- Accent: Energetic Yellow (#FFD500)
- Dark: Deep Charcoal (#1F2A33)
- Light: Light Gray (#F2F2F2)

**Dark Mode:**
- Automatically adjusts for optimal visibility

## 🔧 Development

Run all apps in development mode:

```bash
pnpm dev
```

Run specific app:

```bash
# User landing page
cd apps/user-landing && pnpm dev

# User webapp
cd apps/user-webapp && pnpm dev

# Admin landing page
cd apps/admin-landing && pnpm dev

# Admin dashboard
cd apps/admin-dashboard && pnpm dev
```

## 🏗️ Build

Build all apps:

```bash
pnpm build
```

## 🧹 Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm type-check
```

## 📱 Applications

### User Landing (Port 3000)
Marketing and informational landing page for gym members.

### User WebApp (Port 3001)
Full-featured application for gym members to:
- Manage memberships
- Book classes
- Track workouts
- View schedules

### Admin Landing (Port 3002)
Administrative portal landing page.

### Admin Dashboard (Port 3003)
Comprehensive admin dashboard to:
- Manage members
- Track gym analytics
- Manage classes and schedules
- Handle billing and memberships

## 📦 Shared Packages

### @gym/ui
Reusable UI components built with shadcn/ui and Radix UI.

### @gym/database
Database types and Supabase client utilities.

### @gym/auth
Authentication helpers for both client and server components.

### @gym/config
Shared configuration and constants.

## 🔐 Environment Variables

Required environment variables for each app:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📝 Scripts

### Development
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts

### Database
- `pnpm db:push` - Push migrations to Supabase
- `pnpm db:reset` - Reset local database
- `pnpm db:seed` - Seed development data
- `pnpm types:generate` - Generate TypeScript types from DB

### Supabase
- `pnpm supabase:start` - Start local Supabase
- `pnpm supabase:stop` - Stop local Supabase
- `pnpm supabase:status` - Check Supabase status
- `pnpm supabase:link` - Link to Supabase project

## 🛠️ Best Practices

- TypeScript strict mode enabled
- ESLint + Prettier for code quality
- Shared UI components for consistency
- Path aliases for clean imports
- Dark mode support
- Mobile-responsive design
- Type-safe database queries

## 📚 Database Documentation

Database schema lengkap ada di [supabase/README.md](./supabase/README.md)

**Database Features:**
- ✅ 10 Core Tables (users, memberships, classes, bookings, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ 11 Database functions untuk common queries
- ✅ Auto-generated TypeScript types
- ✅ Seed data untuk development
- ✅ Automatic triggers (spots management, expiry, etc.)

## 🗂️ Documentation

- 📖 [RUN_PROJECT.md](./RUN_PROJECT.md) - Panduan setup lengkap (Bahasa Indonesia)
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- 📋 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup documentation
- 🗄️ [supabase/README.md](./supabase/README.md) - Database documentation

## 📄 License

Private - All rights reserved
