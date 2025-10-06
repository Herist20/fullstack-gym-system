'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Clock, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPayments,
  fetchPaymentStats,
  updatePaymentStatus,
  refundPayment,
} from '@/lib/api/payments.api';
import { PaymentTransaction } from '@/lib/types';

export default function PaymentsPage() {
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  const { data: stats } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: fetchPaymentStats,
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      refundPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'completed' | 'failed' | 'refunded';
    }) => updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
  });

  const handleRefund = (payment: PaymentTransaction) => {
    const reason = prompt('Refund reason (optional):');
    if (confirm(`Refund $${payment.amount} to ${payment.user?.full_name}?`)) {
      refundMutation.mutate({ id: payment.id, reason: reason || undefined });
    }
  };

  const handleStatusChange = (payment: PaymentTransaction, newStatus: any) => {
    if (confirm(`Change payment status to ${newStatus}?`)) {
      updateStatusMutation.mutate({ id: payment.id, status: newStatus });
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Member',
      render: (payment: PaymentTransaction) => (
        <div>
          <div className="font-medium text-gray-900">
            {payment.user?.full_name || 'Unknown'}
          </div>
          <div className="text-xs text-gray-500">{payment.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (payment: PaymentTransaction) => (
        <span className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
      ),
    },
    {
      key: 'method',
      label: 'Method',
      render: (payment: PaymentTransaction) => (
        <span className="text-sm text-gray-600 capitalize">
          {payment.payment_method?.replace('_', ' ') || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (payment: PaymentTransaction) => {
        const colors: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800',
          refunded: 'bg-gray-100 text-gray-800',
        };
        return (
          <Badge className={colors[payment.status] || colors.pending}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      render: (payment: PaymentTransaction) => (
        <span className="text-sm text-gray-600">
          {new Date(payment.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          {payment.status === 'pending' && (
            <button
              onClick={() => handleStatusChange(payment, 'completed')}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Mark Paid
            </button>
          )}
          {payment.status === 'completed' && (
            <button
              onClick={() => handleRefund(payment)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={refundMutation.isPending}
            >
              Refund
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage payments, invoices, and billing
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`}
            icon={DollarSign}
          />
          <MetricCard
            title="This Month"
            value={`$${stats?.revenueThisMonth.toFixed(2) || '0.00'}`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Pending"
            value={stats?.pendingPayments || 0}
            icon={Clock}
          />
          <MetricCard
            title="Failed"
            value={stats?.failedPayments || 0}
            icon={AlertCircle}
          />
        </div>

        {/* Payments Table */}
        <Card>
          <DataTable
            data={payments || []}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search payments..."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
