'use client';

import React, { useContext, useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import courseService from '@/services/courseService';
import { CoursesContext } from '@/contexts/CoursesContext';

const JoinClassModal = ({ children }: { children: React.ReactNode }) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { enrolledCourses, setenrolledCourses } = useContext(CoursesContext);
  const router = useRouter();
  const user = null;

  const FormSchema = z.object({
    inviteCode: z.string().refine((inviteCode) => inviteCode.length === 7, {
      message: 'Mã lớp phải là một chuổi 7 ký tự.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inviteCode: '',
    },
  });

  const inputChangeHandler = (value: string) => {
    if (value.length === 7) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const isLoading = hasSubmitted;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setHasSubmitted(true);
      const res = await courseService.getClassByInviteCode(values.inviteCode.toLowerCase());
      if (res.data?.classId && user?.id) {
        await classService.addStudentToClass(String(res.data.classId), user.id);
        setenrolledCourses([...enrolledCourses, res.data]);
        router.push(`/course/${res.data.classId}`);

        setHasSubmitted(false);
      } else {
        setSubmitError(true);
        setHasSubmitted(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitError(true);
      setHasSubmitted(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="mx-auto text-xl">
              {hasSubmitted ? 'Đang xử lý ...' : 'Tham gia lớp học'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Mã lớp</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={isLoading}
                            className={cn(
                              'text-2xl h-16 focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              isLoading && 'hidden',
                            )}
                            onChangeCapture={(event) => {
                              inputChangeHandler(event.currentTarget.value);
                            }}
                            id="className"
                            {...field}
                          />
                          <Skeleton className={cn('h-10 w-full', !isLoading && 'hidden')} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  disabled={!canSubmit}
                  className={cn('w-20', isLoading && 'hidden')}
                  variant="primary"
                  type="submit"
                >
                  Tham gia
                </Button>
                <Skeleton className={cn('h-10 w-20', !isLoading && 'hidden')} />
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
              Không thể tham gia lớp học. Hãy kiểm tra mã lớp và tài khoản rồi thử lại.
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

export default JoinClassModal;
