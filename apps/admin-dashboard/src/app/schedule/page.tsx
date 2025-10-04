'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function SchedulePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-600 mt-1">Manage class schedules and calendar</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Schedule management with calendar view - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include react-big-calendar integration, drag-and-drop, and conflict detection</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
