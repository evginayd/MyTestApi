import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { ProductDto } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://mytestapi-vndo.onrender.com';

interface ProductCardProps {
  product: ProductDto;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={`${API_BASE}${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-300 text-4xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-indigo-600 font-bold mt-1">{formatPrice(product.price)}</p>
        {isAuthenticated && (
          <div className="flex gap-2 mt-3">
            <Link to={`/products/${product.id}/edit`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <Pencil className="w-3.5 h-3.5" /> Düzenle
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => onDelete(product.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
