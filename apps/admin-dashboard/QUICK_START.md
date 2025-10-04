# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Environment (1 min)

```bash
cd apps/admin-dashboard
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 2: Run Migrations (1 min)

```bash
cd ../../supabase
supabase db push
```

### Step 3: Install & Run (2 min)

```bash
cd ../apps/admin-dashboard
pnpm install
pnpm dev
```

Visit: http://localhost:3003

### Step 4: Create Admin User (1 min)

1. Register a user or use existing auth user
2. Run this SQL in Supabase:

```sql
INSERT INTO admin_users (user_id, role, permissions, is_active)
VALUES ('your-user-id', 'admin', '{}', true);
```

### Step 5: Login

Go to http://localhost:3003/login and use your credentials.

## 📁 Project Structure

```
src/
├── app/                    # Pages
│   ├── page.tsx           # ✅ Dashboard
│   ├── members/           # ✅ Members
│   ├── bookings/          # ✅ Bookings
│   ├── equipment/         # ✅ Equipment
│   ├── trainer/           # ✅ Trainer Dashboard
│   └── [others]/          # 🚧 Placeholders
├── components/
│   ├── layout/            # Sidebar, Topbar, etc.
│   └── ui/                # Reusable components
├── lib/
│   ├── api/               # API functions
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
└── hooks/                 # Custom hooks
```

## ✅ What Works

- **Dashboard** - Metrics, charts, analytics
- **Members** - Full CRUD operations
- **Bookings** - View and export
- **Equipment** - Track and manage
- **Trainer Dashboard** - Trainer view
- **Auth** - Login, role-based access
- **Export** - CSV, PDF utilities

## 🚧 What's Next

These pages exist but need implementation:
- Classes Management
- Schedule (needs calendar)
- Trainers Management
- Payments & Billing
- Reports
- Settings
- Trainer Schedule
- Trainer Students

## 🛠️ Common Tasks

### Add a New Page

1. Create file: `src/app/your-page/page.tsx`
2. Create API: `src/lib/api/your-page.api.ts`
3. Add to sidebar: `src/components/layout/sidebar.tsx`

### Add API Function

```typescript
// src/lib/api/resource.api.ts
import { createClient } from '@/lib/supabase/client';

export async function fetchResource() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('table')
    .select('*');

  if (error) throw error;
  return data;
}
```

### Use in Component

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchResource } from '@/lib/api/resource.api';

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['resource'],
    queryFn: fetchResource,
  });

  return <DashboardLayout>{/* content */}</DashboardLayout>;
}
```

### Export Data

```typescript
import { exportToCSV } from '@/lib/utils/export';

const handleExport = () => {
  exportToCSV(data, 'filename');
};
```

## 🔐 User Roles

### Admin
- Access: All pages
- Route: `/` (dashboard)
- Can: Everything

### Trainer
- Access: `/trainer/*` only
- Route: `/trainer` (auto-redirect)
- Can: View classes, students, schedule

## 📊 Database Tables

### New Tables (Admin Dashboard)
- `admin_users` - Roles & permissions
- `payment_transactions` - Payment tracking
- `audit_logs` - Action logging
- `gym_settings` - Configuration
- `membership_plans` - Plan definitions
- `email_templates` - Email templates
- `trainer_certifications` - Certifications
- `equipment_maintenance_log` - Maintenance

### Existing Tables (Used)
- `users` - User profiles
- `trainers` - Trainer info
- `memberships` - User memberships
- `classes` - Class definitions
- `schedules` - Class schedules
- `bookings` - Class bookings
- `payments` - Payment records
- `equipment` - Equipment items

## 🎨 UI Components

### DataTable
```typescript
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  searchPlaceholder="Search..."
/>
```

### Modal
```typescript
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Title"
>
  {/* content */}
</Modal>
```

### Button
```typescript
<Button variant="primary" size="md">
  Click Me
</Button>
```

### Badge
```typescript
<Badge variant="success">Active</Badge>
```

## 🐛 Troubleshooting

**Login fails?**
- Check Supabase credentials in `.env.local`
- Verify user exists in auth.users
- Check admin_users table has record

**Unauthorized page?**
- Add user to admin_users table
- Set role to 'admin' or 'trainer'
- Set is_active to true

**Data not loading?**
- Check RLS policies in Supabase
- Verify user has correct role
- Check browser console for errors

**Middleware redirecting?**
- Check user role in admin_users
- Verify middleware.ts config
- Check route patterns

## 📚 Documentation

- **README.md** - Full documentation
- **IMPLEMENTATION.md** - Implementation guide
- **ADMIN_DASHBOARD_SUMMARY.md** - Project summary

## 💡 Tips

1. Use existing pages as templates
2. Follow the API pattern in `members.api.ts`
3. All mutations should invalidate queries
4. Always wrap pages in `<DashboardLayout>`
5. Use `useAuth` hook for user info
6. Toast notifications with `sonner`

## 🚢 Deployment

```bash
pnpm build
pnpm start
```

Set environment variables in your hosting platform.

## ✨ Key Features

- 🔐 Role-based authentication
- 📊 Real-time dashboard metrics
- 📈 Charts with Recharts
- 📋 Advanced data tables
- 🎨 Tailwind CSS (orange theme)
- 🌙 Dark mode support
- 📱 Responsive design
- 📤 Export (CSV, PDF)
- 🔄 Optimistic updates
- 🎯 Type-safe with TypeScript

---

**Need Help?** Check IMPLEMENTATION.md for detailed guides on completing remaining modules.
