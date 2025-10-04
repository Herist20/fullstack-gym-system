# Admin Dashboard Implementation Guide

## Overview

This document provides a comprehensive overview of the admin dashboard implementation for the Gym Management System. The dashboard has been built with a solid foundation and core functionality, with some modules requiring further implementation.

## What Has Been Implemented

### ✅ Core Infrastructure

1. **Project Setup**
   - Next.js 14 application configured at `apps/admin-dashboard`
   - TypeScript with proper path aliases (`@/`)
   - All required dependencies installed (recharts, react-table, date-fns, etc.)
   - Tailwind CSS with orange theme configuration
   - Development server configured on port 3003

2. **Database Schema**
   - Migration files created:
     - `20250104000001_admin_dashboard_tables.sql` - New tables for admin features
     - `20250104000002_admin_dashboard_rls.sql` - Row-level security policies
   - New tables added:
     - `admin_users` - Admin and trainer role management
     - `payment_transactions` - Detailed payment tracking
     - `audit_logs` - Admin action logging
     - `gym_settings` - System configuration
     - `membership_plans` - Membership type definitions
     - `email_templates` - Email notification templates
     - `trainer_certifications` - Trainer certifications
     - `equipment_maintenance_log` - Equipment maintenance history

3. **Authentication & Authorization**
   - Supabase client and server setup
   - `useAuth` hook for user authentication and role detection
   - Middleware for role-based routing and access control
   - Login page with proper authentication flow
   - Unauthorized page for access denied scenarios
   - Automatic redirection based on user roles (admin/trainer)

4. **Layout System**
   - `DashboardLayout` - Main layout wrapper
   - `Sidebar` - Collapsible navigation with role-based menu items
   - `Topbar` - Top bar with dark mode toggle, notifications, and user menu
   - `Breadcrumbs` - Dynamic breadcrumb navigation
   - Fully responsive design

5. **Reusable Components**
   - `DataTable` - Advanced table with sorting, filtering, and pagination
   - `Modal` - Reusable modal dialog
   - `Card` - Card container components
   - `Badge` - Status badges with color variants
   - `Button` - Button component with multiple variants
   - `MetricCard` - Dashboard metric display cards

6. **Utility Functions**
   - Export utilities (CSV, PDF, Excel)
   - Date/time formatting
   - Currency formatting
   - String utilities (initials, truncate)

### ✅ Implemented Pages

1. **Admin Dashboard (`/`)** - FULLY IMPLEMENTED
   - Real-time metrics cards (Total Members, Active Today, Revenue MTD, Class Occupancy)
   - Revenue trend chart (last 30 days)
   - Popular classes bar chart
   - Member growth line chart (last 6 months)
   - Recent bookings table
   - Uses TanStack Query for data fetching
   - Recharts for data visualization

2. **Members Management (`/members`)** - FULLY IMPLEMENTED
   - Complete CRUD operations
   - DataTable with search, sort, and pagination
   - Add member modal with form validation
   - Edit member functionality
   - Suspend/Activate member actions
   - Delete member with confirmation
   - Row action menu
   - Avatar display with initials

3. **Bookings Management (`/bookings`)** - FULLY IMPLEMENTED
   - DataTable showing all bookings
   - Member, class, date/time information
   - Status badges (confirmed, cancelled, completed, no-show)
   - CSV export functionality
   - Search and filter capabilities

4. **Equipment Management (`/equipment`)** - FULLY IMPLEMENTED
   - DataTable with equipment list
   - Status badges (available, maintenance, broken)
   - Maintenance tracking display
   - Search functionality

5. **Trainer Dashboard (`/trainer`)** - FULLY IMPLEMENTED
   - Metrics cards (Upcoming Classes, Total Students, Attendance Rate, Rating)
   - Upcoming classes table (next 7 days)
   - Custom dashboard for trainer role

6. **Login Page (`/login`)** - FULLY IMPLEMENTED
   - Email/password authentication
   - Error handling and toast notifications
   - Auto-redirect after login

### 🚧 Placeholder Pages (Routes Created, Implementation Needed)

The following pages have been created with basic structure but need full implementation:

1. **Classes Management (`/classes`)**
   - Needs: Grid/list view toggle, class CRUD, category management, image upload

2. **Schedule Management (`/schedule`)**
   - Needs: react-big-calendar integration, drag-and-drop, conflict detection, bulk scheduling

3. **Trainers Management (`/trainers`)**
   - Needs: Trainer grid, profile modals, performance metrics, certification management

4. **Payments & Billing (`/payments`)**
   - Needs: Payment DataTable, invoice generation, refund processing, revenue charts

5. **Reports (`/reports`)**
   - Needs: Tab navigation, multiple report types, charts, export functionality

