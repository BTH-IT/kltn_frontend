'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

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

  const onSubmit = (data: ForgotPasswordFormInputs) => {
    console.log(data);
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
