import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api/bookings.api';
import { toast } from 'sonner';
import type { BookClassInput, CancelBookingInput, JoinWaitlistInput } from '@/lib/schemas/booking.schema';

export function useBookings() {
  const queryClient = useQueryClient();

  const { data: upcomingBookings, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: bookingsApi.getUpcomingBookings,
  });

  const { data: pastBookings, isLoading: isLoadingPast } = useQuery({
    queryKey: ['bookings', 'past'],
    queryFn: bookingsApi.getPastBookings,
  });

  const bookClassMutation = useMutation({
    mutationFn: bookingsApi.bookClass,
    onSuccess: () => {
      toast.success('Kelas berhasil dibooking!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal booking kelas');
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: bookingsApi.cancelBooking,
    onSuccess: () => {
      toast.success('Booking berhasil dibatalkan');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal membatalkan booking');
    },
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: bookingsApi.joinWaitlist,
    onSuccess: () => {
      toast.success('Berhasil join waitlist!');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal join waitlist');
    },
  });

  return {
    upcomingBookings,
    pastBookings,
    isLoadingUpcoming,
    isLoadingPast,
    bookClass: bookClassMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
    joinWaitlist: joinWaitlistMutation.mutateAsync,
    isBooking: bookClassMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => bookingsApi.getBookingById(bookingId),
    enabled: !!bookingId,
  });
}
