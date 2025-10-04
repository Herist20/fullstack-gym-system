'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useBookings } from '@/hooks/use-bookings';
import { useMembership } from '@/hooks/use-membership';
import { LoadingSpinner } from '@/components/ui/loading';
import { getTimeUntil, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function HomePage() {
  const { upcomingBookings, isLoadingUpcoming } = useBookings();
  const { membership, usageStats, isLoading } = useMembership();

  const nextBookings = upcomingBookings?.slice(0, 3) || [];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-2 text-white/90">Ready for your next workout?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classes This Month</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    usageStats?.classesThisMonth || 0
                  )}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Membership Status</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : membership ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {isLoadingUpcoming ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    upcomingBookings?.length || 0
                  )}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              href="/classes"
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Book a Class</h3>
                <p className="text-sm text-gray-600">Browse and book classes</p>
              </div>
            </Link>

            <Link
              href="/schedule"
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Schedule</h3>
                <p className="text-sm text-gray-600">See all available classes</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
            <Link href="/bookings" className="text-sm font-medium text-primary hover:text-primary/80">
              View All
            </Link>
          </div>

          {isLoadingUpcoming ? (
            <div className="mt-4 flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : nextBookings.length > 0 ? (
            <div className="mt-4 space-y-3">
              {nextBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.class?.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.schedule?.start_time)}
                    </p>
                    <p className="text-xs text-gray-500">
                      with {booking.schedule?.instructor?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {getTimeUntil(booking.schedule?.start_time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-600">No upcoming bookings</p>
              <Link
                href="/classes"
                className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary/80"
              >
                Book your first class
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
    </AuthGuard>
  );
}
