import { createClient } from '@/lib/supabase/client';
import type { BookClassInput, CancelBookingInput, JoinWaitlistInput } from '@/lib/schemas/booking.schema';

export const bookingsApi = {
  async getUpcomingBookings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        class:classes(*),
        schedule:class_schedules(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gte('schedule.start_time', new Date().toISOString())
      .order('schedule.start_time', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async getPastBookings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        class:classes(*),
        schedule:class_schedules(*)
      `)
      .eq('user_id', user.id)
      .in('status', ['confirmed', 'completed', 'cancelled'])
      .lt('schedule.start_time', new Date().toISOString())
      .order('schedule.start_time', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  },

  async bookClass(data: BookClassInput) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check availability
    const { data: schedule, error: scheduleError } = await supabase
      .from('class_schedules')
      .select('*, bookings_count:bookings(count)')
      .eq('id', data.scheduleId)
      .single();

    if (scheduleError) throw scheduleError;

    const currentBookings = schedule.bookings_count?.[0]?.count || 0;
    if (currentBookings >= schedule.max_capacity) {
      throw new Error('Class is full');
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        class_id: data.classId,
        schedule_id: data.scheduleId,
        status: 'confirmed',
        notes: data.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return booking;
  },

  async cancelBooking(data: CancelBookingInput) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check if booking belongs to user
    const { data: booking, error: checkError } = await supabase
      .from('bookings')
      .select('*, schedule:class_schedules(*)')
      .eq('id', data.bookingId)
      .eq('user_id', user.id)
      .single();

    if (checkError) throw checkError;

    // Check cancellation deadline (e.g., 2 hours before class)
    const classTime = new Date(booking.schedule.start_time);
    const now = new Date();
    const hoursUntilClass = (classTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilClass < 2) {
      throw new Error('Cannot cancel within 2 hours of class start time');
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: data.reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', data.bookingId);

    if (error) throw error;
  },

  async joinWaitlist(data: JoinWaitlistInput) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('waitlist')
      .insert({
        user_id: user.id,
        class_id: data.classId,
        schedule_id: data.scheduleId,
        status: 'waiting',
      });

    if (error) throw error;
  },

  async getBookingById(bookingId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        class:classes(*),
        schedule:class_schedules(*)
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },
};
