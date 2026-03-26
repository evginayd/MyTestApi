import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-500 mt-4">Sayfa bulunamadı</p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="w-4 h-4" /> Ana Sayfa
        </Button>
      </Link>
    </div>
  );
}
