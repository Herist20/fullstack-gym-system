'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function TrainerStudentsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['trainer-students', user?.id],
    queryFn: async () => {
      // Get all bookings for this trainer's schedules
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(id, full_name, email),
          schedule:schedules!inner(
            trainer_id,
            class:classes(name)
          )
        `)
        .eq('schedule.trainer_id', user?.id)
        .eq('status', 'confirmed');

      // Get unique students
      const uniqueStudents = new Map();
      bookings?.forEach((booking: any) => {
        if (booking.user && !uniqueStudents.has(booking.user.id)) {
          uniqueStudents.set(booking.user.id, {
            ...booking.user,
            totalBookings: 1,
            classes: [booking.schedule?.class?.name],
          });
        } else if (booking.user) {
          const student = uniqueStudents.get(booking.user.id);
          student.totalBookings++;
          if (
            booking.schedule?.class?.name &&
            !student.classes.includes(booking.schedule.class.name)
          ) {
            student.classes.push(booking.schedule.class.name);
          }
        }
      });

      return Array.from(uniqueStudents.values());
    },
    enabled: !!user?.id,
  });

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (student: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-semibold">
              {student.full_name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{student.full_name}</div>
            <div className="text-xs text-gray-500">{student.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'bookings',
      label: 'Total Bookings',
      render: (student: any) => (
        <span className="font-semibold text-gray-900">
          {student.totalBookings}
        </span>
      ),
    },
    {
      key: 'classes',
      label: 'Classes Attended',
      render: (student: any) => (
        <div className="flex flex-wrap gap-1">
          {student.classes?.map((className: string, index: number) => (
            <Badge
              key={index}
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {className}
            </Badge>
          ))}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and track your students' progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Students</div>
                <div className="text-2xl font-bold text-gray-900">
                  {students?.length || 0}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-2xl font-bold text-gray-900">
                  {students?.reduce((sum, s) => sum + (s.totalBookings || 0), 0) ||
                    0}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Avg. per Student</div>
                <div className="text-2xl font-bold text-gray-900">
                  {students && students.length > 0
                    ? (
                        students.reduce(
                          (sum, s) => sum + (s.totalBookings || 0),
                          0
                        ) / students.length
                      ).toFixed(1)
                    : '0'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <DataTable
            data={students || []}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search students..."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
