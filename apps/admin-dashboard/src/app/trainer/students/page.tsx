'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function TrainerStudentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage your students</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Trainer students module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include student list, attendance history, and performance tracking</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
