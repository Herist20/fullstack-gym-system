import { createClient } from '@/lib/supabase/client';
import { GymSettings, MembershipPlan, EmailTemplate } from '@/lib/types';

// Gym Settings
export async function fetchGymSettings(): Promise<GymSettings[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('gym_settings')
    .select('*')
    .order('key');

  if (error) throw error;
  return data;
}

export async function getSettingByKey(key: string): Promise<any> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('gym_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data?.value;
}

export async function updateSetting(key: string, value: any, description?: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('gym_settings')
    .upsert({
      key,
      value,
      description,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSetting(key: string) {
  const supabase = createClient();

  const { error } = await supabase.from('gym_settings').delete().eq('key', key);

  if (error) throw error;
}

// Membership Plans
export async function fetchMembershipPlans(): Promise<MembershipPlan[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createMembershipPlan(planData: {
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: any;
  is_active?: boolean;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('membership_plans')
    .insert(planData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMembershipPlan(id: string, updates: Partial<MembershipPlan>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('membership_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMembershipPlan(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from('membership_plans').delete().eq('id', id);

  if (error) throw error;
}

// Email Templates
export async function fetchEmailTemplates(): Promise<EmailTemplate[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createEmailTemplate(templateData: {
  name: string;
  subject: string;
  body: string;
  variables?: string[];
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('email_templates')
    .insert(templateData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('email_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEmailTemplate(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from('email_templates').delete().eq('id', id);

  if (error) throw error;
}

// Admin Users
export async function fetchAdminUsers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      user:users(id, full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateAdminUser(userId: string, updates: {
  role?: 'admin' | 'trainer';
  permissions?: any;
  is_active?: boolean;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Audit Logs
export async function fetchAuditLogs(limit: number = 100) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      user:users(id, full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function createAuditLog(logData: {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .insert(logData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
