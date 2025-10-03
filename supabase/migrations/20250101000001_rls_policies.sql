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
