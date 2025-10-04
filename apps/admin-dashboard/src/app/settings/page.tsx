'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure system settings and preferences</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Settings module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include gym info, memberships, policies, email templates, users & roles, and notifications</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
