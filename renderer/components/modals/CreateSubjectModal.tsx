/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import subjectService from '@/services/subjectService';
import { ApiResponse, ISubject } from '@/types';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';

const CreateSubjectModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { subjects, setSubjects } = useContext(CreateSubjectContext);

  const FormSchema = z.object({
    subjectCode: z
      .string()
      .min(1, { message: 'Mã học phần là trường bắt buộc.' })
      .refine(
        (subjectCode) => {
          return !subjects.some((subject) => subject.subjectCode == subjectCode);
        },
        { message: 'Mã học phần đã tồn tại.' },
      ),
    subjectName: z.string().min(1, { message: 'Tên học phần là trường bắt buộc.' }),
    description: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subjectName: '',
      subjectCode: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    let res: ApiResponse<ISubject>;
    try {
      const data = {
        subjectId: '',
        description: values.description,
        subjectCode: values.subjectCode,
        name: values.subjectName,
      };

      res = await subjectService.createSubject(data);
      if (res.data) {
        setSubjects([...subjects, res.data]);
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      const axiousError = error as AxiosError;
      toast.error((axiousError.response?.data as ApiResponse<string>).message as string);
    }
  };
  const onClose = () => {
    form.reset();
    setIsOpen(!isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]" classOverlay="!z-50">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Tạo học phần mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Mã học phần</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          id="subjectCode"
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
                name="subjectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Tên học phần</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          id="subjectName"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Mô tả</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          id="description"
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
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} className="px-3 py-2" variant="primary" type="submit">
                {form.formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Tạo học phần
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubjectModal;
