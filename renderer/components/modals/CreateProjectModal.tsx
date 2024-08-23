/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

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
import projectService from '@/services/projectService';
import { ApiResponse, IProject } from '@/types';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';

const CreateProjectModal = ({
  isOpen,
  setIsOpen,
  setProjectCreated,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectCreated: React.Dispatch<React.SetStateAction<IProject | null>>;
}) => {
  const [submitError, setSubmitError] = useState(false);
  const { projects, setProjects } = useContext(CreateProjectContext);

  const FormSchema = z.object({
    title: z.string().min(1, { message: 'Tên đề tài là trường bắt buộc.' }),
    description: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    let res: ApiResponse<IProject>;
    try {
      res = await projectService.createProject(values);
      if (res.data) {
        setProjects([...projects, res.data]);
        setProjectCreated(res.data);
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error('Đã xảy ra lỗi');
      setSubmitError(true);
    }
  };
  const onClose = () => {
    form.reset();
    setIsOpen(!isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Tạo đề tài mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Tên đề tài</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
                          id="projectCode"
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

export default CreateProjectModal;
