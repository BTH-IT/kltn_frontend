/* eslint-disable no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn, logError } from '@/libs/utils';
import userService from '@/services/userService';
import { IUser } from '@/types';

const EditUserModal = ({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
}) => {
  const [submitError, setSubmitError] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const FormSchema = z.object({
    customId: z.string().refine((value) => value.length === 10, {
      message: 'Mã sinh viên phải có 10 kí tự',
    }),
    userName: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 kí tự'),
    fullName: z.string().min(3, 'Họ và tên không được để trống'),
    email: z.string().email('Email không hợp lệ'),
    phoneNumber: z.string().regex(/^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
      message: 'Hãy nhập một số điện thoại Việt Nam.',
    }),
    gender: z.string().min(1, 'Giới tính không được để trống'),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customId: '',
      userName: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('customId', user.customId);
      form.setValue('userName', user.userName);
      form.setValue('fullName', user.fullName);
      form.setValue('email', user.email);
      form.setValue('phoneNumber', user.phoneNumber);
      form.setValue('gender', user.gender);
    }
  }, [user, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const { customId, ...rest } = user;
      const data = {
        customId: values.customId,
        ...rest,
      };
      const res = await userService.updateUser(user.id, data);
      if (res.data) {
        toast({
          title: 'Chỉnh sửa người dùng thành công',
          variant: 'done',
          duration: 5000,
        });
        form.reset();
        router.refresh();
        setIsOpen(false);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      logError(error);
      setSubmitError(true);
    }
  };

  const onClose = () => {
    form.reset();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mx-auto">
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Chỉnh sửa người dùng'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="customId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Mã sinh viên</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="studentId"
                            {...field}
                          />
                          <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel className="text-xs font-bold uppercase">Họ và tên</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Số điện thoại</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
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
                      <FormLabel className="text-xs font-bold uppercase">Giới tính</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button disabled={form.formState.isSubmitting} className="px-3 py-2" variant="primary" type="submit">
                  {form.formState.isSubmitting && (
                    <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                  )}
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={submitError} onOpenChange={setSubmitError}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Đã xảy ra lỗi</DialogTitle>
            <DialogDescription className="pt-2 text-black">
              Không thể chỉnh sửa người dùng. Hãy kiểm tra thông tin hoặc thử lại sau.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setSubmitError(false)}
              variant="ghost"
              type="submit"
              className="text-blue-500 hover:bg-blue-50/50 hover:text-blue-500"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUserModal;
