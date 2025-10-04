'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useMembership } from '@/hooks/use-membership';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useState } from 'react';

export default function MembershipPage() {
  const { membership, plans, paymentHistory, usageStats, updateAutoRenewal, isLoading } = useMembership();
  const [autoRenewal, setAutoRenewal] = useState(membership?.auto_renewal || false);

  const handleAutoRenewalChange = async (enabled: boolean) => {
    setAutoRenewal(enabled);
    await updateAutoRenewal(enabled);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership</h1>
          <p className="mt-2 text-gray-600">Manage your membership and billing</p>
        </div>

        {/* Current Membership */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Current Membership</h2>
          {isLoading ? (
            <div className="mt-4 flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : membership ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="text-lg font-semibold text-gray-900">{membership.plan?.name}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                  membership.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {membership.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Expires on</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(membership.end_date)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Monthly Price</p>
                <p className="text-lg font-semibold text-gray-900">Rp {membership.plan?.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">Auto Renewal</p>
                  <p className="text-sm text-gray-600">Automatically renew your membership</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    onChange={(e) => handleAutoRenewalChange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-600">No active membership</p>
            </div>
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">This Month</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{usageStats?.classesThisMonth || 0}</p>
            <p className="text-sm text-gray-600">Classes attended</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Total</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{usageStats?.totalClasses || 0}</p>
            <p className="text-sm text-gray-600">Classes attended</p>
          </div>
        </div>

        {/* Payment History */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          {isLoading ? (
            <div className="mt-4 flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : paymentHistory && paymentHistory.length > 0 ? (
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map((payment: any) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(payment.created_at)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{payment.membership?.plan?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Rp {payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-600">No payment history</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
