import { createClient } from '@/lib/supabase/client';
import { Schedule } from '@/lib/types';

export async function fetchSchedules(startDate?: Date, endDate?: Date): Promise<Schedule[]> {
  const supabase = createClient();

  let query = supabase
    .from('schedules')
    .select(`
      *,
      class:classes(id, name, duration_minutes, capacity),
      trainer:users!schedules_trainer_id_fkey(id, full_name),
      bookings(id, status)
    `)
    .order('start_time', { ascending: true });

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Schedule[];
}

export async function fetchScheduleById(id: string): Promise<Schedule> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      class:classes(id, name, duration_minutes, capacity),
      trainer:users!schedules_trainer_id_fkey(id, full_name),
      bookings(id, status, user:users(id, full_name, email))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Schedule;
}

export async function createSchedule(scheduleData: {
  class_id: string;
  trainer_id: string;
  start_time: string;
  end_time: string;
  max_capacity?: number;
  status?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('schedules')
    .insert(scheduleData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSchedule(id: string, updates: Partial<Schedule>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSchedule(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function checkScheduleConflict(
  trainerId: string,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string
): Promise<boolean> {
  const supabase = createClient();

  let query = supabase
    .from('schedules')
    .select('id')
    .eq('trainer_id', trainerId)
    .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

  if (excludeScheduleId) {
    query = query.neq('id', excludeScheduleId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.length > 0;
}

export async function getScheduleStats(scheduleId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('status')
    .eq('schedule_id', scheduleId);

  if (error) throw error;

  const confirmed = data.filter((b) => b.status === 'confirmed').length;
  const cancelled = data.filter((b) => b.status === 'cancelled').length;
  const pending = data.filter((b) => b.status === 'pending').length;

  return {
    total: data.length,
    confirmed,
    cancelled,
    pending,
  };
}
