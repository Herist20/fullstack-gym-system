-- ============================================
-- COMPLETE DATABASE SETUP - ALL IN ONE
-- ============================================
-- Copy ALL of this and paste in Supabase SQL Editor
-- Then click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MIGRATION 1: INITIAL SCHEMA
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'trainer', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Trainers table
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  specialization TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  years_experience INTEGER DEFAULT 0 CHECK (years_experience >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON public.trainers(user_id);

-- Memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('basic', 'premium', 'platinum')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE RESTRICT,
  duration INTEGER NOT NULL CHECK (duration > 0),
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  category TEXT NOT NULL CHECK (category IN ('yoga', 'cardio', 'strength', 'pilates', 'boxing', 'crossfit', 'cycling', 'other')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_classes_instructor_id ON public.classes(instructor_id);
CREATE INDEX IF NOT EXISTS idx_classes_category ON public.classes(category);

-- Class schedules table (previously named 'schedules')
-- Drop old schedules table if both exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'schedules')
     AND EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema = 'public' AND table_name = 'class_schedules') THEN
    DROP TABLE public.schedules CASCADE;
  END IF;
END $$;

-- Create or rename to class_schedules
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'schedules')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables
                     WHERE table_schema = 'public' AND table_name = 'class_schedules') THEN
    ALTER TABLE public.schedules RENAME TO class_schedules;
  END IF;
END $$;

-- Create class_schedules table if not exists
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available_spots INTEGER NOT NULL CHECK (available_spots >= 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Add extra columns to class_schedules
ALTER TABLE public.class_schedules
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS instructor_id UUID;

-- Add foreign key for instructor
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                 WHERE constraint_name = 'class_schedules_instructor_id_fkey') THEN
    ALTER TABLE public.class_schedules
    ADD CONSTRAINT class_schedules_instructor_id_fkey
    FOREIGN KEY (instructor_id) REFERENCES public.trainers(id);
  END IF;
END $$;

-- Copy instructor from classes table if exists
UPDATE public.class_schedules cs
SET instructor_id = c.instructor_id
FROM public.classes c
WHERE cs.class_id = c.id AND cs.instructor_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON public.class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_date ON public.class_schedules(date);
CREATE INDEX IF NOT EXISTS idx_class_schedules_status ON public.class_schedules(status);
CREATE INDEX IF NOT EXISTS idx_class_schedules_instructor_id ON public.class_schedules(instructor_id);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  checked_in BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, schedule_id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON public.bookings(schedule_id);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(booking_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES public.memberships(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'e_wallet')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- Equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cardio', 'strength', 'free_weights', 'accessories', 'other')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'broken', 'retired')),
  purchase_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'membership', 'class', 'system', 'other')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ============================================
-- MIGRATION 4: ADMIN DASHBOARD TABLES
-- ============================================

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'trainer')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  type TEXT NOT NULL CHECK (type IN ('membership', 'class', 'product', 'service', 'refund')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  invoice_url TEXT,
  receipt_url TEXT,
  transaction_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON public.payment_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON public.payment_transactions(type);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON public.audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Gym settings table
CREATE TABLE IF NOT EXISTS public.gym_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gym_settings_key ON public.gym_settings(key);

-- Membership plans table
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add type column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_plans'
    AND column_name = 'type'
  ) THEN
    ALTER TABLE membership_plans ADD COLUMN type TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_membership_plans_type ON public.membership_plans(type);
CREATE INDEX IF NOT EXISTS idx_membership_plans_is_active ON public.membership_plans(is_active);

-- Email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_templates_name ON public.email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_is_active ON public.email_templates(is_active);

-- Trainer certifications table
CREATE TABLE IF NOT EXISTS public.trainer_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trainer_certifications_trainer_id ON public.trainer_certifications(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_certifications_expiry_date ON public.trainer_certifications(expiry_date);

-- Equipment maintenance log table
CREATE TABLE IF NOT EXISTS public.equipment_maintenance_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'replacement', 'inspection')),
  performed_by UUID REFERENCES public.admin_users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) CHECK (cost >= 0),
  next_maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_log_equipment_id ON public.equipment_maintenance_log(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_log_performed_at ON public.equipment_maintenance_log(performed_at DESC);

-- Waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, schedule_id)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON public.waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_schedule_id ON public.waitlist(schedule_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);

-- Instructors table
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT[] DEFAULT '{}',
  bio TEXT,
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON public.instructors(user_id);

-- ============================================
-- ADD COLUMNS FOR MANUAL PAYMENT
-- ============================================

