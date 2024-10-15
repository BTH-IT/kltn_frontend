'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, LockKeyhole, Mail, User, IdCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { SET_LOCALSTORAGE } from '@/utils';

import InputForm from '../_components/InputForm';
import { passwordSchema } from '../login/page';

const signUpSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    fullname: z.string().min(1, 'Full name is required'),
    customId: z
      .string()
      .min(1, 'Student ID is required')
      .refine((value) => value.length === 10, { message: 'Student ID must be 10 characters' }),
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
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
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      }
    }
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
              name={'fullname'}
              error={errors.fullname?.message}
              control={control}
              placeholder="Full Name"
              type="text"
              iconStart={<User />}
            />

            <InputForm
              name={'customId'}
              error={errors.customId?.message}
              control={control}
              placeholder="Student ID"
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
              placeholder="Password"
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
