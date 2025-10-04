'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Calendar, Users, Star, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

async function fetchTrainerDashboard(userId: string) {
  const supabase = createClient();

  // Get trainer info
  const { data: trainer } = await supabase
    .from('trainers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!trainer) throw new Error('Trainer not found');

  // Get upcoming classes
  const { data: upcomingClasses } = await supabase
    .from('schedules')
    .select(`
      *,
      class:classes(name, instructor_id)
    `)
    .eq('class.instructor_id', trainer.id)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(10);

  // Get total students (unique users who booked my classes)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('user_id, schedule:schedules(class:classes(instructor_id))')
    .eq('schedule.class.instructor_id', trainer.id);

  const uniqueStudents = new Set(bookings?.map((b) => b.user_id)).size;

  // Get attendance rate
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('schedule.class.instructor_id', trainer.id);

  const { count: completedBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('schedule.class.instructor_id', trainer.id)
    .eq('status', 'completed');

  const attendanceRate =
    totalBookings && totalBookings > 0
      ? Math.round((completedBookings || 0 / totalBookings) * 100)
      : 0;

  return {
    trainer,
    upcomingClasses,
    uniqueStudents,
    attendanceRate,
  };
}

export default function TrainerDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['trainer-dashboard', user?.id],
    queryFn: () => fetchTrainerDashboard(user!.id),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.full_name}!</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Upcoming Classes"
            value={data?.upcomingClasses?.length || 0}
            icon={Calendar}
          />
          <MetricCard
            title="Total Students"
            value={data?.uniqueStudents || 0}
            icon={Users}
          />
          <MetricCard
            title="Attendance Rate"
            value={`${data?.attendanceRate || 0}%`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Rating"
            value={data?.trainer?.rating || '0.0'}
            icon={Star}
          />
        </div>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Available Spots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.upcomingClasses?.map((schedule: any) => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.class?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(schedule.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(schedule.start_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.available_spots}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            schedule.status === 'scheduled'
                              ? 'info'
                              : schedule.status === 'completed'
                              ? 'success'
                              : 'default'
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
