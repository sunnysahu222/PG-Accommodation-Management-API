import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pgService } from '../services/pgService';
import { getApiErrorMessage } from '../utils/apiError';
import toast from 'react-hot-toast';

// React Query handles the stuff that's tedious to hand-roll: loading state,
// caching (so navigating back to a page you already visited doesn't
// re-fetch instantly), and automatic refetching after mutations.

export function usePgs(filters) {
  return useQuery({
    queryKey: ['pgs', filters], // changes to filters automatically trigger a refetch
    queryFn: () => pgService.getAll(filters),
  });
}

export function usePg(id) {
  return useQuery({
    queryKey: ['pgs', id],
    queryFn: () => pgService.getById(id),
    enabled: !!id, // don't fire the request until we actually have an id
  });
}

export function useCreatePg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pgService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] }); // refetch listing data
      toast.success('PG created — pending admin approval');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create PG')),
  });
}

export function useUpdatePg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => pgService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      toast.success('PG updated');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update PG')),
  });
}

export function useDeletePg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pgService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      toast.success('PG deleted');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete PG')),
  });
}