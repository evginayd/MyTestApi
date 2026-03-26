import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import type { PaginationParams } from '@/types';

export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params).then(res => res.data),
    placeholderData: keepPreviousData,
  });
}
