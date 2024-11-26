/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import semesterService from '@/services/semesterService';
import { ApiResponse } from '@/types';
import { CreateSemesterContext } from '@/contexts/CreateSemesterContext';
import { ISemester } from '@/types/semester';

const EditSemesterModal = ({
  isOpen,
  setIsOpen,
  semester,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  semester: ISemester;
}) => {
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessages] = useState('');
  const { semesters, setSemesters } = useContext(CreateSemesterContext);
  const router = useRouter();

  const FormSchema = z
    .object({
      name: z
        .string()
        .min(1, { message: 'Tên học kì là trường bắt buộc.' })
        .refine(
          (name) => {
            return !semesters.some((semester) => semester.name == name);
          },
          { message: 'Tên học kì đã tồn tại.' },
        ),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .refine(
      (ctx) => {
        return ctx.endDate > ctx.startDate;
      },
      {
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
        path: ['endDate'],
      },
    );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  useEffect(() => {
    if (semester) {
      form.setValue('name', String(semester.name));
      form.setValue('startDate', semester.startDate);
      form.setValue('endDate', semester.endDate);
    }
  }, [semester, form, isOpen]);
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    let res: ApiResponse<ISemester>;
    try {
      const data = {
        semesterId: '',
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
      };

      res = await semesterService.createSemester(data);
      if (res.data) {
        const updatedSemesters = semesters.map((semester) => {
          return semester.semesterId == res.data.semesterId ? res.data : semester;
        });
        setSemesters(updatedSemesters);
        form.reset();
        setIsOpen(false);
      }
      form.reset();
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const axiousError = error as AxiosError;
      setErrorMessages((axiousError.response?.data as ApiResponse<string>).message as string);
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
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Tạo học kì mới'}
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
                      <FormLabel className="text-xs font-bold uppercase">Tên học kì</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="name"
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="date"
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="startDate"
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Ngày kết thúc</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="date"
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="endDate"
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                          />
                          <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                        </>
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
                  Tạo học kì
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
            <DialogDescription className="pt-2 text-black">{errorMessage}</DialogDescription>
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

export default EditSemesterModal;
