import { useState } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useProductMutations';
import { ProductCard } from './ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';

import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

export function ProductList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [desc, setDesc] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const pageSize = 12;

  const { data: products, isLoading } = useProducts({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    sortBy: sortBy || undefined,
    desc: desc || undefined,
  });

  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setDesc(!desc);
    } else {
      setSortBy(field);
      setDesc(false);
    }
  };

  const totalPages = products ? Math.ceil(products.length < pageSize ? page : page + 1) : 1;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'name' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => toggleSort('name')}
          >
            Ad {sortBy === 'name' && (desc ? <SortDesc className="w-3.5 h-3.5" /> : <SortAsc className="w-3.5 h-3.5" />)}
          </Button>
          <Button
            variant={sortBy === 'price' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => toggleSort('price')}
          >
            Fiyat {sortBy === 'price' && (desc ? <SortDesc className="w-3.5 h-3.5" /> : <SortAsc className="w-3.5 h-3.5" />)}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Henüz ürün bulunmuyor</p>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
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
