import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useCreateProduct } from '@/features/products/hooks/useProductMutations';

export function ProductCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Geri
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ürün Oluştur</h1>
      <ProductForm onSubmit={(data, image) => createMutation.mutate({ data, image })} isLoading={createMutation.isPending} />
    </div>
  );
}