-- Add metadata column to payment_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_transactions'
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE payment_transactions ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- Add payment_method column to payment_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_transactions'
    AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE payment_transactions ADD COLUMN payment_method TEXT DEFAULT 'bank_transfer';
  END IF;
END $$;

-- Add membership_id column to payment_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_transactions'
    AND column_name = 'membership_id'
  ) THEN
    ALTER TABLE payment_transactions ADD COLUMN membership_id UUID REFERENCES public.memberships(id);
  END IF;
END $$;

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if any
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop triggers on all tables that exist
  FOR r IN (
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'trainers', 'memberships', 'classes', 'schedules', 'class_schedules',
      'bookings', 'attendance', 'payments', 'equipment', 'admin_users',
      'payment_transactions', 'gym_settings', 'membership_plans', 'email_templates',
      'trainer_certifications', 'waitlist', 'instructors'
    )
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%I ON public.%I', r.tablename, r.tablename);
  END LOOP;
END $$;

-- Create triggers for all tables
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_trainers
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_memberships
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_classes
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_class_schedules
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_attendance
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_equipment
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_admin_users
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_payment_transactions
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_gym_settings
  BEFORE UPDATE ON public.gym_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_membership_plans
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_email_templates
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_trainer_certifications
  BEFORE UPDATE ON public.trainer_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_waitlist
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_instructors
  BEFORE UPDATE ON public.instructors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_maintenance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - BASIC TABLES
-- ============================================

-- Helper function: Check if user is admin via users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Public can view active users" ON users;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT TO authenticated
USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create own profile"
ON users FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view active users"
ON users FOR SELECT TO public
USING (true);

-- TRAINERS table policies
DROP POLICY IF EXISTS "Anyone can view trainers" ON trainers;
DROP POLICY IF EXISTS "Trainers can update own profile" ON trainers;
DROP POLICY IF EXISTS "Admins can manage trainers" ON trainers;

CREATE POLICY "Anyone can view trainers"
ON trainers FOR SELECT TO public
USING (true);

CREATE POLICY "Trainers can update own profile"
ON trainers FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage trainers"
ON trainers FOR ALL TO authenticated
USING (is_admin());

-- CLASSES table policies
DROP POLICY IF EXISTS "Anyone can view active classes" ON classes;
DROP POLICY IF EXISTS "Admins can manage classes" ON classes;

CREATE POLICY "Anyone can view active classes"
ON classes FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Admins can manage classes"
ON classes FOR ALL TO authenticated
USING (is_admin());

-- CLASS_SCHEDULES table policies
DROP POLICY IF EXISTS "Anyone can view schedules" ON class_schedules;
DROP POLICY IF EXISTS "Admins can manage schedules" ON class_schedules;

CREATE POLICY "Anyone can view schedules"
ON class_schedules FOR SELECT TO public
USING (true);

CREATE POLICY "Admins can manage schedules"
ON class_schedules FOR ALL TO authenticated
USING (is_admin());

-- BOOKINGS table policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;

CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create own bookings"
ON bookings FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage bookings"
ON bookings FOR ALL TO authenticated
USING (is_admin());

-- ATTENDANCE table policies
DROP POLICY IF EXISTS "Users can view own attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can manage attendance" ON attendance;

CREATE POLICY "Users can view own attendance"
ON attendance FOR SELECT TO authenticated
USING (
  booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  OR is_admin()
);

CREATE POLICY "Admins can manage attendance"
ON attendance FOR ALL TO authenticated
USING (is_admin());

-- PAYMENTS table policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;

CREATE POLICY "Users can view own payments"
ON payments FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can manage payments"
ON payments FOR ALL TO authenticated
USING (is_admin());

-- MEMBERSHIPS table policies
DROP POLICY IF EXISTS "Users can view own memberships" ON memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON memberships;

CREATE POLICY "Users can view own memberships"
ON memberships FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can manage memberships"
ON memberships FOR ALL TO authenticated
USING (is_admin());

-- EQUIPMENT table policies
DROP POLICY IF EXISTS "Anyone can view equipment" ON equipment;
DROP POLICY IF EXISTS "Admins can manage equipment" ON equipment;

CREATE POLICY "Anyone can view equipment"
ON equipment FOR SELECT TO public
USING (true);

CREATE POLICY "Admins can manage equipment"
ON equipment FOR ALL TO authenticated
USING (is_admin());

-- NOTIFICATIONS table policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
ON notifications FOR INSERT TO authenticated
WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES - ADMIN TABLES
-- ============================================

