/* eslint-disable quotes */
'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import userService from '@/services/userService';

const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt',
  );

const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Không được để trống mật khẩu hiện tại'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Không được để trống xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không trùng khớp',
    path: ['confirmPassword'],
  });

const SettingSecurity = () => {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const data = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      const res = await userService.changePassword(user.id, data);
      if (res) {
        toast.success('Cập nhật mật khẩu thành công.');
        localStorage.setItem(KEY_LOCALSTORAGE.CURRENT_USER, JSON.stringify(res.data));
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại"
                    {...field}
                  />
                  <Button variant="ghost" type="button" className="absolute top-0 right-0">
                    {showCurrentPassword ? (
                      <EyeOff size={20} className="text-gray-600" onClick={() => setShowCurrentPassword(false)} />
                    ) : (
                      <Eye size={20} className="text-gray-600" onClick={() => setShowCurrentPassword(true)} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showNewPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu mới" {...field} />
                  <Button variant="ghost" type="button" className="absolute top-0 right-0">
                    {showNewPassword ? (
                      <EyeOff size={20} className="text-gray-600" onClick={() => setShowNewPassword(false)} />
                    ) : (
                      <Eye size={20} className="text-gray-600" onClick={() => setShowNewPassword(true)} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu mới"
                    {...field}
                  />
                  <Button variant="ghost" type="button" className="absolute top-0 right-0">
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="text-gray-600" onClick={() => setShowConfirmPassword(false)} />
                    ) : (
                      <Eye size={20} className="text-gray-600" onClick={() => setShowConfirmPassword(true)} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
            )}
            Cập nhật mật khẩu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingSecurity;
