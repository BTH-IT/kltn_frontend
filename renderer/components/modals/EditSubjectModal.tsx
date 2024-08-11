/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import subjectService from '@/services/subjectService';
import { ISubject } from '@/types';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';

const EditSubjectModal = ({
  isOpen,
  setIsOpen,
  subject,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subject: ISubject;
}) => {
  const [submitError, setSubmitError] = useState(false);
  const { subjects, setSubjects } = useContext(CreateSubjectContext);

  const router = useRouter();

  const FormSchema = z.object({
    subjectName: z.string().min(1, { message: 'Tên học phần là trường bắt buộc.' }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subjectName: '',
    },
  });

  useEffect(() => {
    if (subject) {
      form.setValue('subjectName', String(subject.name));
    }
  }, [subject, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.subjectName,
      };

      const res = await subjectService.updateSubject(subject.subjectId, data);
      if (res.data) {
        setSubjects([...subjects, res.data]);
        router.refresh();
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
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
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Chỉnh sửa học phần'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
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
              Không thể chỉnh sửa học phần. Vui lòng kiểm tra thông tin hoặc thử lại sau.
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

export default EditSubjectModal;
