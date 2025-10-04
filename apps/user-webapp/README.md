# User WebApp - Member Portal

Member portal untuk logged-in users dengan fitur lengkap untuk manajemen kelas gym, booking, membership, dan profil.

## Features Implemented

### Authentication
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Forgot password (`/forgot-password`)
- ✅ Protected routes dengan middleware
- ✅ Auto-redirect untuk authenticated users

### Main Pages

#### 1. Dashboard (`/`)
- Welcome message dengan user stats
- Upcoming bookings (next 3 classes)
- Membership status card
- Quick actions: Book Class, View Schedule
- Recent activity feed

#### 2. Classes (`/classes`)
- List view dengan filters
- Search functionality (by class name or instructor)
- Book class dengan availability check
- Waitlist feature jika full
- Real-time availability updates

#### 3. My Bookings (`/bookings`)
- Upcoming bookings dengan countdown timer
- Past bookings history
- Cancel booking (dengan deadline policy 2 jam)
- Download QR code untuk check-in
- Tab navigation (Upcoming/Past)

#### 4. Schedule (`/schedule`)
- Weekly calendar view
- Week navigation (Previous/Today/Next)
- Add to Google Calendar integration
- Grouped by day display

#### 5. Membership (`/membership`)
- Current plan details
- Usage statistics (classes attended this month)
- Auto-renewal toggle
- Payment history table
- Membership status indicator

#### 6. Profile (`/profile`)
- Edit personal info (name, phone, address, emergency contact)
- Change password
- Upload avatar (with file validation)
- Notification preferences
- Tab navigation (Profile/Password/Preferences)

#### 7. Notifications (`/notifications`)
- In-app notification center
- Mark as read functionality
- Filter by type (booking, reminder, promotion, system)
- Mark all as read
- Icon indicators per notification type

## Technical Implementation

### State Management
- **Zustand** untuk global state:
  - `auth.store.ts` - User authentication state
  - `booking.store.ts` - Booking flow state
  - `notification.store.ts` - Notifications state

### Data Fetching
- **TanStack Query** untuk:
  - Server state caching
  - Automatic refetching
  - Optimistic updates
  - Loading/error states

### Real-time Features
- **Supabase Subscriptions** untuk:
  - Booking availability updates
  - New notifications
  - Class schedule changes

### Form Validation
- **Zod schemas** untuk validation:
  - `auth.schema.ts` - Login, register, password reset
  - `booking.schema.ts` - Book class, cancel booking
  - Form integration via `react-hook-form` + `@hookform/resolvers`

### UI Components
- **Shared components**:
  - `LoadingSpinner` - Loading states (sm/md/lg)
  - `ErrorBoundary` - Error handling
  - `DashboardLayout` - Main layout dengan sidebar & header
  - `Sidebar` - Navigation menu
  - `Header` - User info & notifications badge

### API Layer
- Organized API functions:
  - `auth.api.ts` - Authentication operations
  - `bookings.api.ts` - Booking CRUD
  - `classes.api.ts` - Class & schedule queries
  - `membership.api.ts` - Membership management
  - `notifications.api.ts` - Notifications

### Custom Hooks
- `use-auth.ts` - Authentication logic
- `use-bookings.ts` - Booking operations
- `use-classes.ts` - Class queries
- `use-membership.ts` - Membership data
- `use-notifications.ts` - Notification management
- `use-realtime.ts` - Realtime subscriptions

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server:
```bash
pnpm dev
```

Server akan berjalan di: http://localhost:3001

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Icons**: Heroicons
- **QR Code**: qrcode.react
- **Notifications**: Sonner (toast)
- **Date Utilities**: date-fns

## File Structure

```
apps/user-webapp/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (dashboard)/          # Protected routes group
│   │   │   ├── bookings/
│   │   │   ├── classes/
│   │   │   ├── membership/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   └── schedule/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Dashboard
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── providers/            # React Query provider
│   │   └── ui/                   # Shared UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── api/                  # API functions
│   │   ├── schemas/              # Zod validation schemas
│   │   ├── supabase/             # Supabase clients
│   │   └── utils.ts              # Utility functions
│   ├── store/                    # Zustand stores
│   ├── styles/                   # Global styles
│   └── middleware.ts             # Auth middleware
├── .env.example
├── package.json
└── tsconfig.json
```

## Key Features Highlights

### Real-time Updates
- Booking availability updates automatically ketika ada perubahan
- Notifications muncul real-time tanpa refresh
- Class schedule updates langsung terlihat

### Optimistic Updates
- UI updates immediately saat booking/cancel
- Rollback otomatis jika ada error
- Better UX dengan instant feedback

### Error Handling
- Global error boundary untuk catch errors
- Toast notifications untuk user feedback
- Proper loading states di semua operations

### Security
- Protected routes dengan middleware
- Server-side authentication checks
- Secure file upload dengan validation
- CSRF protection via Supabase

### Accessibility
- Semantic HTML
- Keyboard navigation support
- ARIA labels untuk screen readers
- Focus management

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anonymous key
```

## Development Notes

- Development server runs on port **3001**
- Hot reload enabled untuk fast development
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Path aliases configured (`@/*`)

## Production Deployment

Build untuk production:
```bash
pnpm build
```

Start production server:
```bash
pnpm start
```

## Next Steps / Future Enhancements

- [ ] PWA capabilities dengan service worker
- [ ] Push notifications (Web Push API)
- [ ] Offline mode dengan service worker caching
- [ ] Class rating & review system
- [ ] Social sharing features
- [ ] Advanced calendar views (Month view)
- [ ] Workout tracking & history
- [ ] Achievement badges & gamification
- [ ] Friend referral system
- [ ] In-app messaging dengan instructor

## License

Private - Gym Management System
