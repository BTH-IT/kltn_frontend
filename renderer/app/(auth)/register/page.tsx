'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, LockKeyhole, Mail, User } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import InputForm from '../_components/InputForm';

const signUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'confirmPassword must be at least 8 characters'),
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormInputs) => {
    console.log(data);
    // Handle sign-up logic here
  };

  return (
    <div className="grid w-screen h-screen grid-cols-12 gap-2">
      <div className="col-span-6 bg-[#EBF7F7] flex items-center justify-center">
        <Image src="/images/forgot-password.png" width={1000} height={1000} objectFit="cover" alt={'Forgot Password'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="mt-1 mb-5 text-[#919191]">Please sign up to your account and start the adventure</p>

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
              name={'email'}
              error={errors.username?.message}
              control={control}
              placeholder="Email"
              type="text"
              iconStart={<Mail />}
            />

            <InputForm
              name={'password'}
              error={errors.username?.message}
              control={control}
              placeholder="Password"
              type="password"
              iconStart={<Lock />}
              iconEnd
            />

            <InputForm
              name={'confirmPassword'}
              error={errors.username?.message}
              control={control}
              placeholder="Confirm Password"
              iconStart={<LockKeyhole />}
              type="password"
              iconEnd
            />
          </div>

          <Button type="submit" className="mt-10 bg-[#2FB2AC] w-full rounded-2xl font-medium text-xl">
            Sign Up
          </Button>

          <p className="mt-10 flex gap-2 items-center justify-center text-[#919191]">
            <span>Already have an account?</span>
            <Link href={'/login'} className="text-[#2FB2AC]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
