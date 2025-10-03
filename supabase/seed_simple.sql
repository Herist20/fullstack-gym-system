-- Simplified Seed Data (No Auth Users Required)
-- This creates data without dummy users - you can add users manually later

-- =====================================================
-- SEED CLASSES (No trainer requirement for testing)
-- =====================================================

-- Note: This will create classes without trainers
-- After you create real users, you can assign trainers

INSERT INTO public.classes (id, name, description, instructor_id, duration, max_capacity, category, is_active) VALUES
(gen_random_uuid(), 'Morning Yoga Flow', 'Start your day with energizing yoga flows and mindful breathing.', NULL, 60, 25, 'yoga', true),
(gen_random_uuid(), 'Pilates Core', 'Strengthen your core and improve posture with pilates fundamentals.', NULL, 45, 20, 'pilates', true),
(gen_random_uuid(), 'HIIT Cardio Blast', 'Maximum calorie burn with high-intensity interval training.', NULL, 45, 25, 'cardio', true),
(gen_random_uuid(), 'Indoor Cycling', 'Intense cycling workout with music and motivation.', NULL, 50, 30, 'cycling', true),
(gen_random_uuid(), 'CrossFit Foundations', 'Learn the fundamentals of CrossFit training with proper form and technique.', NULL, 60, 15, 'crossfit', true),
(gen_random_uuid(), 'Strength & Power', 'Build muscle and increase strength with compound movements and progressive overload.', NULL, 75, 12, 'strength', true),
(gen_random_uuid(), 'Boxing Bootcamp', 'High-intensity boxing workout combining technique drills and conditioning.', NULL, 60, 20, 'boxing', true),
(gen_random_uuid(), 'Power Yoga', 'Dynamic yoga practice building strength and flexibility.', NULL, 60, 22, 'yoga', true),
(gen_random_uuid(), 'Total Body Cardio', 'Fun and effective cardio workout for all fitness levels.', NULL, 45, 25, 'cardio', true);

-- =====================================================
-- SEED EQUIPMENT
-- =====================================================

INSERT INTO public.equipment (name, category, status, purchase_date, last_maintenance, next_maintenance) VALUES
-- Cardio equipment
('Treadmill - TechnoGym 01', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),
('Treadmill - TechnoGym 02', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),
('Elliptical Trainer 01', 'cardio', 'available', '2024-02-20', '2024-11-15', '2025-02-15'),
('Rowing Machine 01', 'cardio', 'maintenance', '2024-03-10', '2024-12-20', '2025-01-20'),
('Stationary Bike 01', 'cardio', 'available', '2024-01-15', '2024-12-01', '2025-03-01'),

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
('Foam Rollers (25 pcs)', 'accessories', 'available', '2024-02-15', NULL, NULL);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data loaded successfully!';
  RAISE NOTICE '- Classes: 9 created';
  RAISE NOTICE '- Equipment: 20 created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create users via Supabase Auth';
  RAISE NOTICE '2. Create trainers and link to classes';
  RAISE NOTICE '3. Add memberships and bookings';
END $$;
