'use client';

import React, { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import userService from '@/services/userService';

const formSchema = z.object({
  phone: z.string().regex(/^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
    message: 'Hãy nhập một số điện thoại Việt Nam.',
  }),
  fullName: z.string().min(2, {
    message: 'Họ và tên cần ít nhất 2 ký tự',
  }),
  dateOfBirth: z.coerce.date({
    required_error: 'Hãy chọn năm sinh.',
  }),
  gender: z.boolean(),
});

const SettingProfile = () => {
  const router = useRouter();

  const imageUploadRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

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
      phone: '',
      fullName: '',
      dateOfBirth: new Date(),
      gender: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('phone', user.phoneNumber);
      form.setValue('fullName', user.fullName);
      form.setValue('dateOfBirth', new Date(user.doB));
      form.setValue('gender', user.gender);

      console.log(user);
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    // upload avatar if exists

    const data = {
      ...user,
      phoneNumber: values.phone,
      fullName: values.fullName,
      doB: values.dateOfBirth,
      gender: values.gender,
      avatar: null,
    };

    try {
      const res = await userService.updateUser(user.id, data);
      if (res) {
        toast.success('Profile updated successfully.');
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error('Please select again.');
      return;
    }

    setAvatar(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col">
          <div className="text-sm">Ảnh đại diện</div>
          <div className="flex items-center gap-8">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar ? URL.createObjectURL(avatar) : '/images/avt.png'} alt="Avatar" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              placeholder="Picture"
              title="Picture"
              onChange={handleAvatarChange}
              className="hidden"
              ref={imageUploadRef}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => (imageUploadRef.current ? imageUploadRef.current.click() : null)}
            >
              Tải hình ảnh lên
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Năm sinh</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                    form.formState.isSubmitting && 'hidden',
                  )}
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Nam</SelectItem>
                  <SelectItem value="false">Nữ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row-reverse w-full">
          <Button className="" type="submit">
            Cập nhật thông tin
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingProfile;
