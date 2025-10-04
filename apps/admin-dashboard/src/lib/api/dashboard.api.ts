import { createClient } from '@/lib/supabase/client';
import { DashboardMetrics } from '@/lib/types';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = createClient();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Fetch total members
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member');

  // Fetch active today (users with bookings today)
  const today = format(now, 'yyyy-MM-dd');
  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('user_id')
    .gte('created_at', today)
    .eq('status', 'confirmed');

  const activeToday = new Set(todayBookings?.map(b => b.user_id)).size;

  // Fetch revenue MTD
  const { data: monthPayments } = await supabase
    .from('payments')
    .select('amount')
    .gte('payment_date', monthStart.toISOString())
    .lte('payment_date', monthEnd.toISOString())
    .eq('status', 'completed');

  const revenueMTD = monthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Fetch class occupancy
  const { data: schedules } = await supabase
    .from('schedules')
    .select('available_spots, class:classes(max_capacity)')
    .eq('status', 'scheduled')
    .gte('date', today);

  const totalCapacity = schedules?.reduce((sum, s: any) => sum + (s.class?.max_capacity || 0), 0) || 0;
  const bookedSpots = schedules?.reduce((sum, s) => sum + ((s.class?.max_capacity || 0) - s.available_spots), 0) || 0;
  const classOccupancy = totalCapacity > 0 ? (bookedSpots / totalCapacity) * 100 : 0;

  // Fetch member growth (last 6 months)
  const memberGrowth = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'member')
      .lte('created_at', monthEnd.toISOString());

    memberGrowth.push({
      month: format(date, 'MMM'),
      count: count || 0,
    });
  }

  // Fetch revenue data (last 30 days)
  const revenueData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');

    const { data: dayPayments } = await supabase
      .from('payments')
      .select('amount')
      .gte('payment_date', dateStr)
      .lt('payment_date', format(new Date(date.getTime() + 86400000), 'yyyy-MM-dd'))
      .eq('status', 'completed');

    revenueData.push({
      date: format(date, 'MMM d'),
      amount: dayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    });
  }

  // Fetch popular classes
  const { data: bookingsByClass } = await supabase
    .from('bookings')
    .select('schedule_id, schedule:schedules(class:classes(name))')
    .eq('status', 'confirmed')
    .gte('created_at', subMonths(now, 1).toISOString());

  const classBookings: Record<string, number> = {};
  bookingsByClass?.forEach((booking: any) => {
    const className = booking.schedule?.class?.name;
    if (className) {
      classBookings[className] = (classBookings[className] || 0) + 1;
    }
  });

  const popularClasses = Object.entries(classBookings)
    .map(([name, bookings]) => ({ name, bookings }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  // Fetch recent bookings
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users(full_name, avatar_url),
      schedule:schedules(date, start_time, class:classes(name))
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    totalMembers: totalMembers || 0,
    activeToday,
    revenueMTD,
    classOccupancy: Math.round(classOccupancy),
    memberGrowth,
    revenueData,
    popularClasses,
    recentBookings: recentBookings || [],
  };
}
