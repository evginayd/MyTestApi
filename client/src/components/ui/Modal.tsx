import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = 'Onayla', confirmVariant = 'primary', isLoading }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-gray-600 mb-6">{children}</div>
        {onConfirm && (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              İptal
            </Button>
            <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
