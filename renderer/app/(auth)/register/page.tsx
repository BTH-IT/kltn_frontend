'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, LockKeyhole, Mail, User, IdCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { KEY_LOCALSTORAGE, SET_LOCALSTORAGE } from '@/utils';
import { passwordSchema } from '@/utils/schemas';
import { Separator } from '@/components/ui/separator';

import InputForm from '../_components/InputForm';

const signUpSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    fullname: z.string().min(1, 'Full name is required'),
    customId: z.string(),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(8, 'confirmPassword must be at least 8 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'not_finite',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    const isAdmin = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_ROLE) || 'user';

    if (storedUser) {
      if (isAdmin?.toLowerCase() === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/accounts/login-google`;
  };

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      setIsLoading(true);
      const res: any = await authService.register(data);
      SET_LOCALSTORAGE(res.data);
      await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(res.data),
      });
      router.push('/');
      toast.success('Success: login');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid w-screen h-screen grid-cols-12 gap-2">
      <div className="col-span-6 bg-[#EBF7F7] flex items-center justify-center">
        <Image src="/images/forgot-password.png" width={1000} height={1000} objectFit="cover" alt={'Forgot Password'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold">Đăng ký</h2>
          <p className="mt-1 mb-5 text-[#919191]">Vui lòng đăng ký tài khoản để bắt đầu hành trình</p>

          <div className="flex flex-col gap-5">
            <InputForm
              name={'username'}
              error={errors.username?.message}
              control={control}
              placeholder="Username"
              type="text"
              iconStart={<User />}
            />

            <InputForm
              name={'fullname'}
              error={errors.fullname?.message}
              control={control}
              placeholder="Họ tên"
              type="text"
              iconStart={<User />}
            />

            <InputForm
              name={'customId'}
              error={errors.customId?.message}
              control={control}
              placeholder="Mã sinh viên (nếu có)"
              type="text"
              iconStart={<IdCard />}
            />

            <InputForm
              name={'email'}
              error={errors.email?.message}
              control={control}
              placeholder="Email"
              type="text"
              iconStart={<Mail />}
            />

            <InputForm
              name={'password'}
              error={errors.password?.message}
              control={control}
              placeholder="Mật khẩu"
              type="password"
              iconStart={<Lock />}
              iconEnd
            />

            <InputForm
              name={'confirmPassword'}
              error={errors.confirmPassword?.message}
              control={control}
              placeholder="Xác nhận mật khẩu"
              iconStart={<LockKeyhole />}
              type="password"
              iconEnd
            />
          </div>

          <Button
            type="submit"
            className="mt-10 bg-[#2FB2AC] w-full rounded-2xl font-medium text-xl"
            disabled={isLoading}
          >
            Đăng ký
          </Button>

          <Separator className="my-8" />

          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-medium rounded-2xl"
            onClick={handleGoogleLogin}
          >
            <Image src="/images/google-logo.png" width={24} height={24} alt="Google" className="mr-2" />
            Đăng nhập với Google
          </Button>

          <p className="mt-10 flex gap-2 items-center justify-center text-[#919191]">
            <span>Bạn đã có tài khoản?</span>
            <Link href={'/login'} className="text-[#2FB2AC]">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
