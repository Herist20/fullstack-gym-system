-- Initial Schema for Gym Management System
-- Migration: 20250101000000_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'trainer', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on role for faster filtering
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);

-- =====================================================
-- TRAINERS TABLE
-- =====================================================
CREATE TABLE public.trainers (
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

CREATE INDEX idx_trainers_user_id ON public.trainers(user_id);
CREATE INDEX idx_trainers_specialization ON public.trainers USING GIN(specialization);

-- =====================================================
-- MEMBERSHIPS TABLE
-- =====================================================
CREATE TABLE public.memberships (
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

CREATE INDEX idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX idx_memberships_status ON public.memberships(status);
CREATE INDEX idx_memberships_end_date ON public.memberships(end_date);

-- =====================================================
-- CLASSES TABLE
-- =====================================================
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE RESTRICT,
  duration INTEGER NOT NULL CHECK (duration > 0), -- in minutes
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  category TEXT NOT NULL CHECK (category IN ('yoga', 'cardio', 'strength', 'pilates', 'boxing', 'crossfit', 'cycling', 'other')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_classes_instructor_id ON public.classes(instructor_id);
CREATE INDEX idx_classes_category ON public.classes(category);
CREATE INDEX idx_classes_is_active ON public.classes(is_active);

-- =====================================================
-- SCHEDULES TABLE
-- =====================================================
CREATE TABLE public.schedules (
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

CREATE INDEX idx_schedules_class_id ON public.schedules(class_id);
CREATE INDEX idx_schedules_date ON public.schedules(date);
CREATE INDEX idx_schedules_status ON public.schedules(status);
CREATE INDEX idx_schedules_date_time ON public.schedules(date, start_time);

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  checked_in BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, schedule_id)
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_schedule_id ON public.bookings(schedule_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);

-- =====================================================
-- ATTENDANCE TABLE
-- =====================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(booking_id),
  CONSTRAINT valid_checkout_time CHECK (check_out_time IS NULL OR check_out_time > check_in_time)
);

CREATE INDEX idx_attendance_booking_id ON public.attendance(booking_id);
CREATE INDEX idx_attendance_check_in_time ON public.attendance(check_in_time);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE public.payments (
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

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_membership_id ON public.payments(membership_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);

-- =====================================================
-- EQUIPMENT TABLE
-- =====================================================
CREATE TABLE public.equipment (
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

CREATE INDEX idx_equipment_category ON public.equipment(category);
CREATE INDEX idx_equipment_status ON public.equipment(status);
CREATE INDEX idx_equipment_next_maintenance ON public.equipment(next_maintenance);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'membership', 'class', 'system', 'other')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER set_updated_at_schedules
  BEFORE UPDATE ON public.schedules
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

-- =====================================================
-- TRIGGER TO UPDATE AVAILABLE SPOTS ON BOOKING
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_booking_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    -- Decrease available spots
    UPDATE public.schedules
    SET available_spots = available_spots - 1
    WHERE id = NEW.schedule_id AND available_spots > 0;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No available spots for this schedule';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If booking was confirmed and now cancelled, increase spots
    IF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'no_show') THEN
      UPDATE public.schedules
      SET available_spots = available_spots + 1
      WHERE id = NEW.schedule_id;
    -- If booking was cancelled and now confirmed, decrease spots
    ELSIF OLD.status IN ('cancelled', 'no_show') AND NEW.status = 'confirmed' THEN
      UPDATE public.schedules
      SET available_spots = available_spots - 1
      WHERE id = NEW.schedule_id AND available_spots > 0;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'No available spots for this schedule';
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    -- Increase available spots when confirmed booking is deleted
    UPDATE public.schedules
    SET available_spots = available_spots + 1
    WHERE id = OLD.schedule_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_booking_spots
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_spots();

-- =====================================================
-- TRIGGER TO AUTO-EXPIRE MEMBERSHIPS
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_membership_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < CURRENT_DATE AND NEW.status = 'active' THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_expire_membership
  BEFORE INSERT OR UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.check_membership_expiry();
-- Row Level Security (RLS) Policies
-- Migration: 20250101000001_rls_policies

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is trainer
CREATE OR REPLACE FUNCTION public.is_trainer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'trainer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is member
CREATE OR REPLACE FUNCTION public.is_member()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'member'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (is_admin());

-- Trainers can view all users (for booking/class management)
CREATE POLICY "Trainers can view all users"
  ON public.users FOR SELECT
  USING (is_trainer());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (is_admin());

-- Admins can insert users
CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (is_admin());

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can create own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can delete users
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (is_admin());

-- =====================================================
-- TRAINERS TABLE POLICIES
-- =====================================================

-- Everyone can view trainers
CREATE POLICY "Anyone can view trainers"
  ON public.trainers FOR SELECT
  USING (true);

-- Trainers can update own profile
CREATE POLICY "Trainers can update own profile"
  ON public.trainers FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can manage all trainers
CREATE POLICY "Admins can manage trainers"
  ON public.trainers FOR ALL
  USING (is_admin());

-- =====================================================
-- MEMBERSHIPS TABLE POLICIES
-- =====================================================

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
  ON public.memberships FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all memberships
CREATE POLICY "Admins can view all memberships"
  ON public.memberships FOR SELECT
  USING (is_admin());

-- Trainers can view all memberships
CREATE POLICY "Trainers can view all memberships"
  ON public.memberships FOR SELECT
  USING (is_trainer());

-- Admins can manage memberships
CREATE POLICY "Admins can manage memberships"
  ON public.memberships FOR ALL
  USING (is_admin());

-- =====================================================
-- CLASSES TABLE POLICIES
-- =====================================================

-- Everyone can view active classes
CREATE POLICY "Anyone can view active classes"
  ON public.classes FOR SELECT
  USING (is_active = true);

-- Admins can view all classes
CREATE POLICY "Admins can view all classes"
  ON public.classes FOR SELECT
  USING (is_admin());

-- Trainers can view classes they instruct
CREATE POLICY "Trainers can view own classes"
  ON public.classes FOR SELECT
  USING (
    instructor_id IN (
      SELECT id FROM public.trainers WHERE user_id = auth.uid()
    )
  );

-- Admins can manage classes
CREATE POLICY "Admins can manage classes"
  ON public.classes FOR ALL
  USING (is_admin());

-- =====================================================
-- SCHEDULES TABLE POLICIES
-- =====================================================

-- Everyone can view schedules
CREATE POLICY "Anyone can view schedules"
  ON public.schedules FOR SELECT
  USING (true);

-- Admins can manage schedules
CREATE POLICY "Admins can manage schedules"
  ON public.schedules FOR ALL
  USING (is_admin());

-- Trainers can manage their own class schedules
CREATE POLICY "Trainers can manage own schedules"
  ON public.schedules FOR ALL
  USING (
    class_id IN (
      SELECT c.id FROM public.classes c
      INNER JOIN public.trainers t ON c.instructor_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (is_admin());

-- Trainers can view bookings for their classes
CREATE POLICY "Trainers can view class bookings"
  ON public.bookings FOR SELECT
  USING (
    schedule_id IN (
      SELECT s.id FROM public.schedules s
      INNER JOIN public.classes c ON s.class_id = c.id
      INNER JOIN public.trainers t ON c.instructor_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can cancel their own bookings
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all bookings
CREATE POLICY "Admins can manage bookings"
  ON public.bookings FOR ALL
  USING (is_admin());

-- Trainers can update bookings for their classes (check-in)
CREATE POLICY "Trainers can update class bookings"
  ON public.bookings FOR UPDATE
  USING (
    schedule_id IN (
      SELECT s.id FROM public.schedules s
      INNER JOIN public.classes c ON s.class_id = c.id
      INNER JOIN public.trainers t ON c.instructor_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- =====================================================
-- ATTENDANCE TABLE POLICIES
-- =====================================================

-- Users can view their own attendance
CREATE POLICY "Users can view own attendance"
  ON public.attendance FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE user_id = auth.uid()
    )
  );

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (is_admin());

-- Trainers can view attendance for their classes
CREATE POLICY "Trainers can view class attendance"
  ON public.attendance FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      INNER JOIN public.schedules s ON b.schedule_id = s.id
      INNER JOIN public.classes c ON s.class_id = c.id
      INNER JOIN public.trainers t ON c.instructor_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Admins can manage attendance
CREATE POLICY "Admins can manage attendance"
  ON public.attendance FOR ALL
  USING (is_admin());

-- Trainers can manage attendance for their classes
CREATE POLICY "Trainers can manage class attendance"
  ON public.attendance FOR ALL
  USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      INNER JOIN public.schedules s ON b.schedule_id = s.id
      INNER JOIN public.classes c ON s.class_id = c.id
      INNER JOIN public.trainers t ON c.instructor_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- =====================================================
-- PAYMENTS TABLE POLICIES
-- =====================================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (is_admin());

-- Admins can manage payments
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (is_admin());

-- =====================================================
-- EQUIPMENT TABLE POLICIES
-- =====================================================

-- Everyone can view equipment
CREATE POLICY "Anyone can view equipment"
  ON public.equipment FOR SELECT
  USING (true);

-- Admins can manage equipment
CREATE POLICY "Admins can manage equipment"
  ON public.equipment FOR ALL
  USING (is_admin());

-- Trainers can update equipment status (maintenance)
CREATE POLICY "Trainers can update equipment"
  ON public.equipment FOR UPDATE
  USING (is_trainer());

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
  ON public.notifications FOR SELECT
  USING (is_admin());

-- Admins can manage notifications
CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  USING (is_admin());

-- System can create notifications (using service role)
CREATE POLICY "Service role can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
-- Database Functions for Common Queries
-- Migration: 20250101000002_functions

-- =====================================================
-- GET USER BOOKINGS WITH DETAILS
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_bookings(
  p_user_id UUID,
  p_status TEXT DEFAULT NULL,
  p_from_date DATE DEFAULT NULL,
  p_to_date DATE DEFAULT NULL
)
RETURNS TABLE (
  booking_id UUID,
  schedule_id UUID,
  class_id UUID,
  class_name TEXT,
  class_category TEXT,
  instructor_name TEXT,
  schedule_date DATE,
  start_time TIME,
  end_time TIME,
  duration INTEGER,
  booking_status TEXT,
  checked_in BOOLEAN,
  booking_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id AS booking_id,
    s.id AS schedule_id,
    c.id AS class_id,
    c.name AS class_name,
    c.category AS class_category,
    u.full_name AS instructor_name,
    s.date AS schedule_date,
    s.start_time,
    s.end_time,
    c.duration,
    b.status AS booking_status,
    b.checked_in,
    b.booking_date
  FROM public.bookings b
  INNER JOIN public.schedules s ON b.schedule_id = s.id
  INNER JOIN public.classes c ON s.class_id = c.id
  INNER JOIN public.trainers t ON c.instructor_id = t.id
  INNER JOIN public.users u ON t.user_id = u.id
  WHERE b.user_id = p_user_id
    AND (p_status IS NULL OR b.status = p_status)
    AND (p_from_date IS NULL OR s.date >= p_from_date)
    AND (p_to_date IS NULL OR s.date <= p_to_date)
  ORDER BY s.date DESC, s.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CHECK CLASS AVAILABILITY
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_class_availability(
  p_schedule_id UUID
)
RETURNS TABLE (
  schedule_id UUID,
  class_name TEXT,
  date DATE,
  start_time TIME,
  end_time TIME,
  max_capacity INTEGER,
  available_spots INTEGER,
  is_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS schedule_id,
    c.name AS class_name,
    s.date,
    s.start_time,
    s.end_time,
    c.max_capacity,
    s.available_spots,
    (s.available_spots > 0 AND s.status = 'scheduled') AS is_available
  FROM public.schedules s
  INNER JOIN public.classes c ON s.class_id = c.id
  WHERE s.id = p_schedule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET UPCOMING CLASSES WITH AVAILABILITY
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_upcoming_classes(
  p_from_date DATE DEFAULT CURRENT_DATE,
  p_days INTEGER DEFAULT 7,
  p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  schedule_id UUID,
  class_id UUID,
  class_name TEXT,
  class_description TEXT,
  class_category TEXT,
  instructor_id UUID,
  instructor_name TEXT,
  instructor_specialization TEXT[],
  schedule_date DATE,
  start_time TIME,
  end_time TIME,
  duration INTEGER,
  max_capacity INTEGER,
  available_spots INTEGER,
  is_available BOOLEAN,
  image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS schedule_id,
    c.id AS class_id,
    c.name AS class_name,
    c.description AS class_description,
    c.category AS class_category,
    t.id AS instructor_id,
    u.full_name AS instructor_name,
    t.specialization AS instructor_specialization,
    s.date AS schedule_date,
    s.start_time,
    s.end_time,
    c.duration,
    c.max_capacity,
    s.available_spots,
    (s.available_spots > 0 AND s.status = 'scheduled') AS is_available,
    c.image_url
  FROM public.schedules s
  INNER JOIN public.classes c ON s.class_id = c.id
  INNER JOIN public.trainers t ON c.instructor_id = t.id
  INNER JOIN public.users u ON t.user_id = u.id
  WHERE s.date >= p_from_date
    AND s.date <= (p_from_date + p_days)
    AND s.status = 'scheduled'
    AND c.is_active = true
    AND (p_category IS NULL OR c.category = p_category)
  ORDER BY s.date ASC, s.start_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET TRAINER SCHEDULE
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_trainer_schedule(
  p_trainer_id UUID,
  p_from_date DATE DEFAULT CURRENT_DATE,
  p_to_date DATE DEFAULT NULL
)
RETURNS TABLE (
  schedule_id UUID,
  class_id UUID,
  class_name TEXT,
  schedule_date DATE,
  start_time TIME,
  end_time TIME,
  duration INTEGER,
  max_capacity INTEGER,
  available_spots INTEGER,
  booked_count INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS schedule_id,
    c.id AS class_id,
    c.name AS class_name,
    s.date AS schedule_date,
    s.start_time,
    s.end_time,
    c.duration,
    c.max_capacity,
    s.available_spots,
    (c.max_capacity - s.available_spots) AS booked_count,
    s.status
  FROM public.schedules s
  INNER JOIN public.classes c ON s.class_id = c.id
  WHERE c.instructor_id = p_trainer_id
    AND s.date >= p_from_date
    AND (p_to_date IS NULL OR s.date <= p_to_date)
  ORDER BY s.date ASC, s.start_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET USER ACTIVE MEMBERSHIP
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_active_membership(
  p_user_id UUID
)
RETURNS TABLE (
  membership_id UUID,
  membership_type TEXT,
  start_date DATE,
  end_date DATE,
  days_remaining INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS membership_id,
    m.membership_type,
    m.start_date,
    m.end_date,
    (m.end_date - CURRENT_DATE) AS days_remaining,
    m.status
  FROM public.memberships m
  WHERE m.user_id = p_user_id
    AND m.status = 'active'
    AND m.end_date >= CURRENT_DATE
  ORDER BY m.end_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET CLASS ATTENDANCE STATS
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_class_attendance_stats(
  p_class_id UUID,
  p_from_date DATE DEFAULT NULL,
  p_to_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_schedules BIGINT,
  total_bookings BIGINT,
  total_attended BIGINT,
  total_no_shows BIGINT,
  attendance_rate DECIMAL,
  average_attendance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT s.id) AS total_schedules,
    COUNT(b.id) AS total_bookings,
    COUNT(a.id) AS total_attended,
    COUNT(CASE WHEN b.status = 'no_show' THEN 1 END) AS total_no_shows,
    CASE
      WHEN COUNT(b.id) > 0
      THEN ROUND((COUNT(a.id)::DECIMAL / COUNT(b.id)::DECIMAL) * 100, 2)
      ELSE 0
    END AS attendance_rate,
    CASE
      WHEN COUNT(DISTINCT s.id) > 0
      THEN ROUND(COUNT(a.id)::DECIMAL / COUNT(DISTINCT s.id)::DECIMAL, 2)
      ELSE 0
    END AS average_attendance
  FROM public.schedules s
  LEFT JOIN public.bookings b ON s.id = b.schedule_id
  LEFT JOIN public.attendance a ON b.id = a.booking_id
  WHERE s.class_id = p_class_id
    AND s.status = 'completed'
    AND (p_from_date IS NULL OR s.date >= p_from_date)
    AND (p_to_date IS NULL OR s.date <= p_to_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET MEMBER STATISTICS
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_member_statistics(
  p_user_id UUID
)
RETURNS TABLE (
  total_bookings BIGINT,
  total_attended BIGINT,
  total_cancelled BIGINT,
  total_no_shows BIGINT,
  attendance_rate DECIMAL,
  favorite_class_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH booking_stats AS (
    SELECT
      COUNT(*) AS total_bookings,
      COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS total_attended,
      COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS total_cancelled,
      COUNT(CASE WHEN b.status = 'no_show' THEN 1 END) AS total_no_shows
    FROM public.bookings b
    WHERE b.user_id = p_user_id
  ),
  category_stats AS (
    SELECT
      c.category,
      COUNT(*) AS category_count
    FROM public.bookings b
    INNER JOIN public.schedules s ON b.schedule_id = s.id
    INNER JOIN public.classes c ON s.class_id = c.id
    WHERE b.user_id = p_user_id
    GROUP BY c.category
    ORDER BY category_count DESC
    LIMIT 1
  )
  SELECT
    bs.total_bookings,
    bs.total_attended,
    bs.total_cancelled,
    bs.total_no_shows,
    CASE
      WHEN bs.total_bookings > 0
      THEN ROUND((bs.total_attended::DECIMAL / bs.total_bookings::DECIMAL) * 100, 2)
      ELSE 0
    END AS attendance_rate,
    COALESCE(cs.category, 'none') AS favorite_class_category
  FROM booking_stats bs
  LEFT JOIN category_stats cs ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BOOK CLASS FUNCTION (WITH VALIDATION)
-- =====================================================
CREATE OR REPLACE FUNCTION public.book_class(
  p_user_id UUID,
  p_schedule_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  booking_id UUID
) AS $$
DECLARE
  v_available_spots INTEGER;
  v_schedule_date DATE;
  v_existing_booking UUID;
  v_new_booking_id UUID;
  v_membership_active BOOLEAN;
BEGIN
  -- Check if user has active membership
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE user_id = p_user_id
      AND status = 'active'
      AND end_date >= CURRENT_DATE
  ) INTO v_membership_active;

  IF NOT v_membership_active THEN
    RETURN QUERY SELECT false, 'No active membership found'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check if schedule exists and get details
  SELECT available_spots, date
  INTO v_available_spots, v_schedule_date
  FROM public.schedules
  WHERE id = p_schedule_id AND status = 'scheduled';

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Schedule not found or not available'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check if spots available
  IF v_available_spots <= 0 THEN
    RETURN QUERY SELECT false, 'No available spots'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check if already booked
  SELECT id INTO v_existing_booking
  FROM public.bookings
  WHERE user_id = p_user_id
    AND schedule_id = p_schedule_id
    AND status != 'cancelled';

  IF FOUND THEN
    RETURN QUERY SELECT false, 'Already booked this class'::TEXT, v_existing_booking;
    RETURN;
  END IF;

  -- Create booking
  INSERT INTO public.bookings (user_id, schedule_id, status)
  VALUES (p_user_id, p_schedule_id, 'confirmed')
  RETURNING id INTO v_new_booking_id;

  -- Create notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    'Booking Confirmed',
    'Your class booking has been confirmed for ' || v_schedule_date,
    'booking'
  );

  RETURN QUERY SELECT true, 'Booking successful'::TEXT, v_new_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CANCEL BOOKING FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.cancel_booking(
  p_booking_id UUID,
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_booking_status TEXT;
  v_schedule_date DATE;
BEGIN
  -- Get booking details
  SELECT b.status, s.date
  INTO v_booking_status, v_schedule_date
  FROM public.bookings b
  INNER JOIN public.schedules s ON b.schedule_id = s.id
  WHERE b.id = p_booking_id AND b.user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Booking not found'::TEXT;
    RETURN;
  END IF;

  IF v_booking_status = 'cancelled' THEN
    RETURN QUERY SELECT false, 'Booking already cancelled'::TEXT;
    RETURN;
  END IF;

  IF v_booking_status = 'completed' THEN
    RETURN QUERY SELECT false, 'Cannot cancel completed booking'::TEXT;
    RETURN;
  END IF;

  -- Update booking
  UPDATE public.bookings
  SET status = 'cancelled',
      cancellation_reason = p_reason
  WHERE id = p_booking_id;

  -- Create notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    'Booking Cancelled',
    'Your class booking for ' || v_schedule_date || ' has been cancelled',
    'booking'
  );

  RETURN QUERY SELECT true, 'Booking cancelled successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CHECK IN TO CLASS
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_in_to_class(
  p_booking_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  attendance_id UUID
) AS $$
DECLARE
  v_booking_status TEXT;
  v_checked_in BOOLEAN;
  v_new_attendance_id UUID;
BEGIN
  -- Get booking details
  SELECT status, checked_in
  INTO v_booking_status, v_checked_in
  FROM public.bookings
  WHERE id = p_booking_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Booking not found'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  IF v_booking_status != 'confirmed' THEN
    RETURN QUERY SELECT false, 'Booking is not confirmed'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  IF v_checked_in THEN
    RETURN QUERY SELECT false, 'Already checked in'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Update booking
  UPDATE public.bookings
  SET checked_in = true,
      status = 'completed'
  WHERE id = p_booking_id;

  -- Create attendance record
  INSERT INTO public.attendance (booking_id)
  VALUES (p_booking_id)
  RETURNING id INTO v_new_attendance_id;

  RETURN QUERY SELECT true, 'Checked in successfully'::TEXT, v_new_attendance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
