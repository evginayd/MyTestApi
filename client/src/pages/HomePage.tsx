import { ProductList } from '@/features/products/components/ProductList';

export function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
        <p className="text-gray-500 mt-1">Tüm ürünleri görüntüle ve yönet</p>
      </div>
      <ProductList />
    </div>
  );
}
