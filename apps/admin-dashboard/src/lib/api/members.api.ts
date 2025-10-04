import { createClient } from '@/lib/supabase/client';
import { Member } from '@/lib/types';

export async function fetchMembers(): Promise<Member[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      membership:memberships(*)
    `)
    .eq('role', 'member')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Member[];
}

export async function createMember(memberData: {
  email: string;
  full_name: string;
  phone?: string;
  password: string;
}) {
  const supabase = createClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: memberData.email,
    password: memberData.password,
  });

  if (authError) throw authError;

  // Create user profile
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: authData.user?.id,
      email: memberData.email,
      full_name: memberData.full_name,
      phone: memberData.phone,
      role: 'member',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember(id: string, updates: Partial<Member>) {
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

export async function deleteMember(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function suspendMember(id: string) {
  const supabase = createClient();

  // Update active memberships to suspended
  const { error } = await supabase
    .from('memberships')
    .update({ status: 'cancelled' })
    .eq('user_id', id)
    .eq('status', 'active');

  if (error) throw error;
}

export async function activateMember(id: string) {
  const supabase = createClient();

  // Reactivate latest membership
  const { error } = await supabase
    .from('memberships')
    .update({ status: 'active' })
    .eq('user_id', id)
    .eq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
}
