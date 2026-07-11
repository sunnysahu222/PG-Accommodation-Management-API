import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: adminService.getUsers });
}

export function useAdminOwners() {
  return useQuery({ queryKey: ['admin', 'owners'], queryFn: adminService.getOwners });
}

export function usePendingPgs() {
  return useQuery({ queryKey: ['admin', 'pgs', 'pending'], queryFn: adminService.getPendingPgs });
}

export function useAnalytics() {
  return useQuery({ queryKey: ['admin', 'analytics'], queryFn: adminService.getAnalytics });
}

export function useReviewPg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminService.reviewPg(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pgs', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      toast.success('Listing reviewed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User blocked');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });
}
