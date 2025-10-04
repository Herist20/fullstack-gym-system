# Admin Dashboard - Gym Management System

A comprehensive admin dashboard for managing gym operations including members, classes, schedules, bookings, trainers, payments, and equipment.

## Features

### Admin Features
- **Dashboard Overview**: Real-time metrics, charts, and analytics
- **Members Management**: Full CRUD operations for gym members
- **Classes Management**: Manage fitness classes and categories
- **Schedule Management**: Create and manage class schedules
- **Bookings Management**: View and manage class bookings
- **Trainers Management**: Manage trainers and their certifications
- **Payments & Billing**: Track payments and generate invoices
- **Reports**: Attendance, revenue, retention, and class popularity reports
- **Equipment Management**: Track equipment and maintenance schedules
- **Settings**: Configure gym info, memberships, policies, and email templates

### Trainer Features
- **Trainer Dashboard**: View upcoming classes and student metrics
- **My Schedule**: View assigned classes and mark attendance
- **Students**: View and manage students in your classes

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **Exports**: jsPDF, Papa Parse
- **Theme**: next-themes

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your Supabase credentials.

3. **Run database migrations**:
   ```bash
   # From the root of the monorepo
   supabase db push
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

   The dashboard will be available at http://localhost:3003

## Database Schema

The admin dashboard uses additional tables:
- `admin_users` - Admin and trainer role management
- `payment_transactions` - Detailed payment tracking
- `audit_logs` - Track admin actions
- `gym_settings` - Store gym configuration
- `membership_plans` - Define membership types
- `email_templates` - Email notification templates
- `trainer_certifications` - Trainer certifications
- `equipment_maintenance_log` - Equipment maintenance history

## Authentication & Authorization

- **Middleware**: Automatic role-based routing
- **Admin Access**: Full access to all features
- **Trainer Access**: Limited to trainer-specific pages
- **RLS Policies**: Row-level security enforced in Supabase

## Key Components

### Layout Components
- `DashboardLayout` - Main layout wrapper with sidebar and topbar
- `Sidebar` - Collapsible navigation with role-based menu items
- `Topbar` - Top navigation with search, notifications, and user menu
- `Breadcrumbs` - Dynamic breadcrumb navigation

### UI Components
- `DataTable` - Reusable table with sorting, filtering, and pagination
- `Modal` - Reusable modal dialog
- `Card` - Card container components
- `Badge` - Status badges with color variants
- `Button` - Button component with variants
- `MetricCard` - Dashboard metric cards

### Utilities
- Export functions (CSV, PDF, Excel)
- Date/time formatting utilities
- Currency formatting
- String utilities

## Pages

### Admin Pages
- `/` - Dashboard overview
- `/members` - Members management
- `/classes` - Classes management
- `/schedule` - Schedule management
- `/bookings` - Bookings management
- `/trainers` - Trainers management
- `/payments` - Payments & billing
- `/reports` - Reports and analytics
- `/equipment` - Equipment management
- `/settings` - System settings

### Trainer Pages
- `/trainer` - Trainer dashboard
- `/trainer/schedule` - Trainer schedule
- `/trainer/students` - Trainer students

### Auth Pages
- `/login` - Admin login
- `/unauthorized` - Unauthorized access page

## Development

### Adding New Features

1. Create API functions in `src/lib/api/`
2. Define types in `src/lib/types/`
3. Create page components in `src/app/`
4. Use existing UI components from `src/components/ui/`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use TanStack Query for data fetching
- Implement proper error handling
- Add loading states for better UX

## Export Functionality

The dashboard supports exporting data in multiple formats:
- **CSV**: Using Papa Parse
- **PDF**: Using jsPDF with autoTable
- **Excel**: Simplified using CSV format

## Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## License

This project is part of the Gym Management System monorepo.
