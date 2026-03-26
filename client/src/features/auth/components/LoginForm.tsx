import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
            <LogIn className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Giriş Yap</h1>
          <p className="text-gray-500 mt-1">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Kullanıcı Adı"
            {...register('username')}
            error={errors.username?.message}
            placeholder="Kullanıcı adınızı girin"
          />
          <Input
            label="Şifre"
            type="password"
            {...register('passwordHash')}
            error={errors.passwordHash?.message}
            placeholder="Şifrenizi girin"
          />
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            Giriş Yap
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