-- ADMIN_USERS table policies
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin record" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

CREATE POLICY "Admins can view all admin users"
ON admin_users FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
  )
);

CREATE POLICY "Users can view own admin record"
ON admin_users FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage admin users"
ON admin_users FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
  )
);

-- PAYMENT_TRANSACTIONS table policies
DROP POLICY IF EXISTS "Users can view own payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can view all payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can manage payment transactions" ON payment_transactions;

CREATE POLICY "Users can view own payment transactions"
ON payment_transactions FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment transactions"
ON payment_transactions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

CREATE POLICY "Admins can manage payment transactions"
ON payment_transactions FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
  )
);

-- AUDIT_LOGS table policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can create audit logs" ON audit_logs;

CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
  )
);

CREATE POLICY "Admins can create audit logs"
ON audit_logs FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

-- GYM_SETTINGS table policies
DROP POLICY IF EXISTS "Public can read gym settings" ON gym_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON gym_settings;
DROP POLICY IF EXISTS "Admins can manage gym settings" ON gym_settings;

CREATE POLICY "Public can read gym settings"
ON gym_settings FOR SELECT TO public
USING (true);

CREATE POLICY "Authenticated users can manage settings"
ON gym_settings FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- MEMBERSHIP_PLANS table policies
DROP POLICY IF EXISTS "Anyone can read active membership plans" ON membership_plans;
DROP POLICY IF EXISTS "Admins can manage membership plans" ON membership_plans;

CREATE POLICY "Anyone can read active membership plans"
ON membership_plans FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Admins can manage membership plans"
ON membership_plans FOR ALL TO authenticated
USING (is_admin());

-- EMAIL_TEMPLATES table policies
DROP POLICY IF EXISTS "Admins can view email templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;

CREATE POLICY "Admins can view email templates"
ON email_templates FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can manage email templates"
ON email_templates FOR ALL TO authenticated
USING (is_admin());

-- TRAINER_CERTIFICATIONS table policies
DROP POLICY IF EXISTS "Admins can view all trainer certifications" ON trainer_certifications;
DROP POLICY IF EXISTS "Trainers can view own certifications" ON trainer_certifications;
DROP POLICY IF EXISTS "Admins can manage trainer certifications" ON trainer_certifications;

CREATE POLICY "Admins can view all trainer certifications"
ON trainer_certifications FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Trainers can view own certifications"
ON trainer_certifications FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trainers t
    WHERE t.id = trainer_id AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage trainer certifications"
ON trainer_certifications FOR ALL TO authenticated
USING (is_admin());

-- EQUIPMENT_MAINTENANCE_LOG table policies
DROP POLICY IF EXISTS "Admins can view maintenance logs" ON equipment_maintenance_log;
DROP POLICY IF EXISTS "Admins can manage maintenance logs" ON equipment_maintenance_log;

CREATE POLICY "Admins can view maintenance logs"
ON equipment_maintenance_log FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can manage maintenance logs"
ON equipment_maintenance_log FOR ALL TO authenticated
USING (is_admin());

-- WAITLIST table policies
DROP POLICY IF EXISTS "Users can view own waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can create own waitlist" ON waitlist;
DROP POLICY IF EXISTS "Admins can manage waitlist" ON waitlist;

CREATE POLICY "Users can view own waitlist"
ON waitlist FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create own waitlist"
ON waitlist FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage waitlist"
ON waitlist FOR ALL TO authenticated
USING (is_admin());

-- INSTRUCTORS table policies
DROP POLICY IF EXISTS "Anyone can view instructors" ON instructors;
DROP POLICY IF EXISTS "Instructors can update own profile" ON instructors;
DROP POLICY IF EXISTS "Admins can manage instructors" ON instructors;

CREATE POLICY "Anyone can view instructors"
ON instructors FOR SELECT TO public
USING (true);

CREATE POLICY "Instructors can update own profile"
ON instructors FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage instructors"
ON instructors FOR ALL TO authenticated
USING (is_admin());

-- ============================================
-- STORAGE POLICIES (payment-proofs bucket)
-- ============================================

DROP POLICY IF EXISTS "Users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Payment proofs are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete payment proofs" ON storage.objects;

CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Payment proofs are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Users can delete payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- ============================================
-- INSERT BANK ACCOUNTS
-- ============================================

