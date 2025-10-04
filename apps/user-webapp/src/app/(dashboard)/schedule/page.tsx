'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useClassSchedules } from '@/hooks/use-classes';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatTime, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const { data: schedules, isLoading } = useClassSchedules(
    startDate.toISOString(),
    endDate.toISOString()
  );

  const groupedByDay = schedules?.reduce((acc: any, schedule: any) => {
    const day = formatDate(schedule.start_time);
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {});

  const handlePrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handleToday = () => setCurrentWeek(new Date());

  const handleAddToGoogleCalendar = (schedule: any) => {
    const startTime = new Date(schedule.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(schedule.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(schedule.class?.name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(schedule.class?.description || '')}&location=Gym`;
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
            <p className="mt-2 text-gray-600">View all available classes</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleToday}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : groupedByDay && Object.keys(groupedByDay).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByDay).map(([day, daySchedules]: [string, any]) => (
                <div key={day}>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{day}</h3>
                  <div className="space-y-3">
                    {daySchedules.map((schedule: any) => (
                      <div key={schedule.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{schedule.class?.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </p>
                          <p className="text-sm text-gray-500">with {schedule.instructor?.name}</p>
                        </div>
                        <button
                          onClick={() => handleAddToGoogleCalendar(schedule)}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                          Add to Calendar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-600">No classes scheduled for this week</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
