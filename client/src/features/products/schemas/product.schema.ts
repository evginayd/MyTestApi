import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı zorunludur').max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  price: z.number().positive('Fiyat 0\'dan büyük olmalıdır'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
