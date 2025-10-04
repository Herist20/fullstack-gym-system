'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-sm text-gray-600 mt-1">Manage payments, invoices, and billing</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Payments & billing module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include payment tracking, invoice generation, refunds, and revenue analytics</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
