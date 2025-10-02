# Gym Management System

A comprehensive gym management system built with a monorepo architecture using Next.js 14, TypeScript, Tailwind CSS, and Supabase.

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

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` in each app directory
   - Fill in your Supabase credentials

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

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts

## 🛠️ Best Practices

- TypeScript strict mode enabled
- ESLint + Prettier for code quality
- Shared UI components for consistency
- Path aliases for clean imports
- Dark mode support
- Mobile-responsive design
- Type-safe database queries

## 📄 License

Private - All rights reserved
