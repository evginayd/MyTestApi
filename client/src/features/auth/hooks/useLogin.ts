import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuth } from '../context/AuthContext';
import type { LoginDto } from '@/types';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      login(response.data.token);
      toast.success('Giriş başarılı!');
      navigate('/');
    },
    onError: () => {
      toast.error('Kullanıcı adı veya şifre hatalı');
    },
  });
}
