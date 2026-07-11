import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import toast from 'react-hot-toast';

export function useRooms(pgId) {
  return useQuery({
    queryKey: ['rooms', pgId],
    queryFn: () => roomService.getForPg(pgId),
    enabled: !!pgId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pgId, data }) => roomService.create(pgId, data),
    onSuccess: (_, { pgId }) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', pgId] });
      queryClient.invalidateQueries({ queryKey: ['pgs', pgId] }); // bed counts changed too
      toast.success('Room added');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add room'),
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => roomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update room'),
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove room'),
  });
}
