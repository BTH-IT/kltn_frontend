/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContent2,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import userService from '@/services/userService';
import { IUser } from '@/types';

const ChangeStudentIdModal = ({ user, isOpen }: { user: IUser; isOpen: boolean }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        const res = await userService.getUsers();
        setUsers(res.data);
      };
      fetchUsers();
    }
  }, [user]);

  const FormSchema = z.object({
    studentId: z
      .string()
      .min(1, {
        message: 'Mã số sinh viên là trường bắt buộc',
      })
      .refine(
        (studentId) => {
          return !users.some((user) => user.studentId === studentId);
        },
        { message: 'Mã số sinh viên đã tồn tại' },
      ),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const newUser = { ...user, studentId: values.studentId };
      const res = await userService.updateUser(user.userId, newUser);
      if (res) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setSubmitError(true);
      setHasSubmitted(false);
    }
  };

  const onClose = () => {
    form.reset();
    router.push('/');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent2
          className="sm:max-w-[400px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="mx-auto text-xl">
              {hasSubmitted ? 'Đang xử lý ...' : 'Điền mã số sinh viên'}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-2" onClick={() => onClose()}>
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Mã số sinh viên</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'text-2xl h-16 focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="studentId"
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
              <DialogFooter className="gap-3">
                <Button
                  disabled={form.formState.isSubmitting}
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Hủy
                </Button>
                <Button disabled={form.formState.isSubmitting} variant="primary" type="submit">
                  {form.formState.isSubmitting && (
                    <div className="mr-1 w-4 h-4 rounded-full border border-black border-solid animate-spin border-t-transparent"></div>
                  )}
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent2>
      </Dialog>
      <Dialog open={submitError} onOpenChange={setSubmitError}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Đã xảy ra lỗi</DialogTitle>
            <DialogDescription className="pt-2 text-black">
              Không thể lưu mã số sinh viên. Hãy kiểm tra mã số hoặc thử lại sau.
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

export default ChangeStudentIdModal;
