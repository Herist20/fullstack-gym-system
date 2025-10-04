-- Admin Dashboard Additional Tables
-- Migration: 20250104000001_admin_dashboard_tables

-- =====================================================
-- ADMIN USERS TABLE (extends users table with admin-specific data)
-- =====================================================
CREATE TABLE public.admin_users (
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

CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_admin_users_is_active ON public.admin_users(is_active);

-- =====================================================
-- PAYMENT TRANSACTIONS TABLE (detailed payment tracking)
-- =====================================================
CREATE TABLE public.payment_transactions (
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

CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_payment_id ON public.payment_transactions(payment_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_type ON public.payment_transactions(type);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at DESC);

-- =====================================================
-- AUDIT LOGS TABLE (track admin actions)
-- =====================================================
CREATE TABLE public.audit_logs (
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

CREATE INDEX idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON public.audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =====================================================
-- GYM SETTINGS TABLE (store gym configuration)
-- =====================================================
CREATE TABLE public.gym_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_gym_settings_key ON public.gym_settings(key);

-- =====================================================
-- MEMBERSHIP PLANS TABLE (define available membership types)
-- =====================================================
CREATE TABLE public.membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_membership_plans_type ON public.membership_plans(type);
CREATE INDEX idx_membership_plans_is_active ON public.membership_plans(is_active);

-- =====================================================
-- EMAIL TEMPLATES TABLE (for notification emails)
-- =====================================================
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_email_templates_name ON public.email_templates(name);
CREATE INDEX idx_email_templates_is_active ON public.email_templates(is_active);

-- =====================================================
-- TRAINER CERTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.trainer_certifications (
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

CREATE INDEX idx_trainer_certifications_trainer_id ON public.trainer_certifications(trainer_id);
CREATE INDEX idx_trainer_certifications_expiry_date ON public.trainer_certifications(expiry_date);

-- =====================================================
-- EQUIPMENT MAINTENANCE LOG TABLE
-- =====================================================
CREATE TABLE public.equipment_maintenance_log (
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

CREATE INDEX idx_equipment_maintenance_log_equipment_id ON public.equipment_maintenance_log(equipment_id);
CREATE INDEX idx_equipment_maintenance_log_performed_at ON public.equipment_maintenance_log(performed_at DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
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

-- =====================================================
-- INSERT DEFAULT GYM SETTINGS
-- =====================================================
INSERT INTO public.gym_settings (key, value, description) VALUES
  ('gym_info', '{"name": "Fitness Pro Gym", "address": "", "phone": "", "email": "", "operating_hours": {}}', 'General gym information'),
  ('policies', '{"cancellation": "", "terms_and_conditions": ""}', 'Gym policies and terms'),
  ('notifications', '{"email_enabled": true, "sms_enabled": false}', 'Notification settings');

-- =====================================================
-- INSERT DEFAULT EMAIL TEMPLATES
-- =====================================================
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
  ('welcome_email', 'Welcome to {{gym_name}}!', 'Hi {{user_name}},\n\nWelcome to {{gym_name}}! We''re excited to have you join our fitness community.\n\nYour membership details:\n- Type: {{membership_type}}\n- Start Date: {{start_date}}\n- End Date: {{end_date}}\n\nBest regards,\nThe {{gym_name}} Team', '["gym_name", "user_name", "membership_type", "start_date", "end_date"]'),
  ('booking_confirmation', 'Booking Confirmed - {{class_name}}', 'Hi {{user_name}},\n\nYour booking has been confirmed!\n\nClass: {{class_name}}\nDate: {{class_date}}\nTime: {{class_time}}\nInstructor: {{instructor_name}}\n\nSee you there!\n\nBest regards,\nThe {{gym_name}} Team', '["gym_name", "user_name", "class_name", "class_date", "class_time", "instructor_name"]'),
  ('class_reminder', 'Reminder: {{class_name}} in 24 hours', 'Hi {{user_name}},\n\nThis is a friendly reminder that you have a class booked tomorrow!\n\nClass: {{class_name}}\nDate: {{class_date}}\nTime: {{class_time}}\n\nSee you soon!\n\nBest regards,\nThe {{gym_name}} Team', '["gym_name", "user_name", "class_name", "class_date", "class_time"]');
