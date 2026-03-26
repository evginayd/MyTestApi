import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { productSchema, type ProductFormValues } from '../schemas/product.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ProductDto } from '@/types';

interface ProductFormProps {
  onSubmit: (data: ProductFormValues, image: File | null, imageRemoved: boolean) => void;
  isLoading: boolean;
  defaultValues?: ProductDto;
}

export function ProductForm({ onSubmit, isLoading, defaultValues }: ProductFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ? { name: defaultValues.name, price: defaultValues.price } : undefined,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValues) {
      reset({ name: defaultValues.name, price: defaultValues.price });
      if (defaultValues.imageUrl) {
        setPreview(defaultValues.imageUrl);
      }
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageRemoved(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data, selectedImage, imageRemoved);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
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

      {/* Resim Yükleme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ürün Görseli
        </label>
        {preview ? (
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-gray-50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Görsel Seç</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        {selectedImage && (
          <p className="mt-1 text-xs text-gray-500">{selectedImage.name}</p>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        {defaultValues ? 'Güncelle' : 'Oluştur'}
      </Button>
    </form>
  );
}
