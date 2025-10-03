-- Seed Data for Development
-- This file contains sample data for testing and development

-- =====================================================
-- SEED USERS (ADMIN, TRAINERS, MEMBERS)
-- =====================================================

-- Note: In production, users are created through Supabase Auth
-- This seed assumes auth.users already has these IDs or you'll create them manually

-- Admin User
INSERT INTO public.users (id, email, role, full_name, phone, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@gymfit.com', 'admin', 'Admin User', '+6281234567890', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin');

-- Trainer Users
INSERT INTO public.users (id, email, role, full_name, phone, avatar_url) VALUES
('00000000-0000-0000-0000-000000000002', 'john.trainer@gymfit.com', 'trainer', 'John Smith', '+6281234567891', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
('00000000-0000-0000-0000-000000000003', 'sarah.trainer@gymfit.com', 'trainer', 'Sarah Johnson', '+6281234567892', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'),
('00000000-0000-0000-0000-000000000004', 'mike.trainer@gymfit.com', 'trainer', 'Mike Williams', '+6281234567893', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'),
('00000000-0000-0000-0000-000000000005', 'emma.trainer@gymfit.com', 'trainer', 'Emma Davis', '+6281234567894', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma');

-- Member Users
INSERT INTO public.users (id, email, role, full_name, phone, avatar_url) VALUES
('00000000-0000-0000-0000-000000000010', 'member1@gmail.com', 'member', 'Alice Brown', '+6281234567895', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'),
('00000000-0000-0000-0000-000000000011', 'member2@gmail.com', 'member', 'Bob Wilson', '+6281234567896', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'),
('00000000-0000-0000-0000-000000000012', 'member3@gmail.com', 'member', 'Carol Martinez', '+6281234567897', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol'),
('00000000-0000-0000-0000-000000000013', 'member4@gmail.com', 'member', 'David Lee', '+6281234567898', 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'),
('00000000-0000-0000-0000-000000000014', 'member5@gmail.com', 'member', 'Eva Garcia', '+6281234567899', 'https://api.dicebear.com/7.x/avataaars/svg?seed=eva');

-- =====================================================
-- SEED TRAINERS
-- =====================================================

INSERT INTO public.trainers (user_id, specialization, bio, rating, years_experience) VALUES
('00000000-0000-0000-0000-000000000002', ARRAY['strength', 'crossfit', 'boxing'], 'Certified personal trainer with expertise in strength training and CrossFit. Passionate about helping clients achieve their fitness goals.', 4.8, 8),
('00000000-0000-0000-0000-000000000003', ARRAY['yoga', 'pilates'], 'Experienced yoga and pilates instructor. Specializes in flexibility and mind-body connection.', 4.9, 10),
('00000000-0000-0000-0000-000000000004', ARRAY['cardio', 'cycling', 'boxing'], 'High-energy cardio specialist. Former professional athlete turned fitness coach.', 4.7, 6),
('00000000-0000-0000-0000-000000000005', ARRAY['yoga', 'strength', 'cardio'], 'All-around fitness expert with a holistic approach to wellness.', 4.9, 12);

-- =====================================================
-- SEED MEMBERSHIPS
-- =====================================================

INSERT INTO public.memberships (user_id, membership_type, start_date, end_date, status, price) VALUES
-- Active memberships
('00000000-0000-0000-0000-000000000010', 'premium', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', 'active', 750000),
('00000000-0000-0000-0000-000000000011', 'basic', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '75 days', 'active', 500000),
('00000000-0000-0000-0000-000000000012', 'platinum', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '315 days', 'active', 1500000),
('00000000-0000-0000-0000-000000000013', 'premium', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '80 days', 'active', 750000),
('00000000-0000-0000-0000-000000000014', 'basic', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '85 days', 'active', 500000);

-- =====================================================
-- SEED CLASSES
-- =====================================================

INSERT INTO public.classes (name, description, instructor_id, duration, max_capacity, category, is_active) VALUES
-- John's classes (Strength & CrossFit)
('CrossFit Foundations', 'Learn the fundamentals of CrossFit training with proper form and technique.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000002'), 60, 15, 'crossfit', true),
('Strength & Power', 'Build muscle and increase strength with compound movements and progressive overload.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000002'), 75, 12, 'strength', true),
('Boxing Bootcamp', 'High-intensity boxing workout combining technique drills and conditioning.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000002'), 60, 20, 'boxing', true),

-- Sarah's classes (Yoga & Pilates)
('Morning Yoga Flow', 'Start your day with energizing yoga flows and mindful breathing.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000003'), 60, 25, 'yoga', true),
('Pilates Core', 'Strengthen your core and improve posture with pilates fundamentals.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000003'), 45, 20, 'pilates', true),
('Restorative Yoga', 'Gentle yoga practice focused on relaxation and recovery.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000003'), 60, 20, 'yoga', true),

-- Mike's classes (Cardio & Cycling)
('HIIT Cardio Blast', 'Maximum calorie burn with high-intensity interval training.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000004'), 45, 25, 'cardio', true),
('Indoor Cycling', 'Intense cycling workout with music and motivation.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000004'), 50, 30, 'cycling', true),
('Cardio Boxing', 'Boxing-inspired cardio workout for endurance and agility.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000004'), 60, 20, 'boxing', true),

