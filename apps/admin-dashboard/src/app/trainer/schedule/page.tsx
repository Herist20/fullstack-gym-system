'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function TrainerSchedulePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-sm text-gray-600 mt-1">View your assigned classes and mark attendance</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Trainer schedule module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include calendar view and attendance marking</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
