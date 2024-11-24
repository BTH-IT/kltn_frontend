'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { KEY_LOCALSTORAGE } from '@/utils';

import InputForm from '../_components/InputForm';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
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

  const onSubmit = async (values: ForgotPasswordFormInputs) => {
    try {
      const data = {
        email: values.email,
      };

      const res = await authService.forgotPassword(data);

      if (res) {
        toast.success('Thành công: Vui lòng kiểm tra email');
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
        <Image src="/images/register.png" width={1000} height={1000} objectFit="cover" alt={'Register'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold">Forgot Password?</h2>
          <p className="mt-1 mb-5 text-[#919191]">
            Lost your password? Please enter your email address. You will receive a link to create a new password via
            email.
          </p>

          <div className="flex flex-col gap-5">
            <InputForm
              name={'email'}
              error={errors.email?.message}
              control={control}
              placeholder="Email"
              type="text"
              iconStart={<Mail />}
            />
          </div>

          <Button type="submit" className="mt-10 bg-[#2FB2AC] w-full rounded-2xl font-medium text-xl">
            Send email
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