-- Emma's classes (Mixed)
('Full Body Strength', 'Complete strength training for all major muscle groups.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000005'), 60, 18, 'strength', true),
('Power Yoga', 'Dynamic yoga practice building strength and flexibility.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000005'), 60, 22, 'yoga', true),
('Total Body Cardio', 'Fun and effective cardio workout for all fitness levels.', (SELECT id FROM public.trainers WHERE user_id = '00000000-0000-0000-0000-000000000005'), 45, 25, 'cardio', true);

-- =====================================================
-- SEED SCHEDULES (THIS WEEK)
-- =====================================================

-- Monday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow'), CURRENT_DATE, '06:00', '07:00', 20, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'CrossFit Foundations'), CURRENT_DATE, '08:00', '09:00', 12, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'HIIT Cardio Blast'), CURRENT_DATE, '12:00', '12:45', 22, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Pilates Core'), CURRENT_DATE, '17:00', '17:45', 18, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Power Yoga'), CURRENT_DATE, '18:30', '19:30', 20, 'scheduled');

-- Tuesday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Strength & Power'), CURRENT_DATE + 1, '06:30', '07:45', 10, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Indoor Cycling'), CURRENT_DATE + 1, '09:00', '09:50', 28, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow'), CURRENT_DATE + 1, '11:00', '12:00', 23, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Boxing Bootcamp'), CURRENT_DATE + 1, '17:30', '18:30', 18, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Total Body Cardio'), CURRENT_DATE + 1, '19:00', '19:45', 24, 'scheduled');

-- Wednesday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow'), CURRENT_DATE + 2, '06:00', '07:00', 22, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Full Body Strength'), CURRENT_DATE + 2, '08:00', '09:00', 15, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Pilates Core'), CURRENT_DATE + 2, '12:30', '13:15', 19, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'HIIT Cardio Blast'), CURRENT_DATE + 2, '17:00', '17:45', 23, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Restorative Yoga'), CURRENT_DATE + 2, '19:00', '20:00', 19, 'scheduled');

-- Thursday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'CrossFit Foundations'), CURRENT_DATE + 3, '06:30', '07:30', 13, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Indoor Cycling'), CURRENT_DATE + 3, '09:00', '09:50', 29, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Cardio Boxing'), CURRENT_DATE + 3, '12:00', '13:00', 18, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Power Yoga'), CURRENT_DATE + 3, '17:30', '18:30', 21, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Strength & Power'), CURRENT_DATE + 3, '19:00', '20:15', 11, 'scheduled');

-- Friday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow'), CURRENT_DATE + 4, '06:00', '07:00', 24, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Boxing Bootcamp'), CURRENT_DATE + 4, '08:30', '09:30', 19, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'HIIT Cardio Blast'), CURRENT_DATE + 4, '12:00', '12:45', 25, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Full Body Strength'), CURRENT_DATE + 4, '17:00', '18:00', 16, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Total Body Cardio'), CURRENT_DATE + 4, '18:30', '19:15', 24, 'scheduled');

-- Saturday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Power Yoga'), CURRENT_DATE + 5, '08:00', '09:00', 20, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'CrossFit Foundations'), CURRENT_DATE + 5, '09:30', '10:30', 14, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Indoor Cycling'), CURRENT_DATE + 5, '11:00', '11:50', 28, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Pilates Core'), CURRENT_DATE + 5, '14:00', '14:45', 20, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Restorative Yoga'), CURRENT_DATE + 5, '16:00', '17:00', 20, 'scheduled');

