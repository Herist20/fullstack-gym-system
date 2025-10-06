'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { DataTable } from '@/components/ui/data-table';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface PendingPayment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  type: string;
  metadata: any;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

async function fetchPendingPayments(): Promise<PendingPayment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      user:users(full_name, email, phone)
    `)
    .eq('payment_method', 'bank_transfer')
    .in('status', ['pending'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PendingPayment[];
}

export default function ManualPaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: fetchPendingPayments,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const confirmMutation = useMutation({
    mutationFn: async ({ paymentId, notes }: { paymentId: string; notes: string }) => {
      const response = await fetch('/api/payments/manual/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, notes }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to confirm payment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Payment confirmed successfully!');
      setShowConfirmModal(false);
      setSelectedPayment(null);
      setNotes('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to confirm payment');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
      const response = await fetch('/api/payments/manual/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject payment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment rejected');
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectReason('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject payment');
    },
  });

  const handleConfirm = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowConfirmModal(true);
  };

  const handleReject = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowRejectModal(true);
  };

  const handleViewProof = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowImageModal(true);
  };

  const columns = [
    {
      key: 'user',
      label: 'Member',
      render: (payment: PendingPayment) => (
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
      render: (payment: PendingPayment) => (
        <span className="font-semibold text-gray-900">
          Rp {payment.amount.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (payment: PendingPayment) => (
        <span className="capitalize text-sm text-gray-600">{payment.type}</span>
      ),
    },
    {
      key: 'proof',
      label: 'Payment Proof',
      render: (payment: PendingPayment) => {
        const hasProof = payment.metadata?.proof_url;
        return hasProof ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewProof(payment)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Proof
          </Button>
        ) : (
          <Badge className="bg-yellow-100 text-yellow-800">No Proof Yet</Badge>
        );
      },
    },
    {
      key: 'date',
      label: 'Created',
      render: (payment: PendingPayment) => (
        <span className="text-sm text-gray-600">
          {new Date(payment.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment: PendingPayment) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => handleConfirm(payment)}
            className="bg-green-600 hover:bg-green-700"
            disabled={confirmMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirm
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleReject(payment)}
            disabled={rejectMutation.isPending}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const pendingCount = payments?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manual Payment Confirmation</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and confirm pending manual payments
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="font-semibold">
              {pendingCount} Pending {pendingCount === 1 ? 'Payment' : 'Payments'}
            </span>
          </div>
        </div>

        {pendingCount === 0 && !isLoading ? (
          <Card className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All Caught Up! 🎉
            </h3>
            <p className="text-gray-600">
              No pending payments to review at the moment.
            </p>
          </Card>
        ) : (
          <Card>
            <DataTable
              data={payments || []}
              columns={columns}
              isLoading={isLoading}
              searchable
              searchPlaceholder="Search payments..."
            />
          </Card>
        )}

        {/* View Proof Modal */}
        {selectedPayment && showImageModal && (
          <Modal
            isOpen={showImageModal}
            onClose={() => {
              setShowImageModal(false);
              setSelectedPayment(null);
            }}
            title="Payment Proof"
          >
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Member:</strong> {selectedPayment.user?.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> Rp {selectedPayment.amount.toLocaleString('id-ID')}
                </p>
              </div>

              {selectedPayment.metadata?.proof_url ? (
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedPayment.metadata.proof_url}
                    alt="Payment Proof"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>No payment proof uploaded yet</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowImageModal(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowImageModal(false);
                    setShowConfirmModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Payment
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Confirm Modal */}
        {selectedPayment && showConfirmModal && (
          <Modal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedPayment(null);
              setNotes('');
            }}
            title="Confirm Payment"
          >
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Are you sure you want to confirm this payment?
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-semibold text-green-900">
                    {selectedPayment.user?.full_name}
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    Rp {selectedPayment.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add any notes about this payment confirmation..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => confirmMutation.mutate({ paymentId: selectedPayment.id, notes })}
                  disabled={confirmMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmMutation.isPending ? 'Confirming...' : 'Confirm Payment'}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Reject Modal */}
        {selectedPayment && showRejectModal && (
          <Modal
            isOpen={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedPayment(null);
              setRejectReason('');
            }}
            title="Reject Payment"
          >
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to reject this payment?
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-semibold text-red-900">
                    {selectedPayment.user?.full_name}
                  </p>
                  <p className="text-lg font-bold text-red-900">
                    Rp {selectedPayment.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Please provide a reason for rejecting this payment..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    rejectMutation.mutate({
                      paymentId: selectedPayment.id,
                      reason: rejectReason,
                    })
                  }
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject Payment'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
