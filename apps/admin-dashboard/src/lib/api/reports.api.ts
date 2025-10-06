import { createClient } from '@/lib/supabase/client';

export async function fetchMembershipReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient();

  let query = supabase
    .from('memberships')
    .select(`
      *,
      user:users(id, full_name, email),
      plan:membership_plans(name, price)
    `);

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Calculate stats
  const total = data?.length || 0;
  const active = data?.filter((m) => m.status === 'active').length || 0;
  const expired = data?.filter((m) => m.status === 'expired').length || 0;
  const cancelled = data?.filter((m) => m.status === 'cancelled').length || 0;

  return {
    data,
    stats: { total, active, expired, cancelled },
  };
}

export async function fetchRevenueReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient();

  let query = supabase
    .from('payment_transactions')
    .select(`
      *,
      user:users(id, full_name, email)
    `);

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Calculate stats
  const totalRevenue =
    data?.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0;
  const pendingRevenue =
    data?.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0;
  const refundedRevenue =
    data?.filter((p) => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0) || 0;
  const transactionCount = data?.length || 0;

  return {
    data,
    stats: {
      totalRevenue,
      pendingRevenue,
      refundedRevenue,
      transactionCount,
    },
  };
}

export async function fetchAttendanceReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient();

  let query = supabase
    .from('bookings')
    .select(`
      *,
      user:users(id, full_name, email),
      schedule:schedules(
        start_time,
        end_time,
        class:classes(name),
        trainer:users(full_name)
      )
    `);

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Calculate stats
  const total = data?.length || 0;
  const confirmed = data?.filter((b) => b.status === 'confirmed').length || 0;
  const cancelled = data?.filter((b) => b.status === 'cancelled').length || 0;
  const pending = data?.filter((b) => b.status === 'pending').length || 0;

  return {
    data,
    stats: {
      total,
      confirmed,
      cancelled,
      pending,
      attendanceRate: total > 0 ? ((confirmed / total) * 100).toFixed(2) : 0,
    },
  };
}

export async function fetchClassPerformanceReport() {
  const supabase = createClient();

  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select(`
      id,
      name,
      capacity,
      trainer:users(full_name)
    `);

  if (classError) throw classError;

  // Get booking stats for each class
  const classStats = await Promise.all(
    (classes || []).map(async (gymClass) => {
      const { data: schedules } = await supabase
        .from('schedules')
        .select(`
          id,
          max_capacity,
          bookings(id, status)
        `)
        .eq('class_id', gymClass.id);

      const totalSchedules = schedules?.length || 0;
      const totalBookings =
        schedules?.reduce((sum, s) => sum + (s.bookings?.length || 0), 0) || 0;
      const confirmedBookings =
        schedules?.reduce(
          (sum, s) => sum + (s.bookings?.filter((b: any) => b.status === 'confirmed').length || 0),
          0
        ) || 0;

      const totalCapacity =
        schedules?.reduce((sum, s) => sum + (s.max_capacity || gymClass.capacity), 0) || 0;

      return {
        class: gymClass,
        totalSchedules,
        totalBookings,
        confirmedBookings,
        totalCapacity,
        occupancyRate:
          totalCapacity > 0 ? ((confirmedBookings / totalCapacity) * 100).toFixed(2) : 0,
      };
    })
  );

  return classStats;
}

export async function fetchTrainerPerformanceReport() {
  const supabase = createClient();

  const { data: trainers, error: trainerError } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('role', 'trainer');

  if (trainerError) throw trainerError;

  const trainerStats = await Promise.all(
    (trainers || []).map(async (trainer) => {
      // Count schedules
      const { count: totalClasses } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainer.id);

      // Count unique students
      const { data: bookings } = await supabase
        .from('bookings')
        .select('user_id, schedule:schedules!inner(trainer_id)')
        .eq('schedule.trainer_id', trainer.id)
        .eq('status', 'confirmed');

      const uniqueStudents = new Set(bookings?.map((b) => b.user_id) || []).size;

      // Total bookings
      const totalBookings = bookings?.length || 0;

      return {
        trainer,
        totalClasses: totalClasses || 0,
        totalStudents: uniqueStudents,
        totalBookings,
      };
    })
  );

  return trainerStats;
}

export async function fetchMemberGrowthData(months: number = 12) {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('users')
    .select('created_at')
    .eq('role', 'member')
    .gte('created_at', startDate.toISOString())
    .order('created_at');

  if (error) throw error;

  // Group by month
  const growthByMonth: { [key: string]: number } = {};

  data?.forEach((user) => {
    const date = new Date(user.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    growthByMonth[monthKey] = (growthByMonth[monthKey] || 0) + 1;
  });

  return Object.entries(growthByMonth).map(([month, count]) => ({
    month,
    newMembers: count,
  }));
}

export async function fetchDashboardSummary() {
  const supabase = createClient();

  // Total members
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member');

  // Active memberships
  const { count: activeMemberships } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Total revenue (completed payments)
  const { data: payments } = await supabase
    .from('payment_transactions')
    .select('amount')
    .eq('status', 'completed');

  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  // Total classes
  const { count: totalClasses } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true });

  // Total trainers
  const { count: totalTrainers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'trainer');

  // Total bookings
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  return {
    totalMembers: totalMembers || 0,
    activeMemberships: activeMemberships || 0,
    totalRevenue,
    totalClasses: totalClasses || 0,
    totalTrainers: totalTrainers || 0,
    totalBookings: totalBookings || 0,
  };
}
