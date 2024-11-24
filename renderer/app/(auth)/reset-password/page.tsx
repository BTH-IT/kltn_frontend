'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Lock, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { KEY_LOCALSTORAGE } from '@/utils';

import InputForm from '../_components/InputForm';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'confirmPassword must be at least 8 characters'),
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    const isAdmin = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_ROLE) || 'user';

    if (storedUser) {
      if (isAdmin.toLowerCase() === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, []);

  const params = useSearchParams();

  const getTokenAndEmail = (params: URLSearchParams) => {
    const token = params.get('token');
    const email = params.get('email');
    return { token, email };
  };

  const { token, email } = getTokenAndEmail(params);

  const onSubmit = async (values: ResetPasswordFormInputs) => {
    try {
      const data = {
        email,
        token,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      const res = await authService.resetPassword(data);

      if (res) {
        toast.success('Đổi mật khẩu thành công');
        redirect('/login');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="grid w-screen h-screen grid-cols-12 gap-2">
      <div className="col-span-6 bg-[#EBF7F7] flex items-center justify-center">
        <Image src="/images/forgot-password.png" width={1000} height={1000} objectFit="cover" alt={'Reset password'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold text-center">Reset Password</h2>

          <div className="mt-10 flex flex-col gap-7 w-[400px]">
            <InputForm
              name={'newPassword'}
              error={errors.newPassword?.message}
              control={control}
              placeholder="New Password"
              type="password"
              iconStart={<Lock />}
              iconEnd
            />

            <InputForm
              name={'confirmPassword'}
              error={errors.confirmPassword?.message}
              control={control}
              placeholder="Confirm Password"
              iconStart={<LockKeyhole />}
              type="password"
              iconEnd
            />
          </div>

          <Button type="submit" className="mt-10 bg-[#2FB2AC] w-full rounded-2xl font-medium text-xl">
            Reset Password
          </Button>

          <Link href={'/login'} className="mt-10 flex gap-2 items-center justify-center text-[#2FB2AC]">
            <ArrowLeft />
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
