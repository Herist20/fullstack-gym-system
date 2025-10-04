import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications.api';
import { useNotificationStore } from '@/store/notification.store';
import { toast } from 'sonner';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { setNotifications } = useNotificationStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      toast.success('Semua notifikasi ditandai sudah dibaca');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: notificationsApi.updatePreferences,
    onSuccess: () => {
      toast.success('Notification preferences updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    updatePreferences: updatePreferencesMutation.mutateAsync,
  };
}
