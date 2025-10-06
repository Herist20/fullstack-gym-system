import { createClient } from '@/lib/supabase/client';
import { Trainer, TrainerCertification } from '@/lib/types';

export async function fetchTrainers(): Promise<Trainer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      certifications:trainer_certifications(*),
      admin_profile:admin_users(*)
    `)
    .eq('role', 'trainer')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Trainer[];
}

export async function fetchTrainerById(id: string): Promise<Trainer> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      certifications:trainer_certifications(*),
      admin_profile:admin_users(*),
      schedules:schedules(
        id,
        start_time,
        end_time,
        class:classes(name)
      )
    `)
    .eq('id', id)
    .eq('role', 'trainer')
    .single();

  if (error) throw error;
  return data as Trainer;
}

export async function createTrainer(trainerData: {
  email: string;
  full_name: string;
  phone?: string;
  password: string;
  specialization?: string;
  bio?: string;
}) {
  const supabase = createClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: trainerData.email,
    password: trainerData.password,
  });

  if (authError) throw authError;

  // Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user?.id,
      email: trainerData.email,
      full_name: trainerData.full_name,
      phone: trainerData.phone,
      role: 'trainer',
    })
    .select()
    .single();

  if (userError) throw userError;

  // Create admin_users entry for trainer
  const { error: adminError } = await supabase
    .from('admin_users')
    .insert({
      user_id: authData.user?.id,
      role: 'trainer',
      permissions: {},
      is_active: true,
    });

  if (adminError) throw adminError;

  return userData;
}

export async function updateTrainer(id: string, updates: Partial<Trainer>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTrainer(id: string) {
  const supabase = createClient();

  // Delete admin_users entry first
  await supabase.from('admin_users').delete().eq('user_id', id);

  // Delete user
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleTrainerStatus(id: string, isActive: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from('admin_users')
    .update({ is_active: isActive })
    .eq('user_id', id);

  if (error) throw error;
}

// Certifications
export async function fetchTrainerCertifications(trainerId: string): Promise<TrainerCertification[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('trainer_certifications')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('issue_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addCertification(certData: {
  trainer_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  certificate_url?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('trainer_certifications')
    .insert(certData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCertification(id: string, updates: Partial<TrainerCertification>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('trainer_certifications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCertification(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('trainer_certifications')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Performance metrics
export async function getTrainerStats(trainerId: string) {
  const supabase = createClient();

  // Get total classes
  const { count: totalClasses } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('trainer_id', trainerId);

  // Get total students (unique bookings)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('user_id, schedule:schedules!inner(trainer_id)')
    .eq('schedule.trainer_id', trainerId)
    .eq('status', 'confirmed');

  const uniqueStudents = new Set(bookings?.map(b => b.user_id) || []).size;

  // Get upcoming classes
  const { count: upcomingClasses } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('trainer_id', trainerId)
    .gte('start_time', new Date().toISOString());

  return {
    totalClasses: totalClasses || 0,
    totalStudents: uniqueStudents,
    upcomingClasses: upcomingClasses || 0,
  };
}
