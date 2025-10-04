-- RLS Policies for Admin Dashboard Tables
-- Migration: 20250104000002_admin_dashboard_rls

-- =====================================================
-- ADMIN USERS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can view all admin users
CREATE POLICY "Admins can view all admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Trainers can view their own admin user record
CREATE POLICY "Trainers can view own admin user record"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only admins can insert/update/delete admin users
CREATE POLICY "Only admins can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- PAYMENT TRANSACTIONS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can view all transactions
CREATE POLICY "Admins can view all payment transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Users can view their own transactions
CREATE POLICY "Users can view own payment transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only admins can insert/update/delete transactions
CREATE POLICY "Only admins can manage payment transactions"
  ON public.payment_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- AUDIT LOGS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Only admins can insert audit logs
CREATE POLICY "Only admins can create audit logs"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- =====================================================
-- GYM SETTINGS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read gym settings
CREATE POLICY "Anyone can read gym settings"
  ON public.gym_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update gym settings
CREATE POLICY "Only admins can manage gym settings"
  ON public.gym_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- MEMBERSHIP PLANS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can read active membership plans
CREATE POLICY "Anyone can read active membership plans"
  ON public.membership_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid() AND au.is_active = true
  ));

-- Only admins can manage membership plans
CREATE POLICY "Only admins can manage membership plans"
  ON public.membership_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- EMAIL TEMPLATES TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can view email templates
CREATE POLICY "Only admins can view email templates"
  ON public.email_templates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Only admins can manage email templates
CREATE POLICY "Only admins can manage email templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- TRAINER CERTIFICATIONS TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.trainer_certifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all certifications
CREATE POLICY "Admins can view all trainer certifications"
  ON public.trainer_certifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Trainers can view their own certifications
CREATE POLICY "Trainers can view own certifications"
  ON public.trainer_certifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trainers t
      WHERE t.id = trainer_id AND t.user_id = auth.uid()
    )
  );

-- Only admins can manage certifications
CREATE POLICY "Only admins can manage trainer certifications"
  ON public.trainer_certifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- EQUIPMENT MAINTENANCE LOG TABLE - RLS POLICIES
-- =====================================================
ALTER TABLE public.equipment_maintenance_log ENABLE ROW LEVEL SECURITY;

-- Admins and trainers can view maintenance logs
CREATE POLICY "Admins and trainers can view maintenance logs"
  ON public.equipment_maintenance_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Only admins can manage maintenance logs
CREATE POLICY "Only admins can manage maintenance logs"
  ON public.equipment_maintenance_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- =====================================================
-- UPDATE EXISTING TABLES RLS FOR ADMIN ACCESS
-- =====================================================

-- Allow admins to view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Allow admins to update users
CREATE POLICY "Admins can update all users"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Allow admins to view all memberships
CREATE POLICY "Admins can view all memberships"
  ON public.memberships
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Allow admins to manage all memberships
CREATE POLICY "Admins can manage all memberships"
  ON public.memberships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Allow admins and trainers to view all bookings
CREATE POLICY "Admins and trainers can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Allow admins to manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );

-- Allow admins to view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Allow admins to manage all payments
CREATE POLICY "Admins can manage all payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'admin' AND au.is_active = true
    )
  );
