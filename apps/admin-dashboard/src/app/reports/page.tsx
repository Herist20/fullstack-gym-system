'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchMembershipReport,
  fetchRevenueReport,
  fetchAttendanceReport,
  fetchClassPerformanceReport,
  fetchTrainerPerformanceReport,
} from '@/lib/api/reports.api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'membership' | 'revenue' | 'attendance' | 'class' | 'trainer'>('membership');

  const { data: membershipReport } = useQuery({
    queryKey: ['membership-report'],
    queryFn: () => fetchMembershipReport(),
  });

  const { data: revenueReport } = useQuery({
    queryKey: ['revenue-report'],
    queryFn: () => fetchRevenueReport(),
  });

  const { data: attendanceReport } = useQuery({
    queryKey: ['attendance-report'],
    queryFn: () => fetchAttendanceReport(),
  });

  const { data: classPerformance } = useQuery({
    queryKey: ['class-performance'],
    queryFn: fetchClassPerformanceReport,
  });

  const { data: trainerPerformance } = useQuery({
    queryKey: ['trainer-performance'],
    queryFn: fetchTrainerPerformanceReport,
  });

  const handleExport = () => {
    alert('Export functionality - integrate with CSV/PDF generation');
  };

  const reportTypes = [
    { id: 'membership', label: 'Membership Report', icon: Users },
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { id: 'attendance', label: 'Attendance Report', icon: TrendingUp },
    { id: 'class', label: 'Class Performance', icon: FileText },
    { id: 'trainer', label: 'Trainer Performance', icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-600 mt-1">View and export detailed reports</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Report Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  reportType === type.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Membership Report */}
        {reportType === 'membership' && membershipReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600">Total Memberships</div>
                <div className="text-2xl font-bold text-gray-900">{membershipReport.stats.total}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Active</div>
                <div className="text-2xl font-bold text-green-600">{membershipReport.stats.active}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Expired</div>
                <div className="text-2xl font-bold text-orange-600">{membershipReport.stats.expired}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Cancelled</div>
                <div className="text-2xl font-bold text-red-600">{membershipReport.stats.cancelled}</div>
              </Card>
            </div>
          </div>
        )}

        {/* Revenue Report */}
        {reportType === 'revenue' && revenueReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">${revenueReport.stats.totalRevenue.toFixed(2)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">${revenueReport.stats.pendingRevenue.toFixed(2)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Refunded</div>
                <div className="text-2xl font-bold text-red-600">${revenueReport.stats.refundedRevenue.toFixed(2)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Transactions</div>
                <div className="text-2xl font-bold text-gray-900">{revenueReport.stats.transactionCount}</div>
              </Card>
            </div>
          </div>
        )}

        {/* Attendance Report */}
        {reportType === 'attendance' && attendanceReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600">Total Bookings</div>
                <div className="text-2xl font-bold text-gray-900">{attendanceReport.stats.total}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Confirmed</div>
                <div className="text-2xl font-bold text-green-600">{attendanceReport.stats.confirmed}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Cancelled</div>
                <div className="text-2xl font-bold text-red-600">{attendanceReport.stats.cancelled}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">{attendanceReport.stats.pending}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Attendance Rate</div>
                <div className="text-2xl font-bold text-orange-600">{attendanceReport.stats.attendanceRate}%</div>
              </Card>
            </div>
          </div>
        )}

        {/* Class Performance */}
        {reportType === 'class' && classPerformance && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Class Performance Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedules</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bookings</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classPerformance.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.class.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.class.trainer?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.totalSchedules}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.confirmedBookings}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-orange-600">{item.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Trainer Performance */}
        {reportType === 'trainer' && trainerPerformance && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trainer Performance Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Classes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trainerPerformance.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.trainer.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.trainer.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.totalClasses}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.totalStudents}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-orange-600">{item.totalBookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
