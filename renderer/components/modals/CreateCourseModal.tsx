'use client';

import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Select } from 'react-select-virtualized';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { KEY_LOCALSTORAGE } from '@/utils';
import '@/styles/components/modals/create-class-modal.scss';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import courseService from '@/services/courseService';
import { API_URL } from '@/constants/endpoints';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';
import { ApiResponse, IUser } from '@/types';

const CreateCourseModal = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const { subjects } = useContext(CreateSubjectContext);
  const [user, setUser] = useState<IUser | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Tên lớp học là trường bắt buộc.',
    }),
    subjectId: z
      .object({
        label: z.string().min(1, {
          message: 'Mã học phần là trường bắt buộc.',
        }),
        value: z.string().min(1, {
          message: 'Mã học phần là trường bắt buộc.',
        }),
      })
      .refine((data) => data !== undefined, {
        message: 'Mã học phần không được để trống.',
      }),
    courseGroup: z
      .string()
      .min(1, { message: 'Nhóm môn học là trường bắt buộc.' })
      .refine(
        (value) => {
          const numValue = Number(value);
          return !isNaN(numValue) && numValue >= 0;
        },
        { message: 'Nhóm môn học phải là một số không âm.' },
      ),
    semester: z
      .string()
      .min(1, { message: 'Niên khóa là trường bắt buộc.' })
      .regex(new RegExp(`^HK[1-3] \\| ${currentYear} - ${nextYear}$`), {
        message: `Niên khóa phải có dạng "HK1 | ${currentYear} - ${nextYear}", "HK2 | ${currentYear} - ${nextYear}", hoặc "HK3 | ${currentYear} - ${nextYear}".`,
      }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subjectId: { label: '', value: '' },
      courseGroup: '',
      semester: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.name,
        subjectId: values.subjectId.value,
        lecturerId: user?.id,
        courseGroup: values.courseGroup,
        semester: values.semester,
      };
      const res = await courseService.createCourse(data as any);
      router.refresh();
      router.push(`${API_URL.COURSES}/${res.data.courseId}`);
      setOpenModal(false);
      form.reset();
      toast.success('Tạo lớp học thành công');
    } catch (error) {
      const axiousError = error as AxiosError;
      toast.error((axiousError.response?.data as ApiResponse<string>).message as string);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="mx-auto text-xl">
            {form.formState.isSubmitting ? 'Đang tạo lớp học ...' : 'Tạo lớp học mới'}
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
                    <FormLabel className="text-xs font-bold uppercase">Tên lớp học</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          id="className"
                          placeholder="Nhập tên lớp học ..."
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
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Học phần</FormLabel>
                    <FormControl>
                      <>
                        <Select
                          {...field}
                          className={cn(form.formState.isSubmitting && 'hidden')}
                          options={subjects?.map((s) => {
                            return {
                              label: `${s.name}`,
                              value: s.subjectId,
                            };
                          })}
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
                name="courseGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Nhóm môn học</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          placeholder="Nhập nhóm môn học ..."
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
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Niên khóa</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          placeholder="Nhập niên khóa ..."
                          {...field}
                        />
                        <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="!justify-between">
              <Button disabled={form.formState.isSubmitting} variant="primary" type="submit">
                {form.formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Tạo lớp học
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
