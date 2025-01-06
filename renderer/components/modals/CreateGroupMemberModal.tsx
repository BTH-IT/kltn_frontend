'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import MultiSelectPeople from '@/components/common/MultiSelectPeople';
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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import groupService from '@/services/groupService';
import { IGroup, IGroupMember } from '@/types';
import assignmentService from '@/services/assignmentService';

const CreateGroupMemberModal = ({
  isOpen,
  setIsOpen,
  group,
  setMembers,
  assignmentId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  group: IGroup;
  setMembers: Dispatch<SetStateAction<IGroupMember[]>>;
  assignmentId: string;
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const router = useRouter();

  const FormSchema = z.object({
    student: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .nullable(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      student: null,
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      if (!assignmentId) return;

      try {
        const res = await assignmentService.getStudentsWithoutGroup(assignmentId);
        if (res.data) {
          setStudents(
            res.data.map((s) => {
              return {
                label: `${s.fullName || s.userName}`,
                value: s.email,
              };
            }),
          );
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || error.message);
        }
      }
    };

    fetchStudents();
  }, [assignmentId]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      if (!values.student) {
        form.setError('student', { message: 'Vui lòng chọn thành viên' });
        return;
      }
      const data = {
        emails: values.student.map((s) => s.value),
      };
      const res = await groupService.addMember(group.groupId, data);
      if (res.data) {
        toast.success('Thêm thành viên thành công');
        const sortedGroupMembers = [...res.data].sort((a) => (a.isLeader ? -1 : 1));
        setMembers(sortedGroupMembers);
        router.refresh();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const onClose = () => {
    form.reset();
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên mới</DialogTitle>
          <DialogDescription>Điền thông tin thành viên mới ở đây.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Tên thành viên</FormLabel>
                    <FormControl>
                      <>
                        <MultiSelectPeople
                          isDisabled={form.formState.isSubmitting}
                          options={students}
                          onChange={field.onChange}
                          value={field.value}
                          isSelectAll={true}
                          menuPlacement={'bottom'}
                          className={cn(form.formState.isSubmitting && 'hidden')}
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
              <Button disabled={form.formState.isSubmitting} variant="primary" type="submit">
                {form.formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Thêm thành viên
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupMemberModal;
