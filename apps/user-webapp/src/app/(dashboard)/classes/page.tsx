'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useClasses, useClassSchedules } from '@/hooks/use-classes';
import { useBookings } from '@/hooks/use-bookings';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatTime, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ClassesPage() {
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: schedules, isLoading: isLoadingSchedules } = useClassSchedules();
  const { bookClass, joinWaitlist, isBooking } = useBookings();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchedules = schedules?.filter((schedule: any) => {
    const matchesClass = selectedClass === 'all' || schedule.class_id === selectedClass;
    const matchesSearch = searchQuery === '' ||
      schedule.class?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleBook = async (scheduleId: string, classId: string, maxCapacity: number, currentBookings: number) => {
    try {
      if (currentBookings >= maxCapacity) {
        const confirm = window.confirm('This class is full. Do you want to join the waitlist?');
        if (confirm) {
          await joinWaitlist({ scheduleId, classId });
        }
      } else {
        await bookClass({ scheduleId, classId });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Classes</h1>
          <p className="mt-2 text-gray-600">Find and book your next workout</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search classes or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Classes</option>
            {classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class Schedules */}
        {isLoadingSchedules ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredSchedules && filteredSchedules.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchedules.map((schedule: any) => {
              const currentBookings = schedule.bookings_count?.[0]?.count || 0;
              const spotsLeft = schedule.max_capacity - currentBookings;
              const isFull = spotsLeft <= 0;

              return (
                <div key={schedule.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{schedule.class?.name}</h3>
                    <p className="text-sm text-gray-600">{schedule.class?.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{schedule.instructor?.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(schedule.start_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={isFull ? 'text-red-600' : 'text-green-600'}>
                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(schedule.id, schedule.class_id, schedule.max_capacity, currentBookings)}
                    disabled={isBooking}
                    className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isBooking ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Booking...
                      </div>
                    ) : isFull ? (
                      'Join Waitlist'
                    ) : (
                      'Book Class'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            <p className="text-gray-600">No classes found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
