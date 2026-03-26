import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '../schemas/product.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ProductDto } from '@/types';

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  isLoading: boolean;
  defaultValues?: ProductDto;
}

export function ProductForm({ onSubmit, isLoading, defaultValues }: ProductFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ? { name: defaultValues.name, price: defaultValues.price } : undefined,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ name: defaultValues.name, price: defaultValues.price });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input
        label="Ürün Adı"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Ürün adını girin"
      />
      <Input
        label="Fiyat"
        type="number"
        step="0.01"
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
        placeholder="Fiyat girin"
      />
      <Button type="submit" isLoading={isLoading}>
        {defaultValues ? 'Güncelle' : 'Oluştur'}
      </Button>
    </form>
  );
}
