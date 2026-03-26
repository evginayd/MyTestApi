import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Kullanıcı adı zorunludur'),
  passwordHash: z.string().min(1, 'Şifre zorunludur'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  passwordHash: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  fullName: z.string().min(1, 'Ad Soyad zorunludur'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
