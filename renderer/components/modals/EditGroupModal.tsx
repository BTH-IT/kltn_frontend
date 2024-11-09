'use client';

import React, { useContext, useEffect } from 'react';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select as ReactSelect } from 'react-select-virtualized';

import groupService from '@/services/groupService';
import { IGroup } from '@/types/group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { useGroupContext } from '@/contexts/GroupContext';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';

export const EditGroupModal = ({
  isOpen,
  setIsOpen,
  group,
  minNumberOfMembers,
  maxNumberOfMembers,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: IGroup;
  minNumberOfMembers: number;
  maxNumberOfMembers: number;
}) => {
  const { groups, setGroups } = useGroupContext();

  const params = useParams();
  const { projects } = useContext(CreateProjectContext);

  const FormSchema = z.object({
    groupName: z.string().min(1, { message: 'Tên nhóm là trường bắt buộc.' }),
    numberOfMembers: z.coerce.number({
      invalid_type_error: 'Số lượng thành viên phải là số.',
    }),
    projectId: z
      .object({
        label: z.string(),
        value: z.string().min(1, {
          message: 'đồ án là trường bắt buộc.',
        }),
      })
      .refine((projectId) => projects.find((project) => project.projectId === projectId.value), {
        message: 'đồ án không hợp lệ.',
      }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: '',
      numberOfMembers: minNumberOfMembers,
      projectId: { label: '', value: '' },
    },
  });

  useEffect(() => {
    if (group) {
      form.setValue('groupName', String(group.groupName));
      form.setValue('numberOfMembers', group.numberOfMembers);
      form.setValue('projectId', {
        label: group.project?.title || '',
        value: group.projectId || '',
      });
    }
  }, [group, isOpen]);

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

      const res = await groupService.updateGroup(group.groupId, {
        ...values,
        projectId: values.projectId.value,
        courseId: params.courseId as string,
      });
      if (res.data) {
        var updatedGroups = groups.map((item) => (item.groupId == group.groupId ? res.data : item));
        setGroups(updatedGroups);
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
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Chỉnh sửa nhóm'}
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
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">đồ án</FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...field}
                          options={projects?.map((p) => {
                            return {
                              label: p.title,
                              value: p.projectId,
                            };
                          })}
                        />
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
                  Chỉnh sửa nhóm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