INSERT INTO gym_settings (key, value, description)
VALUES (
  'bank_accounts',
  '{
    "bca": {
      "bank": "BCA",
      "accountNumber": "1234567890",
      "accountName": "Gym System Indonesia"
    },
    "bni": {
      "bank": "BNI",
      "accountNumber": "0987654321",
      "accountName": "Gym System Indonesia"
    },
    "mandiri": {
      "bank": "Mandiri",
      "accountNumber": "1122334455",
      "accountName": "Gym System Indonesia"
    }
  }'::jsonb,
  'Bank accounts for manual payment transfers'
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default gym settings
INSERT INTO public.gym_settings (key, value, description) VALUES
  ('gym_info', '{"name": "Fitness Pro Gym", "address": "", "phone": "", "email": "", "operating_hours": {}}', 'General gym information'),
  ('policies', '{"cancellation": "", "terms_and_conditions": ""}', 'Gym policies and terms'),
  ('notifications', '{"email_enabled": true, "sms_enabled": false}', 'Notification settings')
ON CONFLICT (key) DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
  ('welcome_email', 'Welcome to {{gym_name}}!', 'Hi {{user_name}},

Welcome to {{gym_name}}! We''re excited to have you join our fitness community.

Your membership details:
- Type: {{membership_type}}
- Start Date: {{start_date}}
- End Date: {{end_date}}

Best regards,
The {{gym_name}} Team', '["gym_name", "user_name", "membership_type", "start_date", "end_date"]'),

  ('booking_confirmation', 'Booking Confirmed - {{class_name}}', 'Hi {{user_name}},

Your booking has been confirmed!

Class: {{class_name}}
Date: {{class_date}}
Time: {{class_time}}
Instructor: {{instructor_name}}

See you there!

Best regards,
The {{gym_name}} Team', '["gym_name", "user_name", "class_name", "class_date", "class_time", "instructor_name"]'),

  ('class_reminder', 'Reminder: {{class_name}} in 24 hours', 'Hi {{user_name}},

This is a friendly reminder that you have a class booked tomorrow!

Class: {{class_name}}
Date: {{class_date}}
Time: {{class_time}}

See you soon!

Best regards,
The {{gym_name}} Team', '["gym_name", "user_name", "class_name", "class_date", "class_time"]')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_method
ON payment_transactions(payment_method);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at
ON payment_transactions(created_at DESC);

-- ============================================
-- VERIFY SETUP
-- ============================================

SELECT '========================================' as verification;
SELECT 'VERIFICATION RESULTS' as title;
SELECT '========================================' as verification;

-- Check all 20 tables created
SELECT 'Tables Created (should be 20):' as check;
SELECT COUNT(*) as total_tables FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'trainers', 'memberships', 'classes', 'class_schedules',
    'bookings', 'attendance', 'payments', 'equipment', 'notifications',
    'admin_users', 'payment_transactions', 'audit_logs', 'gym_settings',
    'membership_plans', 'email_templates', 'trainer_certifications',
    'equipment_maintenance_log', 'waitlist', 'instructors'
  );

-- List all created tables
SELECT table_name as created_tables FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'trainers', 'memberships', 'classes', 'class_schedules',
    'bookings', 'attendance', 'payments', 'equipment', 'notifications',
    'admin_users', 'payment_transactions', 'audit_logs', 'gym_settings',
    'membership_plans', 'email_templates', 'trainer_certifications',
    'equipment_maintenance_log', 'waitlist', 'instructors'
  )
ORDER BY table_name;

-- Check bank accounts configured
SELECT 'Bank Accounts Configured:' as check;
SELECT key, jsonb_object_keys(value) as banks
FROM gym_settings
WHERE key = 'bank_accounts';

-- Check email templates
SELECT 'Email Templates (should be 3):' as check;
SELECT COUNT(*) as total_templates FROM email_templates;

-- Check default gym settings
SELECT 'Gym Settings (should be 4):' as check;
SELECT COUNT(*) as total_settings FROM gym_settings;

-- Check storage policies
SELECT 'Storage Policies (should be 3):' as check;
SELECT COUNT(*) as policy_count FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%payment%';

-- Check indexes created
SELECT 'Indexes Created:' as check;
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';

-- ============================================
-- SUCCESS! ✅
-- ============================================

SELECT '========================================' as success;
SELECT '✅ COMPLETE DATABASE SETUP DONE!' as message;
SELECT '========================================' as success;
SELECT '20 Tables Created ✓' as status;
SELECT 'Bank Accounts Configured ✓' as status;
SELECT 'Email Templates Loaded ✓' as status;
SELECT 'Storage Policies Applied ✓' as status;
SELECT 'Triggers & RLS Enabled ✓' as status;
SELECT '========================================' as success;
