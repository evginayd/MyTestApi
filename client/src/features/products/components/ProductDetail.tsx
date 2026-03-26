import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useDeleteProduct } from '../hooks/useProductMutations';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/features/auth/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading } = useProduct(Number(id));
  const deleteMutation = useDeleteProduct();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate('/'),
    });
  };

  if (isLoading) return <Spinner />;
  if (!product) return <p className="text-center py-16 text-gray-500">Ürün bulunamadı</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Geri
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl text-indigo-600 font-bold mt-2">{formatPrice(product.price)}</p>

          {isAuthenticated && (
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={`/products/${product.id}/edit`}>
                <Button variant="secondary">
                  <Pencil className="w-4 h-4" /> Düzenle
                </Button>
              </Link>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4" /> Sil
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Ürünü Sil"
        onConfirm={handleDelete}
        confirmText="Sil"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
      >
        <p>Bu ürünü silmek istediğinize emin misiniz?</p>
      </Modal>
    </div>
  );
}
