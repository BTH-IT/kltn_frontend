'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import groupService from '@/services/groupService';
import { IAssignment } from '@/types';
import { IGroup } from '@/types/group';

export const CreateAssignmentGroupModal = ({
  isOpen,
  setIsOpen,
  assignment,
  minNumberOfMembers,
  maxNumberOfMembers,
  setGroups,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: IAssignment;
  minNumberOfMembers: number;
  maxNumberOfMembers: number;
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}) => {
  const params = useParams();

  const FormSchema = z.object({
    groupName: z.string().min(1, { message: 'Tên nhóm là trường bắt buộc.' }),
    numberOfMembers: z.coerce.number({
      invalid_type_error: 'Số lượng thành viên phải là số.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: '',
      numberOfMembers: minNumberOfMembers,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      if (values.numberOfMembers < minNumberOfMembers) {
        form.setError('numberOfMembers', {
          message: `Số lượng thành viên phải lớn hơn hoặc bằng ${minNumberOfMembers}.`,
        });
        return;
      }

      if (values.numberOfMembers > maxNumberOfMembers) {
        form.setError('numberOfMembers', {
          message: `Số lượng thành viên phải nhỏ hơn hoặc bằng ${maxNumberOfMembers}.`,
        });
        return;
      }

      const res = await groupService.createGroup({
        ...values,
        courseId: params.courseId as string,
        assignmentId: assignment.assignmentId,
      });
      if (res.data) {
        setGroups((prev) => [...prev, res.data]);
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Tạo nhóm mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Tên nhóm</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="groupName"
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
                  name="numberOfMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Số lượng</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="numberOfMembers"
                            type="number"
                            min={0}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
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
                  Tạo nhóm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
