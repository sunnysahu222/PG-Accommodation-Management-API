import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getMine,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking requested! Waiting for owner approval.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => bookingService.updateStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['pgs'] }); // available beds may have changed
      toast.success(`Booking ${status.toLowerCase()}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });
}
