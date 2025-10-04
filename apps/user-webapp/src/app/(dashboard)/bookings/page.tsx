'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useBookings } from '@/hooks/use-bookings';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatDateTime, getTimeUntil } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookingsPage() {
  const { upcomingBookings, pastBookings, cancelBooking, isLoadingUpcoming, isLoadingPast, isCancelling } = useBookings();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;

    try {
      await cancelBooking({ bookingId });
      setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your class bookings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`border-b-2 pb-3 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`border-b-2 pb-3 text-sm font-medium ${
                activeTab === 'past'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Past
            </button>
          </nav>
        </div>

        {/* Upcoming Bookings */}
        {activeTab === 'upcoming' && (
          <>
            {isLoadingUpcoming ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking: any) => (
                  <div key={booking.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{booking.class?.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{formatDateTime(booking.schedule?.start_time)}</p>
                        <p className="text-sm text-gray-500">Instructor: {booking.schedule?.instructor?.name}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {getTimeUntil(booking.schedule?.start_time)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking.id === selectedBooking ? null : booking.id)}
                          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          {selectedBooking === booking.id ? 'Hide QR' : 'Show QR'}
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={isCancelling}
                          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          {isCancelling ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>

                    {selectedBooking === booking.id && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex flex-col items-center">
                          <QRCodeSVG value={booking.id} size={200} />
                          <p className="mt-2 text-sm text-gray-600">Scan this QR code at check-in</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
                <p className="text-gray-600">No upcoming bookings</p>
              </div>
            )}
          </>
        )}

        {/* Past Bookings */}
        {activeTab === 'past' && (
          <>
            {isLoadingPast ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : pastBookings && pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking: any) => (
                  <div key={booking.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{booking.class?.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{formatDateTime(booking.schedule?.start_time)}</p>
                        <p className="text-sm text-gray-500">Instructor: {booking.schedule?.instructor?.name}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
                <p className="text-gray-600">No past bookings</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
