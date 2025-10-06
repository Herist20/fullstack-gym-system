'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSchedules } from '@/lib/api/schedule.api';
import { useAuth } from '@/hooks/useAuth';

export default function TrainerSchedulePage() {
  const { user } = useAuth();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['trainer-schedules', user?.id],
    queryFn: () => fetchSchedules(),
    enabled: !!user?.id,
  });

  const trainerSchedules = schedules?.filter(
    (schedule) => schedule.trainer?.id === user?.id
  );

  const upcomingSchedules = trainerSchedules?.filter(
    (schedule) =>
      new Date(schedule.start_time) >= new Date() && schedule.status === 'scheduled'
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-sm text-gray-600 mt-1">
            View your assigned classes and upcoming sessions
          </p>
        </div>

        {/* Upcoming Classes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Classes
          </h2>
          {isLoading ? (
            <Card className="p-8 text-center text-gray-500">Loading...</Card>
          ) : upcomingSchedules && upcomingSchedules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingSchedules.map((schedule) => (
                <Card key={schedule.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {schedule.class?.name || 'Unknown Class'}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 mt-1">
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(schedule.start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {new Date(schedule.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(schedule.end_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {schedule.bookings?.length || 0} / {schedule.max_capacity}{' '}
                      participants
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Duration: {schedule.class?.duration_minutes} minutes
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No upcoming classes scheduled</p>
            </Card>
          )}
        </div>

        {/* All Classes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All My Classes
          </h2>
          {trainerSchedules && trainerSchedules.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Participants
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trainerSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {schedule.class?.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(schedule.start_time).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {schedule.bookings?.length || 0} /{' '}
                          {schedule.max_capacity}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              schedule.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : schedule.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {schedule.status.charAt(0).toUpperCase() +
                              schedule.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No classes assigned yet</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
