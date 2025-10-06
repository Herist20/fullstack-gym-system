import { createClient } from '@/lib/supabase/client';
import { GymClass } from '@/lib/types';

export async function fetchClasses(): Promise<GymClass[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      trainer:users!classes_trainer_id_fkey(id, full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GymClass[];
}

export async function fetchClassById(id: string): Promise<GymClass> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      trainer:users!classes_trainer_id_fkey(id, full_name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as GymClass;
}

export async function createClass(classData: {
  name: string;
  description?: string;
  trainer_id?: string;
  capacity: number;
  duration_minutes: number;
  difficulty_level?: string;
  price?: number;
  image_url?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClass(id: string, updates: Partial<GymClass>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClass(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function fetchTrainersForClasses() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('role', 'trainer')
    .order('full_name');

  if (error) throw error;
  return data;
}
