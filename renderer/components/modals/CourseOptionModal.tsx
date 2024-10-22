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
import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

import { Switch } from '../ui/switch';
import { DateTimePicker } from '../common/DatetimePicker';
import { Slider } from '../common/SliderRange';
import ScoreStructureForm from '../pages/courses/score/ScoreStructureForm';

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
  const [startCreateGroup, setStartCreateGroup] = useState<Date | null | undefined>(null);
  const [endCreateGroup, setEndCreateGroup] = useState<Date | null | undefined>(null);
  const { subjects } = useContext(CreateSubjectContext);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

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
    allowStudentCreateProject: z.boolean(),
    allowGroupRegistration: z.boolean(),
    groupSizeRange: z.array(z.number()).nullable(),
    hasFinalScore: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseGroup: '',
      subjectId: { label: '', value: '' },
      allowStudentCreateProject: false,
      allowGroupRegistration: false,
      groupSizeRange: [0, 10],
      hasFinalScore: false,
    },
  });

  const hasFinalScoreValue = form.watch('hasFinalScore');
  const allowGroupRegistration = form.watch('allowGroupRegistration');

  useEffect(() => {
    if (course && course.subjectId) {
      form.setValue('courseGroup', course.courseGroup);
      form.setValue('subjectId', {
        label: `${course.subject?.subjectCode} - ${course.subject?.name}`,
        value: course.subjectId,
      });

      setStartCreateGroup(new Date(course.settings?.startGroupCreation ?? ''));
      setEndCreateGroup(new Date(course.settings?.endGroupCreation ?? ''));

      form.setValue('allowStudentCreateProject', course.settings?.allowStudentCreateProject);
      form.setValue('groupSizeRange', [course.settings?.maxGroupSize || 0, course.settings?.minGroupSize || 10]);
      form.setValue('hasFinalScore', course.settings?.hasFinalScore || false);
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
                <div className="!my-0 overflow-auto w-full h-[92vh] grid grid-cols-12 gap-2 px-3">
                  <div className="col-span-6 p-5 my-8 border-2 rounded-lg">
                    <div className="mt-2 text-2xl font-medium">Thông tin chi tiết về lớp học</div>
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
                                      label: `${s.subjectCode} - ${s.name}`,
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
                        <ShowCodeModal invCode={course?.inviteCode || ''} courseName={course?.courseGroup || ''}>
                          <div className="flex items-center justify-center gap-2 px-3 py-1 font-semibold text-blue-500 rounded-md cursor-pointer hover:bg-blue-100/30 hover:text-blue-800">
                            <div className="text-sm mb-[2px]">Hiện mã lớp học</div>
                            <Scan width={20} height={20} />
                          </div>
                        </ShowCodeModal>
                      </div>
                      <FormField
                        control={form.control}
                        name="hasFinalScore"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between my-3">
                            <FormLabel className="font-medium text-md">Môn học có làm đồ án / tiểu luận</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allowGroupRegistration"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between my-3">
                            <FormLabel className="font-medium text-md">Cho phép nhóm đăng kí nhóm</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {hasFinalScoreValue && allowGroupRegistration && (
                        <div className="flex flex-col gap-4 px-3 mb-2">
                          <div className="font-medium">Thời hạn đăng kí</div>
                          <div className="flex items-center justify-between gap-2">
                            <DateTimePicker date={startCreateGroup} setDate={setStartCreateGroup} />
                            <DateTimePicker date={endCreateGroup} setDate={setEndCreateGroup} />
                          </div>
                        </div>
                      )}
                      {allowGroupRegistration && (
                        <div className="flex flex-col gap-4 px-3">
                          <div className="font-medium">Số lượng người tối thiểu / tối đa</div>

                          <FormField
                            control={form.control}
                            name="groupSizeRange"
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-2">
                                <Slider
                                  defaultValue={field.value}
                                  minStepsBetweenThumbs={1}
                                  max={15}
                                  min={0}
                                  step={1}
                                  onValueChange={field.onChange}
                                  className={cn('w-full')}
                                />
                                <div className="flex justify-between text-sm">
                                  <span>Tối thiểu: {field.value?.[0] || 0}</span>
                                  <span>Tối đa: {field.value?.[1] || 0}</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="allowStudentCreateProject"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between my-3">
                            <FormLabel className="font-medium text-md">Cho phép nhóm đăng kí đề tài</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="border-2 rounded-lg p-5 !my-8 col-span-6">
                    <div className="mt-2 text-2xl font-medium">Cài đặt thông tin khác</div>
                    <div className="grid gap-4 py-4">
                      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
                        {course?.lecturerId === user?.id && <ScoreStructureForm />}
                      </ScoreStructureProvider>
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