6. **Settings (`/settings`)**
   - Needs: Tab navigation, gym info form, membership plans CRUD, email template editor

7. **Trainer Schedule (`/trainer/schedule`)**
   - Needs: Calendar view, attendance marking

8. **Trainer Students (`/trainer/students`)**
   - Needs: Student list, attendance history

## How to Complete the Implementation

### Step 1: Run Database Migrations

```bash
# From the root of the monorepo
cd supabase
supabase db push
```

This will create all the new tables and RLS policies.

### Step 2: Set Up Environment Variables

```bash
cd apps/admin-dashboard
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Install Dependencies

```bash
# From the monorepo root
pnpm install
```

### Step 4: Start Development Server

```bash
cd apps/admin-dashboard
pnpm dev
```

The dashboard will be available at http://localhost:3003

### Step 5: Create Admin User

You need to manually create an admin user in the database:

1. Create a user through Supabase auth or registration
2. Insert a record in the `admin_users` table:

```sql
INSERT INTO admin_users (user_id, role, permissions, is_active)
VALUES ('user-id-here', 'admin', '{}', true);
```

## Implementing Remaining Modules

### Classes Management Implementation Guide

**File:** `/apps/admin-dashboard/src/app/classes/page.tsx`

**What to implement:**
1. Create API functions in `src/lib/api/classes.api.ts`:
   - `fetchClasses()` - Get all classes with instructor info
   - `createClass()` - Create new class
   - `updateClass()` - Update existing class
   - `deleteClass()` - Delete class
   - `duplicateClass()` - Duplicate class

2. Update the page to include:
   - Grid/List view toggle
   - Class cards with image, name, instructor, capacity, price
   - Add/Edit modal with form fields:
     - Name, description, category
     - Instructor select (from trainers)
     - Duration, capacity, price
     - Image upload (use Supabase storage)
   - Archive functionality
   - Filter by category, instructor, status

**Example API function:**
```typescript
export async function fetchClasses() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*, instructor:trainers(id, user:users(full_name))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### Schedule Management Implementation Guide

**File:** `/apps/admin-dashboard/src/app/schedule/page.tsx`

**What to implement:**
1. Install and configure react-big-calendar
2. Create API functions in `src/lib/api/schedules.api.ts`:
   - `fetchSchedules()` - Get schedules with class info
   - `createSchedule()` - Create new schedule
   - `updateSchedule()` - Update schedule (time, date)
   - `deleteSchedule()` - Delete schedule
   - `checkConflicts()` - Check for trainer/room conflicts

3. Implement calendar features:
   - Month/Week/Day views
   - Click to create schedule
   - Drag to resize duration
   - Event click to edit/delete
   - Color code by class type
   - Conflict detection

4. Create bulk schedule modal:
   - Select class, instructor, time
   - Choose days of week
   - Repeat for X weeks
   - Batch create schedules

**Example calendar setup:**
```typescript
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

<Calendar
  localizer={localizer}
  events={schedules}
  startAccessor="start"
  endAccessor="end"
  onSelectSlot={handleSlotSelect}
  onSelectEvent={handleEventSelect}
  selectable
/>
```

### Trainers Management Implementation Guide

**File:** `/apps/admin-dashboard/src/app/trainers/page.tsx`

**What to implement:**
1. Create API functions in `src/lib/api/trainers.api.ts`:
   - `fetchTrainers()` - Get all trainers with user info
   - `createTrainer()` - Create new trainer
   - `updateTrainer()` - Update trainer
   - `deleteTrainer()` - Delete trainer
   - `fetchTrainerPerformance()` - Get performance metrics

2. Create trainer card grid:
   - Photo, name, specialization
   - Rating, total classes
   - Click to view details

3. Details modal should show:
   - Bio and certifications
   - Assigned classes
   - Availability calendar
   - Performance tab (attendance rate, rating, feedback)

4. Add/Edit modal:
   - Name, email, bio
   - Specialization (multi-select)
   - Photo upload
   - Certifications section

### Payments & Billing Implementation Guide

**File:** `/apps/admin-dashboard/src/app/payments/page.tsx`

**What to implement:**
1. Create API functions in `src/lib/api/payments.api.ts`:
   - `fetchPaymentTransactions()` - Get all transactions
   - `createTransaction()` - Record payment
   - `processRefund()` - Process refund
   - `generateInvoice()` - Generate PDF invoice

2. DataTable with columns:
   - Transaction ID, Member, Amount
   - Type (membership/class), Status
   - Date, Invoice download

3. Revenue analytics section:
   - Cards: Total Revenue, Pending, Refunded
   - Chart: Revenue over time (daily/weekly/monthly)

