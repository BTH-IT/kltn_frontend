/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Scan, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Select } from 'react-select-virtualized';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseContext } from '@/contexts/CourseContext';
import { CoursesContext } from '@/contexts/CoursesContext';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';
import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { cn, logError } from '@/libs/utils';
import courseService from '@/services/courseService';

import { DateTimePicker } from '../common/DatetimePicker';
import ScoreStructureForm from '../pages/courses/score/ScoreStructureForm';
import { Switch } from '../ui/switch';

import ShowCodeModal from './ShowCodeModal';

const CourseOptionModal = ({
  onOpenModal,
  setOnOpenModal,
}: {
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { course, setCourse } = useContext(CourseContext);

  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { createdCourses, setCreatedCourses } = useContext(CoursesContext);
  const [dueDateToJoinGroup, setDueDateToJoinGroup] = useState<Date | null | undefined>(null);
  const { subjects } = useContext(CreateSubjectContext);

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Tên lớp học là trường bắt buộc.',
    }),
    courseGroup: z
      .string()
      .min(1, { message: 'Nhóm môn học là trường bắt buộc.' })
      .refine(
        (value) => {
          const numValue = Number(value);
          return !isNaN(numValue) && numValue >= 0;
        },
        { message: 'Nhóm môn học phải là một số không âm.' },
      ),
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
    groupSizeRange: z.array(z.number()).nullable(),
    hasFinalScore: z.boolean(),
    enableInvite: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      courseGroup: '',
      subjectId: { label: '', value: '' },
      allowStudentCreateProject: false,
      enableInvite: false,
      groupSizeRange: [0, 10],
      hasFinalScore: false,
    },
  });

  const hasFinalScoreValue = form.watch('hasFinalScore');
  const enableInvite = form.watch('enableInvite');

  useEffect(() => {
    if (course && course.subjectId) {
      form.setValue('name', course.name);
      form.setValue('courseGroup', course.courseGroup);
      form.setValue('subjectId', {
        label: `${course.subject?.subjectCode} - ${course.subject?.name}`,
        value: course.subjectId,
      });

      form.setValue('enableInvite', course.enableInvite);
      form.setValue('allowStudentCreateProject', course.setting?.allowStudentCreateProject);
      form.setValue('groupSizeRange', [course.setting?.minGroupSize || 1, course.setting?.maxGroupSize || 15]);
      form.setValue('hasFinalScore', course.setting?.hasFinalScore);

      setDueDateToJoinGroup(course.setting?.dueDateToJoinGroup);
    }
  }, [course, form, onOpenModal]);

  const isLoading = hasSubmitted;

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      setHasSubmitted(true);

      const infoData = {
        ...course,
        name: values.name,
        courseGroup: values.courseGroup,
        subjectId: values.subjectId.value,
        enableInvite: values.enableInvite,
      };

      const settingData = {
        settingId: course.setting?.settingId,
        courseId: course.courseId,
        dueDateToJoinGroup: dueDateToJoinGroup,
        allowStudentCreateProject: values.allowStudentCreateProject,
        minGroupSize: values.groupSizeRange?.[0],
        maxGroupSize: values.groupSizeRange?.[1],
        hasFinalScore: values.hasFinalScore,
      };

      const [infoRes, settingRes] = await Promise.all([
        courseService.updateCourse(course.courseId, infoData),
        courseService.changeSetting(course.courseId, settingData),
      ]);

      createdCourses.forEach((c, index) => {
        if (c.courseId === course.courseId) {
          createdCourses[index] = infoRes.data;
          setCreatedCourses([...createdCourses]);
          return;
        }
      });

      if (infoRes.data && settingRes.data) {
        toast.success('Cập nhật lớp học thành công');

        setCourse({
          ...course,
          setting: settingRes.data,
        });
      }

      setHasSubmitted(false);
      setCanSubmit(false);
    } catch (error) {
      logError(error);
      setHasSubmitted(false);
    }
  };

  const onChangeForm = () => {
    setCanSubmit(true);
  };

  const onCloseModal = () => {
    form.reset();
    router.refresh();
    setOnOpenModal(false);
  };

  const handleCopyInvLinkClick = async () => {
    if (!course) return;

    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/courses/invite/${course.inviteCode}`);
      toast.success('Đã sao chép đường liên kết mời');
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
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                </div>
                <div className="!my-0 overflow-auto w-full h-[92vh] grid grid-cols-12 gap-2 px-3">
                  <div className="col-span-12 p-5 border-2 rounded-lg xl:col-span-6">
                    <div className="mt-2 text-2xl font-medium">Thông tin chi tiết về lớp học</div>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="name"
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
                        name="courseGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Nhóm môn học</FormLabel>
                            <FormControl>
                              <>
                                <Input
                                  disabled={isLoading}
                                  className={cn(
                                    'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                                    isLoading && 'hidden',
                                  )}
                                  placeholder="Nhập nhóm môn học ..."
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
                      <FormField
                        control={form.control}
                        name="enableInvite"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between my-3">
                              <FormLabel className="font-medium text-md">
                                Cho phép thành viên tham gia bằng mã mời
                              </FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {enableInvite && (
                        <>
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
                        </>
                      )}
                      <FormField
                        control={form.control}
                        name="hasFinalScore"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between my-3">
                              <FormLabel className="font-medium text-md">Môn học có làm đồ án / tiểu luận</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {hasFinalScoreValue && (
                        <div className="flex flex-col gap-4 px-3 mb-2">
                          <div className="font-medium">Thời hạn cho phép tham gia vào nhóm</div>
                          <DateTimePicker
                            date={
                              typeof dueDateToJoinGroup === 'string' ? new Date(dueDateToJoinGroup) : dueDateToJoinGroup
                            }
                            setDate={setDueDateToJoinGroup}
                            onChange={() => {
                              setCanSubmit(true);
                            }}
                          />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="allowStudentCreateProject"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between my-3">
                              <FormLabel className="font-medium text-md">Cho phép nhóm đăng kí đồ án</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end w-full mt-4">
                        <Button type="submit" disabled={!canSubmit || hasSubmitted} className="w-20" variant="primary">
                          {hasSubmitted && (
                            <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                          )}
                          Lưu
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 p-5 border-2 rounded-lg xl:col-span-6">
                    <div className="mt-2 text-2xl font-medium">Cài đặt thông tin khác</div>
                    <div className="grid gap-4 py-4">
                      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
                        <ScoreStructureForm />
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
