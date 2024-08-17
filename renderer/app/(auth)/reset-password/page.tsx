'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Lock, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

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

  const onSubmit = (data: ResetPasswordFormInputs) => {
    console.log(data);
  };

  return (
    <div className="grid w-screen h-screen grid-cols-12 gap-2">
      <div className="col-span-6 bg-[#EBF7F7] flex items-center justify-center">
        <Image src="/images/forgot-password.png" width={1000} height={1000} objectFit="cover" alt={'Reset password'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold">Reset Password</h2>

          <div className="flex flex-col gap-5">
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
