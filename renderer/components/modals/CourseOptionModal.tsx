/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Scan, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Select } from 'react-select-virtualized';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { CoursesContext } from '@/contexts/CoursesContext';
import { cn } from '@/libs/utils';
import courseService from '@/services/courseService';
import { CourseContext } from '@/contexts/CourseContext';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';

import ShowCodeModal from './ShowCodeModal';

const CourseOptionModal = ({
  onOpenModal,
  setOnOpenModal,
}: {
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { course } = useContext(CourseContext);

  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { createdCourses, setCreatedCourses } = useContext(CoursesContext);
  const { subjects } = useContext(CreateSubjectContext);

  const FormSchema = z.object({
    courseGroup: z.string().min(1, {
      message: 'Tên lớp học là trường bắt buộc.',
    }),
    subjectId: z
      .object({
        label: z.string(),
        value: z.string().min(1, {
          message: 'Mã học phần là trường bắt buộc.',
        }),
      })
      .refine((subjectId) => subjects.find((subject) => subject.subjectId === subjectId.value), {
        message: 'Mã học phần không hợp lệ.',
      }),
    enableInvite: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseGroup: '',
      subjectId: { label: '', value: '' },
      enableInvite: 'true',
    },
  });

  useEffect(() => {
    if (course && course.subjectId) {
      form.setValue('courseGroup', course.courseGroup);
      form.setValue('subjectId', {
        label: `${course.subject?.subjectCode} - ${course.subject?.name}`,
        value: course.subjectId,
      });
      form.setValue('enableInvite', String(course.enableInvite));
    }
  }, [course, onOpenModal, form]);

  const isLoading = hasSubmitted;

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      setHasSubmitted(true);

      const data = {
        ...course,
        courseGroup: values.courseGroup,
        subjectId: values.subjectId.value,
        enableInvite: values.enableInvite === 'true',
      };

      const res = await courseService.updateCourse(course.courseId, data);

      createdCourses.forEach((c, index) => {
        if (c.courseId === course.courseId) {
          createdCourses[index] = res.data;
          setCreatedCourses([...createdCourses]);
          return;
        }
      });

      if (res.data) {
        toast({
          title: 'Cập nhật thông tin lớp học thành công',
          variant: 'done',
          duration: 2000,
        });

        router.refresh();
      }

      setHasSubmitted(false);
      setCanSubmit(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Có lỗi khi cập nhật thông tin lớp học',
        variant: 'destructive',
        duration: 2000,
      });
      setHasSubmitted(false);
    }
  };

  const onChangeForm = () => {
    setCanSubmit(true);
  };

  const onCloseModal = () => {
    form.reset();
    setOnOpenModal(false);
  };

  const handleCopyInvLinkClick = async () => {
    if (!course) return;

    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/courses/invite/${course.inviteCode}`);
      toast({
        title: 'Đã sao chép link mời tham gia lớp',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <Dialog open={onOpenModal} onOpenChange={onCloseModal}>
        <DialogContent2 className="w-screen h-screen max-h-screen p-0 font-sans text-gray-700">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex justify-center">
            <Form {...form}>
              <form
                onChange={() => onChangeForm()}
                onSubmit={form.handleSubmit(onSubmit)}
                className="items-center w-full space-y-8 h-fit"
              >
                <div className="sticky top-0 left-0 right-0 flex items-center justify-between w-full px-5 py-3 bg-white border-b-2">
                  <div className="font-semibold text-md">Cài đặt lớp học</div>
                  <div className="flex items-center gap-7">
                    <Button type="submit" disabled={!canSubmit || hasSubmitted} className="w-20" variant="primary">
                      {hasSubmitted && (
                        <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                      )}
                      Lưu
                    </Button>
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                </div>
                <div className="!my-0 overflow-auto w-full h-[92vh]">
                  <div className="my-8 mx-auto border-2 rounded-lg p-5 w-[700px]">
                    <div className="mt-2 mb-6 text-4xl font-medium">Thông tin chi tiết về lớp học</div>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="courseGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Tên lớp học</FormLabel>
                            <FormControl>
                              <>
                                <Input
                                  disabled={isLoading}
                                  className={cn(
                                    'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                                    isLoading && 'hidden',
                                  )}
                                  id="className"
                                  placeholder="Nhập tên lớp học ..."
                                  {...field}
                                />
                                <Skeleton className={cn('h-10 w-full', !isLoading && 'hidden')} />
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Học phần</FormLabel>
                            <FormControl>
                              <>
                                <Select
                                  {...field}
                                  options={subjects?.map((s) => {
                                    return {
                                      label: `${s.subjectId} - ${s.name}`,
                                      value: s.subjectId,
                                    };
                                  })}
                                />

                                <Skeleton className={cn('h-10 w-full', !isLoading && 'hidden')} />
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mx-auto border-2 rounded-lg p-5 !my-8 w-[700px]">
                    <div className="mt-2 mb-10 text-4xl font-medium">Cài đặt chung</div>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Đường liên kết mời</div>
                        <div className="flex items-center gap-1">
                          <div className="text-sm">{`${process.env.NEXT_PUBLIC_URL}/courses/invite/${course?.inviteCode}`}</div>
                          <div
                            onClick={() => handleCopyInvLinkClick()}
                            className="flex items-center justify-center w-12 h-12 p-0 rounded-full cursor-pointer hover:bg-gray-100/60"
                          >
                            <Copy width={20} height={20} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Mã lớp</div>
                        <div className="pr-4">{course?.inviteCode}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Chế độ xem lớp học</div>
                        <ShowCodeModal invCode={course?.inviteCode || ''} courseName={course?.courseGroup || ''}>
                          <div className="flex items-center justify-center gap-2 px-3 py-1 font-semibold text-blue-500 rounded-md cursor-pointer hover:bg-blue-100/30 hover:text-blue-800">
                            <div className="text-sm mb-[2px]">Hiện mã lớp học</div>
                            <Scan width={20} height={20} />
                          </div>
                        </ShowCodeModal>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent2>
      </Dialog>
    </>
  );
};

export default CourseOptionModal;