4. Manual payment form:
   - Member select
   - Amount, payment method
   - Type (membership/class/other)

5. Invoice generation:
```typescript
import jsPDF from 'jspdf';

function generateInvoice(transaction) {
  const doc = new jsPDF();
  // Add invoice content
  doc.text(`Invoice #${transaction.id}`, 20, 20);
  // ... add more content
  doc.save(`invoice-${transaction.id}.pdf`);
}
```

### Reports Implementation Guide

**File:** `/apps/admin-dashboard/src/app/reports/page.tsx`

**What to implement:**
1. Create tab navigation (Attendance, Revenue, Retention, Class Popularity)
2. Each tab should have:
   - Date range picker
   - Filters (class, instructor, member type)
   - Summary cards
   - Charts (appropriate for report type)
   - Detailed table
   - Export buttons (PDF, Excel, CSV)

3. Create API functions for each report type:
   - `fetchAttendanceReport()`
   - `fetchRevenueReport()`
   - `fetchRetentionReport()`
   - `fetchClassPopularityReport()`

4. Use the export utilities:
```typescript
import { exportToPDF, exportToCSV } from '@/lib/utils/export';

const handleExportPDF = () => {
  exportToPDF(
    reportData,
    columns,
    'attendance-report',
    'Attendance Report'
  );
};
```

### Settings Implementation Guide

**File:** `/apps/admin-dashboard/src/app/settings/page.tsx`

**What to implement:**
1. Create tab navigation component
2. Gym Info tab:
   - Form for name, address, phone, email
   - Operating hours editor
   - Logo upload

3. Memberships tab:
   - DataTable of membership plans
   - Add/Edit modal (name, price, duration, features)
   - Archive functionality

4. Policies tab:
   - Rich text editor for cancellation policy
   - Terms & conditions editor

5. Email Templates tab:
   - Template list
   - Template editor with variable insertion
   - Preview functionality

6. Users & Roles tab:
   - Admin users table
   - Add admin/trainer modal
   - Permissions checkboxes

7. Notifications tab:
   - Toggle switches for email/SMS
   - Event-based notification settings

## API Pattern

All API functions should follow this pattern:

```typescript
import { createClient } from '@/lib/supabase/client';

export async function fetchResource() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createResource(resourceData: any) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('table_name')
    .insert(resourceData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## Component Pattern

All pages should follow this pattern:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
// ... other imports

export default function ResourcePage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['resource'],
    queryFn: fetchResource,
  });

  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
      toast.success('Resource created');
    },
  });

  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

## Testing the Dashboard

### Creating Test Data

1. Create test members through the members page
2. Create test trainers by:
   - Creating a user
   - Adding admin_user record with role='trainer'
   - Adding trainer record
3. Create classes with trainers
4. Create schedules for classes
5. Create bookings for schedules

### Testing Role-Based Access

1. Login as admin - should see all admin pages
2. Login as trainer - should redirect to /trainer
3. Try accessing admin pages as trainer - should redirect
4. Test logout and re-login

## Performance Optimization

1. **Server Components**: Use server components where possible
2. **Lazy Loading**: Lazy load heavy components:
```typescript
const Calendar = dynamic(() => import('react-big-calendar'), {
  ssr: false,
  loading: () => <p>Loading calendar...</p>
});
```

3. **Debounce Search**: Already implemented in DataTable
4. **Virtual Scrolling**: For large lists, use @tanstack/react-virtual
5. **Image Optimization**: Use Next.js Image component

## Deployment Checklist

- [ ] Run database migrations
- [ ] Set environment variables
- [ ] Build the application
- [ ] Test all auth flows
- [ ] Test role-based access
- [ ] Verify RLS policies
- [ ] Test on mobile devices
- [ ] Check performance metrics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics

## Next Steps

1. **Priority 1 (Core Functionality):**
   - Complete Classes Management
   - Complete Schedule Management
   - Complete Trainers Management

2. **Priority 2 (Business Critical):**
   - Complete Payments & Billing
   - Complete Reports

3. **Priority 3 (Configuration):**
   - Complete Settings module
   - Complete trainer-specific pages

4. **Priority 4 (Enhancement):**
   - Add real-time subscriptions
   - Add email notifications
   - Add mobile app support

## Support

For questions or issues:
- Check the README.md
- Review existing implemented pages as examples
- Refer to Supabase documentation for database queries
- Check TanStack Query docs for data fetching patterns

## Conclusion

The admin dashboard has a solid foundation with authentication, authorization, layout, reusable components, and several fully implemented modules. The remaining modules follow the same patterns and can be implemented by following the guides above.

The codebase is production-ready for the implemented features and provides clear patterns for completing the remaining functionality.
