/* eslint-disable quotes */
/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { SET_LOCALSTORAGE } from '@/utils';
import withPermission from '@/libs/hoc/withPermission';
import { signUpSchema, SignUpFormInputs } from '@/utils/schemas';
import { Separator } from '@/components/ui/separator';

import InputForm from '../_components/InputForm';

export default withPermission(() => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpFormInputs) => {
    try {
      const res: any = await authService.login(values);
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
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/accounts/login-google`;
  };

  return (
    <div className="grid w-screen h-screen grid-cols-12 gap-2">
      <div className="col-span-6 bg-[#EBF7F7] flex items-center justify-center">
        <Image src="/images/login.png" width={1000} height={1000} objectFit="cover" alt={'Login'} />
      </div>
      <div className="flex items-center justify-center col-span-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[600px] p-5 mx-auto rounded-md">
          <h2 className="text-3xl font-bold">Welcome to Back!</h2>
          <p className="mt-1 mb-5 text-[#919191]">Please log in to your account and start the adventure</p>

          <div className="flex flex-col gap-5">
            <InputForm
              name={'identifier'}
              error={errors.identifier?.message}
              control={control}
              placeholder="Username or email"
              type="text"
              iconStart={<User />}
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

            <div className="flex justify-end w-full">
              <Link href={'/forgot-password'} className="text-[#2FB2AC]">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="mt-5 bg-[#2FB2AC] w-full rounded-2xl font-medium text-xl">
            Log in
          </Button>

          <Separator className="my-8" />

          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-medium rounded-2xl"
            onClick={handleGoogleLogin}
          >
            <Image src="/images/google-logo.png" width={24} height={24} alt="Google" className="mr-2" />
            Login with Google
          </Button>

          <p className="mt-10 flex gap-2 items-center justify-center text-[#919191]">
            <span>Don't have any account?</span>
            <Link href={'/register'} className="text-[#2FB2AC]">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
});
