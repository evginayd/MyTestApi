import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useUpdateProduct } from '@/features/products/hooks/useProductMutations';
import { Spinner } from '@/components/ui/Spinner';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(Number(id));
  const updateMutation = useUpdateProduct(Number(id));

  if (isLoading) return <Spinner />;
  if (!product) return <p className="text-center py-16 text-gray-500">Ürün bulunamadı</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Geri
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürünü Düzenle</h1>
      <ProductForm
        onSubmit={(data, image) => updateMutation.mutate({ data, image })}
        isLoading={updateMutation.isPending}
        defaultValues={product}
      />
    </div>
  );
}
