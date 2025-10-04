-- Adjustments for User WebApp
-- Migration: 20250104000000_webapp_adjustments

-- Rename schedules to class_schedules for consistency with webapp code
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'schedules')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables
                     WHERE table_schema = 'public' AND table_name = 'class_schedules') THEN
    ALTER TABLE public.schedules RENAME TO class_schedules;
  END IF;
END $$;

-- Add missing fields to match webapp expectations
ALTER TABLE public.class_schedules
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add instructor reference to class_schedules
ALTER TABLE public.class_schedules
  ADD COLUMN IF NOT EXISTS instructor_id UUID;

-- Add foreign key constraint if it doesn't exist
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

-- Rename phone to phone_number if exists (do this BEFORE adding new columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone_number') THEN
    ALTER TABLE public.users RENAME COLUMN phone TO phone_number;
  END IF;
END $$;

-- Add missing fields to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}'::jsonb;

-- Add membership_plans table if not exists
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing fields to memberships table
ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.membership_plans(id),
  ADD COLUMN IF NOT EXISTS auto_renewal BOOLEAN DEFAULT false;

-- Rename membership_type to use plan_id
UPDATE public.memberships m
SET plan_id = (
  SELECT id FROM public.membership_plans
  WHERE LOWER(name) = LOWER(m.membership_type)
  LIMIT 1
)
WHERE plan_id IS NULL AND membership_type IS NOT NULL;

-- Add waitlist table
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

-- Rename read to is_read if exists (do this BEFORE adding new columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'read')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'is_read') THEN
    ALTER TABLE public.notifications RENAME COLUMN read TO is_read;
  END IF;
END $$;

-- Update notifications table to match webapp expectations
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add instructors table reference fix
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

-- Migrate trainers to instructors if trainers exists
INSERT INTO public.instructors (id, user_id, name, specialization, bio, rating, created_at, updated_at)
SELECT
  t.id,
  t.user_id,
  u.full_name,
  t.specialization,
  t.bio,
  t.rating,
  t.created_at,
  t.updated_at
FROM public.trainers t
JOIN public.users u ON t.user_id = u.id
ON CONFLICT (id) DO NOTHING;

-- Add cancelled_at field to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add trigger for waitlist updates
CREATE TRIGGER set_updated_at_waitlist
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add trigger for membership_plans updates
CREATE TRIGGER set_updated_at_membership_plans
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add trigger for instructors updates
CREATE TRIGGER set_updated_at_instructors
  BEFORE UPDATE ON public.instructors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
