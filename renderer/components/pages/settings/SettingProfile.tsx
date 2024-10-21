'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import userService from '@/services/userService';
import uploadService from '@/services/uploadService';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

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
  gender: z.string().min(1, {
    message: 'Hãy chọn giới tính.',
  }),
});

const SettingProfile = () => {
  const router = useRouter();

  const imageUploadRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    setItems([
      { label: 'Lớp học', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Thông tin cá nhân' },
    ]);
  }, [setItems]);

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
      gender: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('phone', user.phoneNumber);
      form.setValue('fullName', user.fullName);
      form.setValue('dateOfBirth', new Date(user.doB));
      form.setValue('gender', user.gender);

      setLoaded(true);
    }
  }, [user, form]);

  const prepareUserData = (values: z.infer<typeof formSchema>) => ({
    ...user,
    phoneNumber: values.phone,
    fullName: values.fullName,
    doB: values.dateOfBirth,
    gender: values.gender,
  });

  const handleAvatarUpload = async (avatar: File) => {
    const res = await uploadService.uploadMultipleFileWithAWS3([avatar]);
    if (!res) throw new AxiosError('Upload image failed');
    return res[0].url;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      const data = prepareUserData(values);

      if (avatar) {
        data.avatar = await handleAvatarUpload(avatar);
      }

      const res = await userService.updateUser(user.id, data);
      if (res) {
        toast.success('Profile updated successfully.');
        router.refresh();
        localStorage.setItem(KEY_LOCALSTORAGE.CURRENT_USER, JSON.stringify(res.data));
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
    <>
      {user && loaded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col">
              <div className="text-sm pb-4 font-bold">Ảnh đại diện</div>
              <div className="flex items-center gap-8">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={avatar ? URL.createObjectURL(avatar) : user.avatar ?? '/images/avt.png'}
                    alt="Avatar"
                  />
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
                  <FormLabel className="font-bold">Số điện thoại</FormLabel>
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
                  <FormLabel className="font-bold">Họ và tên</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} {...field} />
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
                  <FormLabel className="font-bold">Năm sinh</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={form.formState.isSubmitting}
                      className="focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                  <FormLabel className="font-bold">Giới tính</FormLabel>
                  <Select
                    disabled={form.formState.isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
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
      )}
    </>
  );
};

export default SettingProfile;
