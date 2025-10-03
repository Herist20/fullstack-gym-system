# Supabase Database Schema - Gym Management System

This directory contains all database migrations, policies, functions, and seed data for the Gym Management System.

## 📁 Structure

```
supabase/
├── migrations/
│   ├── 20250101000000_initial_schema.sql    # Core tables with indexes & triggers
│   ├── 20250101000001_rls_policies.sql      # Row Level Security policies
│   └── 20250101000002_functions.sql         # Database functions
├── seed.sql                                  # Development seed data
└── README.md                                 # This file
```

## 🗄️ Database Tables

### Core Tables

1. **users** - Extends Supabase auth.users
   - Stores user profiles (members, trainers, admins)
   - Indexed on: role, email

2. **trainers** - Trainer-specific information
   - Specialization, bio, rating, experience
   - Indexed on: user_id, specialization (GIN)

3. **memberships** - Membership subscriptions
   - Types: basic, premium, platinum
   - Auto-expires based on end_date
   - Indexed on: user_id, status, end_date

4. **classes** - Gym classes/programs
   - Categories: yoga, cardio, strength, etc.
   - Linked to trainer
   - Indexed on: instructor_id, category, is_active

5. **schedules** - Class schedules
   - Date, time, availability tracking
   - Auto-manages available_spots via triggers
   - Indexed on: class_id, date, status

6. **bookings** - Member class bookings
   - Status: confirmed, cancelled, completed, no_show
   - Unique constraint: (user_id, schedule_id)
   - Indexed on: user_id, schedule_id, status

7. **attendance** - Check-in/out records
   - Linked to bookings
   - Tracks actual attendance
   - Indexed on: booking_id, check_in_time

8. **payments** - Payment transactions
   - Multiple payment methods supported
   - Linked to memberships
   - Indexed on: user_id, membership_id, status

9. **equipment** - Gym equipment tracking
   - Maintenance scheduling
   - Status tracking
   - Indexed on: category, status, next_maintenance

10. **notifications** - User notifications
    - Types: booking, payment, membership, etc.
    - Indexed on: user_id, read, created_at

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### User Roles
- **Admin**: Full access to all tables
- **Trainer**: Can view/manage their classes, schedules, bookings, and attendance
- **Member**: Can view their own data and public information

### Key Policies
- Users can view and update their own profiles
- Trainers can manage their class schedules and view class bookings
- Members can book classes and view their bookings/attendance
- Admins have full CRUD access to all resources

### Helper Functions
- `is_admin()` - Check if current user is admin
- `is_trainer()` - Check if current user is trainer
- `is_member()` - Check if current user is member

## 🔧 Database Functions

### Query Functions

1. **get_user_bookings(user_id, status?, from_date?, to_date?)**
   - Returns user bookings with class details
   - Supports filtering by status and date range

2. **check_class_availability(schedule_id)**
   - Returns class availability status
   - Shows available spots and capacity

3. **get_upcoming_classes(from_date?, days?, category?)**
   - Returns upcoming scheduled classes
   - Supports filtering by date range and category

4. **get_trainer_schedule(trainer_id, from_date?, to_date?)**
   - Returns trainer's class schedule
   - Shows booking counts per class

5. **get_user_active_membership(user_id)**
   - Returns user's current active membership
   - Shows days remaining

6. **get_class_attendance_stats(class_id, from_date?, to_date?)**
   - Returns attendance statistics for a class
   - Includes attendance rate and averages

7. **get_member_statistics(user_id)**
   - Returns member's workout statistics
   - Shows attendance rate and favorite category

### Action Functions

1. **book_class(user_id, schedule_id)**
   - Books a class with validation
   - Checks membership, availability, duplicates
   - Creates notification on success

2. **cancel_booking(booking_id, user_id, reason?)**
   - Cancels a booking
   - Restores available spots
   - Creates notification

3. **check_in_to_class(booking_id)**
   - Records class attendance
   - Updates booking status
   - Creates attendance record

## 🔄 Automatic Triggers

### Updated At Trigger
- Automatically updates `updated_at` timestamp on all tables

### Booking Spots Management
- Decreases available_spots when booking confirmed
- Increases available_spots when booking cancelled
- Prevents overbooking with constraints

### Membership Expiry
- Auto-expires memberships when end_date passes
- Runs on INSERT and UPDATE

## 📊 Seed Data

The `seed.sql` file contains development data:

- 1 Admin user
- 4 Trainers with different specializations
- 5 Members with active memberships
- 12 Classes across all categories
- 35+ Scheduled classes for the week
- Sample bookings and payments
- 20 Equipment items
- Sample notifications

### Default User Credentials (Development)

**Admin:**
- Email: admin@gymfit.com
- ID: 00000000-0000-0000-0000-000000000001

**Trainers:**
- john.trainer@gymfit.com (Strength/CrossFit)
- sarah.trainer@gymfit.com (Yoga/Pilates)
- mike.trainer@gymfit.com (Cardio/Cycling)
- emma.trainer@gymfit.com (Mixed)

**Members:**
- member1@gmail.com - member5@gmail.com

> **Note:** In production, users are created through Supabase Auth. The seed data assumes these auth.users records exist.

## 🚀 Setup Instructions

### 1. Initialize Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not done)
supabase init
```

### 2. Link to Remote Project

```bash
# Link to your Supabase project
supabase link --project-ref <your-project-ref>
```

### 3. Run Migrations

```bash
# Push migrations to remote database
supabase db push

# Or apply specific migration
supabase migration up
```

### 4. Seed Development Data

```bash
# Run seed file
supabase db reset --db-url <your-database-url>

# Or use psql
psql <your-database-url> -f supabase/seed.sql
```

### 5. Generate TypeScript Types

```bash
# Generate types from database
supabase gen types typescript --local > src/types/database.types.ts

# Or for remote database
supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts
```

## 🔑 Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📝 Best Practices

1. **Migrations**: Always create new migration files, never modify existing ones
2. **RLS**: Test policies thoroughly before deploying to production
3. **Functions**: Use SECURITY DEFINER carefully, validate all inputs
4. **Indexes**: Monitor query performance and add indexes as needed
5. **Seed Data**: Don't run seed data in production

## 🧪 Testing

Test RLS policies:

```sql
-- Set session to specific user
SELECT auth.uid(); -- Should return current user ID

-- Test as member
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "member-uuid"}';

-- Run queries to test access
SELECT * FROM bookings;
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Troubleshooting

### Common Issues

1. **Migration fails**
   - Check for existing tables/constraints
   - Ensure proper order of migrations
   - Check foreign key references

2. **RLS denies access**
   - Verify user role in users table
   - Check policy conditions
   - Test with service role key for debugging

3. **Trigger not firing**
   - Check trigger timing (BEFORE/AFTER)
   - Verify trigger is enabled
   - Check function logic

4. **Type generation fails**
   - Ensure migrations are applied
   - Check Supabase CLI version
   - Verify database connection
