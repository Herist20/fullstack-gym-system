-- Complete Easy Seed - No Auth Users Required!
-- This fixes the schema and seeds data in one go

-- =====================================================
-- STEP 1: Fix Schema (Allow NULL instructor for testing)
-- =====================================================

ALTER TABLE public.classes
ALTER COLUMN instructor_id DROP NOT NULL;

-- =====================================================
-- STEP 2: Create Dummy Trainer for Testing
-- =====================================================

-- Create a dummy auth user first (you'll replace this later)
-- This is just so we have something to reference

DO $$
DECLARE
  dummy_auth_id UUID;
  dummy_trainer_id UUID;
BEGIN
  -- Create auth user (this might fail if user exists, that's OK)
  BEGIN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'system.trainer@gymfit.com',
      crypt('trainer123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO dummy_auth_id;

    RAISE NOTICE 'Created auth user: %', dummy_auth_id;
  EXCEPTION WHEN OTHERS THEN
    -- If user exists, get the existing one
    SELECT id INTO dummy_auth_id FROM auth.users WHERE email = 'system.trainer@gymfit.com' LIMIT 1;
    RAISE NOTICE 'Using existing auth user: %', dummy_auth_id;
  END;

  -- Create public user
  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    dummy_auth_id,
    'system.trainer@gymfit.com',
    'trainer',
    'System Trainer',
    '+628123456789'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create trainer
  INSERT INTO public.trainers (user_id, specialization, bio, rating, years_experience)
  VALUES (
    dummy_auth_id,
    ARRAY['yoga', 'cardio', 'strength'],
    'System trainer for testing purposes',
    5.0,
    10
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO dummy_trainer_id;

  RAISE NOTICE 'Created trainer: %', dummy_trainer_id;
END $$;

-- =====================================================
-- STEP 3: Seed Classes (with dummy trainer)
-- =====================================================

INSERT INTO public.classes (name, description, instructor_id, duration, max_capacity, category, is_active)
SELECT
  name,
  description,
  (SELECT id FROM public.trainers WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'system.trainer@gymfit.com') LIMIT 1),
  duration,
  max_capacity,
  category,
  is_active
FROM (VALUES
  ('Morning Yoga Flow', 'Start your day with energizing yoga flows and mindful breathing.', 60, 25, 'yoga', true),
  ('Pilates Core', 'Strengthen your core and improve posture with pilates fundamentals.', 45, 20, 'pilates', true),
  ('HIIT Cardio Blast', 'Maximum calorie burn with high-intensity interval training.', 45, 25, 'cardio', true),
  ('Indoor Cycling', 'Intense cycling workout with music and motivation.', 50, 30, 'cycling', true),
  ('CrossFit Foundations', 'Learn the fundamentals of CrossFit training with proper form.', 60, 15, 'crossfit', true),
  ('Strength & Power', 'Build muscle and increase strength with compound movements.', 75, 12, 'strength', true),
  ('Boxing Bootcamp', 'High-intensity boxing workout combining technique drills.', 60, 20, 'boxing', true),
  ('Power Yoga', 'Dynamic yoga practice building strength and flexibility.', 60, 22, 'yoga', true),
  ('Total Body Cardio', 'Fun and effective cardio workout for all fitness levels.', 45, 25, 'cardio', true),
  ('Restorative Yoga', 'Gentle yoga practice focused on relaxation and recovery.', 60, 20, 'yoga', true),
  ('Cardio Boxing', 'Boxing-inspired cardio workout for endurance and agility.', 60, 20, 'boxing', true),
  ('Full Body Strength', 'Complete strength training for all major muscle groups.', 60, 18, 'strength', true)
) AS classes(name, description, duration, max_capacity, category, is_active);

-- =====================================================
-- STEP 4: Seed Equipment
-- =====================================================

INSERT INTO public.equipment (name, category, status, purchase_date, last_maintenance, next_maintenance) VALUES
-- Cardio equipment
('Treadmill - TechnoGym 01', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),
('Treadmill - TechnoGym 02', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),
('Elliptical Trainer 01', 'cardio', 'available', '2024-02-20', '2024-11-15', '2025-02-15'),
('Rowing Machine 01', 'cardio', 'maintenance', '2024-03-10', '2024-12-20', '2025-01-20'),
('Stationary Bike 01', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),
('Stationary Bike 02', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),

-- Strength equipment
('Leg Press Machine', 'strength', 'available', '2024-01-20', '2024-11-20', '2025-02-20'),
('Chest Press Machine', 'strength', 'available', '2024-01-20', '2024-11-20', '2025-02-20'),
('Lat Pulldown Machine', 'strength', 'available', '2024-01-20', '2024-11-20', '2025-02-20'),
('Cable Crossover Machine', 'strength', 'available', '2024-02-15', '2024-12-10', '2025-03-10'),
('Smith Machine', 'strength', 'available', '2024-03-01', '2024-12-15', '2025-03-15'),

-- Free weights
('Dumbbells Set (5-50kg)', 'free_weights', 'available', '2024-01-10', NULL, NULL),
('Barbell Olympic 01', 'free_weights', 'available', '2024-01-10', NULL, NULL),
('Barbell Olympic 02', 'free_weights', 'available', '2024-01-10', NULL, NULL),
('Kettlebells Set', 'free_weights', 'available', '2024-02-01', NULL, NULL),
('Weight Plates Set', 'free_weights', 'available', '2024-01-10', NULL, NULL),

-- Accessories
('Yoga Mats (50 pcs)', 'accessories', 'available', '2024-01-05', NULL, NULL),
('Resistance Bands Set', 'accessories', 'available', '2024-01-15', NULL, NULL),
('Boxing Gloves (20 pairs)', 'accessories', 'available', '2024-02-10', NULL, NULL),
('Jump Ropes (30 pcs)', 'accessories', 'available', '2024-01-20', NULL, NULL),
('Foam Rollers (25 pcs)', 'accessories', 'available', '2024-02-15', NULL, NULL),
('Medicine Balls Set', 'accessories', 'available', '2024-03-01', NULL, NULL),
('Battle Ropes', 'accessories', 'available', '2024-03-05', NULL, NULL);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
DECLARE
  class_count INTEGER;
  equipment_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO class_count FROM public.classes;
  SELECT COUNT(*) INTO equipment_count FROM public.equipment;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 Seed data loaded successfully!';
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ Classes created: %', class_count;
  RAISE NOTICE '✅ Equipment created: %', equipment_count;
  RAISE NOTICE '✅ System trainer created: system.trainer@gymfit.com';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Login credentials (for testing):';
  RAISE NOTICE '   Email: system.trainer@gymfit.com';
  RAISE NOTICE '   Password: trainer123';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next steps:';
  RAISE NOTICE '   1. Run: node test-connection.js';
  RAISE NOTICE '   2. Run: pnpm dev';
  RAISE NOTICE '   3. Open: http://localhost:3001';
  RAISE NOTICE '';
END $$;
