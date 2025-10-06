'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Booking } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { exportToCSV } from '@/lib/utils/export';

async function fetchBookings(): Promise<Booking[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users(full_name, email),
      schedule:schedules(date, start_time, class:classes(name))
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Booking[];
}

export default function BookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const columns = [
    {
      key: 'member',
      label: 'Member',
      render: (booking: Booking) => (booking as any).user?.full_name || '-',
    },
    {
      key: 'class',
      label: 'Class',
      render: (booking: Booking) => (booking as any).schedule?.class?.name || '-',
    },
    {
      key: 'date',
      label: 'Date',
      render: (booking: Booking) => {
        const date = (booking as any).schedule?.date;
        return date ? formatDate(date) : '-';
      },
    },
    {
      key: 'time',
      label: 'Time',
      render: (booking: Booking) => {
        const time = (booking as any).schedule?.start_time;
        return time ? formatTime(time) : '-';
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking: Booking) => {
        const status = booking.status;
        const colors: Record<string, string> = {
          confirmed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
          completed: 'bg-blue-100 text-blue-800',
          pending: 'bg-yellow-100 text-yellow-800',
        };
        return <Badge className={colors[status] || colors.pending}>{status}</Badge>;
      },
    },
    {
      key: 'booking_date',
      label: 'Booked At',
      render: (booking: Booking) => formatDate(booking.booking_date),
    },
  ];

  const handleExport = () => {
    if (!bookings) return;

    const exportData = bookings.map((booking: any) => ({
      Member: booking.user?.full_name || '-',
      Email: booking.user?.email || '-',
      Class: booking.schedule?.class?.name || '-',
      Date: booking.schedule?.date || '-',
      Time: booking.schedule?.start_time || '-',
      Status: booking.status,
      'Booked At': booking.booking_date,
    }));

    exportToCSV(exportData, 'bookings');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage class bookings</p>
          </div>
          <Button onClick={handleExport} variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading bookings...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={bookings || []}
            searchKey="user.full_name"
            searchPlaceholder="Search bookings..."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
