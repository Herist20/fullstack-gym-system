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
