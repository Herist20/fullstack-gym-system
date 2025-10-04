'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
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

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'user.full_name',
      header: 'Member',
      cell: ({ row }) => (row.original as any).user?.full_name || '-',
    },
    {
      accessorKey: 'schedule.class.name',
      header: 'Class',
      cell: ({ row }) => (row.original as any).schedule?.class?.name || '-',
    },
    {
      accessorKey: 'schedule.date',
      header: 'Date',
      cell: ({ row }) => {
        const date = (row.original as any).schedule?.date;
        return date ? formatDate(date) : '-';
      },
    },
    {
      accessorKey: 'schedule.start_time',
      header: 'Time',
      cell: ({ row }) => {
        const time = (row.original as any).schedule?.start_time;
        return time ? formatTime(time) : '-';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === 'confirmed'
            ? 'success'
            : status === 'cancelled'
            ? 'danger'
            : status === 'completed'
            ? 'info'
            : 'warning';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'booking_date',
      header: 'Booked At',
      cell: ({ row }) => formatDate(row.original.booking_date),
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
