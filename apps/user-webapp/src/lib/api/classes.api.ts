import { createClient } from '@/lib/supabase/client';

export const classesApi = {
  async getClasses() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getClassSchedules(startDate?: string, endDate?: string) {
    const supabase = createClient();

    let query = supabase
      .from('class_schedules')
      .select(`
        *,
        class:classes(*),
        instructor:instructors(*),
        bookings_count:bookings(count)
      `)
      .eq('is_active', true)
      .order('start_time');

    if (startDate) {
      query = query.gte('start_time', startDate);
    }

    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getClassById(classId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (error) throw error;
    return data;
  },

  async getScheduleById(scheduleId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('class_schedules')
      .select(`
        *,
        class:classes(*),
        instructor:instructors(*),
        bookings_count:bookings(count)
      `)
      .eq('id', scheduleId)
      .single();

    if (error) throw error;
    return data;
  },
};