-- Sunday schedules
INSERT INTO public.schedules (class_id, date, start_time, end_time, available_spots, status) VALUES
((SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow'), CURRENT_DATE + 6, '08:00', '09:00', 25, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Full Body Strength'), CURRENT_DATE + 6, '10:00', '11:00', 17, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Total Body Cardio'), CURRENT_DATE + 6, '14:00', '14:45', 25, 'scheduled'),
((SELECT id FROM public.classes WHERE name = 'Restorative Yoga'), CURRENT_DATE + 6, '16:00', '17:00', 20, 'scheduled');

-- =====================================================
-- SEED BOOKINGS
-- =====================================================

-- Alice's bookings
INSERT INTO public.bookings (user_id, schedule_id, status, checked_in) VALUES
('00000000-0000-0000-0000-000000000010', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow') AND date = CURRENT_DATE), 'confirmed', false),
('00000000-0000-0000-0000-000000000010', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Pilates Core') AND date = CURRENT_DATE), 'confirmed', false);

-- Bob's bookings
INSERT INTO public.bookings (user_id, schedule_id, status, checked_in) VALUES
('00000000-0000-0000-0000-000000000011', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'CrossFit Foundations') AND date = CURRENT_DATE), 'confirmed', false),
('00000000-0000-0000-0000-000000000011', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'HIIT Cardio Blast') AND date = CURRENT_DATE), 'confirmed', false);

-- Carol's bookings
INSERT INTO public.bookings (user_id, schedule_id, status, checked_in) VALUES
('00000000-0000-0000-0000-000000000012', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Power Yoga') AND date = CURRENT_DATE), 'confirmed', false),
('00000000-0000-0000-0000-000000000012', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Indoor Cycling') AND date = CURRENT_DATE + 1), 'confirmed', false);

-- David's bookings
INSERT INTO public.bookings (user_id, schedule_id, status, checked_in) VALUES
('00000000-0000-0000-0000-000000000013', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Strength & Power') AND date = CURRENT_DATE + 1), 'confirmed', false),
('00000000-0000-0000-0000-000000000013', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Boxing Bootcamp') AND date = CURRENT_DATE + 1), 'confirmed', false);

-- Eva's bookings
INSERT INTO public.bookings (user_id, schedule_id, status, checked_in) VALUES
('00000000-0000-0000-0000-000000000014', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Morning Yoga Flow') AND date = CURRENT_DATE + 2), 'confirmed', false),
('00000000-0000-0000-0000-000000000014', (SELECT id FROM public.schedules WHERE class_id = (SELECT id FROM public.classes WHERE name = 'Pilates Core') AND date = CURRENT_DATE + 2), 'confirmed', false);

-- =====================================================
-- SEED PAYMENTS
-- =====================================================

INSERT INTO public.payments (user_id, membership_id, amount, payment_method, status, transaction_id) VALUES
('00000000-0000-0000-0000-000000000010', (SELECT id FROM public.memberships WHERE user_id = '00000000-0000-0000-0000-000000000010'), 750000, 'credit_card', 'completed', 'TRX-2025-001'),
('00000000-0000-0000-0000-000000000011', (SELECT id FROM public.memberships WHERE user_id = '00000000-0000-0000-0000-000000000011'), 500000, 'bank_transfer', 'completed', 'TRX-2025-002'),
('00000000-0000-0000-0000-000000000012', (SELECT id FROM public.memberships WHERE user_id = '00000000-0000-0000-0000-000000000012'), 1500000, 'credit_card', 'completed', 'TRX-2025-003'),
('00000000-0000-0000-0000-000000000013', (SELECT id FROM public.memberships WHERE user_id = '00000000-0000-0000-0000-000000000013'), 750000, 'e_wallet', 'completed', 'TRX-2025-004'),
('00000000-0000-0000-0000-000000000014', (SELECT id FROM public.memberships WHERE user_id = '00000000-0000-0000-0000-000000000014'), 500000, 'cash', 'completed', 'TRX-2025-005');

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

-- =====================================================
-- SEED NOTIFICATIONS
-- =====================================================

INSERT INTO public.notifications (user_id, title, message, type, read) VALUES
('00000000-0000-0000-0000-000000000010', 'Welcome to GymFit!', 'Thank you for joining us. Your membership is now active.', 'membership', true),
('00000000-0000-0000-0000-000000000010', 'Class Booked', 'You have successfully booked Morning Yoga Flow for today.', 'booking', false),
('00000000-0000-0000-0000-000000000011', 'Welcome to GymFit!', 'Thank you for joining us. Your membership is now active.', 'membership', true),
('00000000-0000-0000-0000-000000000011', 'Class Booked', 'You have successfully booked CrossFit Foundations for today.', 'booking', false),
('00000000-0000-0000-0000-000000000012', 'Payment Successful', 'Your platinum membership payment of Rp 1,500,000 has been processed.', 'payment', true);
