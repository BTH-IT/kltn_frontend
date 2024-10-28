/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { IProject } from '@/types';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';
import projectService from '@/services/projectService';

const EditprojectModal = ({
  isOpen,
  setIsOpen,
  project,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: IProject;
}) => {
  const { projects, setProjects } = useContext(CreateProjectContext);

  const router = useRouter();

  const FormSchema = z.object({
    title: z.string().min(1, { message: 'Tên đồ án là trường bắt buộc.' }),
    description: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (project) {
      form.setValue('title', String(project.title));
      form.setValue('description', String(project.description));
    }
  }, [project, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const res = await projectService.updateProject(project.projectId, values);
      if (res.data) {
        const updatedprojects = projects.map((sub) => {
          return sub.projectId == res.data.projectId ? res.data : sub;
        });
        setProjects(updatedprojects);
        router.refresh();
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onClose = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Chỉnh sửa đồ án'}
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
                    <FormLabel className="text-xs font-bold uppercase">Tên đồ án</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                            form.formState.isSubmitting && 'hidden',
                          )}
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
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditprojectModal;
