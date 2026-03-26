import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useRegister';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
            <UserPlus className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kayıt Ol</h1>
          <p className="text-gray-500 mt-1">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Kullanıcı Adı"
            {...register('username')}
            error={errors.username?.message}
            placeholder="Kullanıcı adı belirleyin"
          />
          <Input
            label="Ad Soyad"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Adınızı ve soyadınızı girin"
          />
          <Input
            label="E-posta"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="E-posta adresinizi girin"
          />
          <Input
            label="Şifre"
            type="password"
            {...register('passwordHash')}
            error={errors.passwordHash?.message}
            placeholder="En az 6 karakter"
          />
          <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
            Kayıt Ol
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
