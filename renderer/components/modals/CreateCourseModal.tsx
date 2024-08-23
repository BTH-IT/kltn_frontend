'use client';

import React, { useContext, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Select } from 'react-select-virtualized';

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

const CreateCourseModal = ({ children }: { children: React.ReactNode }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { subjects } = useContext(CreateSubjectContext);
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Tên lớp học là trường bắt buộc.',
    }),
    subjectId: z.object({
      label: z.string(),
      value: z.string().min(1, {
        message: 'Mã học phần là trường bắt buộc.',
      }),
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subjectId: { label: '', value: '' },
    },
  });

  const isLoading = hasSubmitted;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.name,
        subjectId: values.subjectId.value,
      };
      setHasSubmitted(true);
      const res = await courseService.createCourse(data as any);
      router.push(`${API_URL.COURSES}/${res.data.courseId}`);
      setHasSubmitted(false);
      setOpenModal(false);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="mx-auto text-xl">
            {hasSubmitted ? 'Đang tạo lớp học ...' : 'Tạo lớp học mới'}
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
                          disabled={isLoading}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            isLoading && 'hidden',
                          )}
                          id="className"
                          placeholder="Nhập tên lớp học ..."
                          {...field}
                        />
                        <Skeleton className={cn('h-10 w-full', !isLoading && 'hidden')} />
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
                          className={cn(isLoading && 'hidden')}
                          options={subjects?.map((s) => {
                            return {
                              label: `${s.name}`,
                              value: s.subjectId,
                            };
                          })}
                        />

                        <Skeleton className={cn('h-10 w-full', !isLoading && 'hidden')} />
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
