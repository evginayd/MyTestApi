import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import type { RegisterDto } from '@/types';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    },
    onError: () => {
      toast.error('Kayıt sırasında bir hata oluştu');
    },
  });
}
