import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productsApi } from '@/services/api';
import type { CreateProductDto, UpdateProductDto } from '@/types';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ data, image }: { data: CreateProductDto; image: File | null }) => {
      const response = await productsApi.create(data);
      const product = response.data;

      if (image && product.id) {
        await productsApi.uploadImage(product.id, image);
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla oluşturuldu');
      navigate('/');
    },
    onError: () => {
      toast.error('Ürün oluşturulurken bir hata oluştu');
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ data, image }: { data: UpdateProductDto; image: File | null }) => {
      await productsApi.update(id, data);

      if (image) {
        await productsApi.uploadImage(id, image);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla güncellendi');
      navigate('/');
    },
    onError: () => {
      toast.error('Ürün güncellenirken bir hata oluştu');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla silindi');
    },
    onError: () => {
      toast.error('Ürün silinirken bir hata oluştu');
    },
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      productsApi.uploadImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Görsel başarıyla yüklendi');
    },
    onError: () => {
      toast.error('Görsel yüklenirken bir hata oluştu');
    },
  });
}
