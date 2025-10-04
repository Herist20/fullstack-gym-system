import { createClient } from '@/lib/supabase/client';

export const membershipApi = {
  async getCurrentMembership() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('memberships')
      .select(`
        *,
        plan:membership_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  async getMembershipPlans() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) throw error;
    return data;
  },

  async getPaymentHistory() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        membership:memberships(
          *,
          plan:membership_plans(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUsageStats() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Get current month's bookings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString());

    if (error) throw error;

    return {
      classesThisMonth: data?.length || 0,
      totalClasses: data?.length || 0,
    };
  },

  async updateAutoRenewal(enabled: boolean) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('memberships')
      .update({ auto_renewal: enabled })
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (error) throw error;
  },
};
