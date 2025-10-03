-- Fix Schema untuk Testing (Allow NULL instructor_id temporarily)
-- Run this BEFORE seed_simple.sql

-- =====================================================
-- STEP 1: Make instructor_id NULLABLE for testing
-- =====================================================

ALTER TABLE public.classes
ALTER COLUMN instructor_id DROP NOT NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Schema updated: instructor_id is now nullable';
  RAISE NOTICE 'You can now run seed_simple.sql';
  RAISE NOTICE 'Classes can be created without trainers for testing';
END $$;
