/* eslint-disable no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/libs/utils';
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
    name: z.string().min(1, { message: 'Tên người dùng là trường bắt buộc.' }),

    // roleId: z.string().min(1, { message: 'Vui lòng chọn quyền cho người dùng.' }),
    // studentId: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      roleId: '3',
      studentId: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.fullName);
      // form.setValue('roleId', String(user.roleId));
      // form.setValue('studentId', user.studentId);
    }
  }, [user, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // try {
    //   if (values.roleId === '3' && !values.studentId) {
    //     form.setError('studentId', {
    //       message: 'Mã sinh viên là trường bắt buộc.',
    //     });
    //     return;
    //   }
    //   const { name, roleId, studentId, ...rest } = user;
    //   const data = {
    //     name: values.name,
    //     roleId: Number(values.roleId),
    //     studentId: values.studentId,
    //     ...rest,
    //   };
    //   const res = await userService.updateUser(user.userId, data);
    //   if (res.data) {
    //     toast({
    //       title: 'Chỉnh sửa người dùng thành công',
    //       variant: 'done',
    //       duration: 5000,
    //     });
    //     form.reset();
    //     router.refresh();
    //     setIsOpen(false);
    //   } else {
    //     setSubmitError(true);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setSubmitError(true);
    // }
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Tên người dùng</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="subjectId"
                            {...field}
                          />
                          <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Quyền người dùng</FormLabel>
                      <div className={cn('text-black', form.formState.isSubmitting && 'hidden')}>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn một quyền cho người dùng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Admin</SelectItem>
                            <SelectItem value="2">Teacher</SelectItem>
                            <SelectItem value="3">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('roleId') === '3' && (
                  <FormField
                    control={form.control}
                    name="studentId"
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
                )} */}
              </div>
              <DialogFooter>
                <Button disabled={form.formState.isSubmitting} className="px-3 py-2" variant="primary" type="submit">
                  {form.formState.isSubmitting && (
                    <div className="mr-1 w-4 h-4 rounded-full border border-black border-solid animate-spin border-t-transparent"></div>
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
