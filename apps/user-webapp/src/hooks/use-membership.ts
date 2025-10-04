import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '@/lib/api/membership.api';
import { toast } from 'sonner';

export function useMembership() {
  const queryClient = useQueryClient();

  const { data: membership, isLoading } = useQuery({
    queryKey: ['membership', 'current'],
    queryFn: membershipApi.getCurrentMembership,
  });

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['membership', 'plans'],
    queryFn: membershipApi.getMembershipPlans,
  });

  const { data: paymentHistory, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['membership', 'payments'],
    queryFn: membershipApi.getPaymentHistory,
  });

  const { data: usageStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['membership', 'usage'],
    queryFn: membershipApi.getUsageStats,
  });

  const updateAutoRenewalMutation = useMutation({
    mutationFn: membershipApi.updateAutoRenewal,
    onSuccess: () => {
      toast.success('Auto renewal setting updated');
      queryClient.invalidateQueries({ queryKey: ['membership', 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update auto renewal');
    },
  });

  return {
    membership,
    plans,
    paymentHistory,
    usageStats,
    isLoading,
    isLoadingPlans,
    isLoadingPayments,
    isLoadingStats,
    updateAutoRenewal: updateAutoRenewalMutation.mutateAsync,
  };
}
