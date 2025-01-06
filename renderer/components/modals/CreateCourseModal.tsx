/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
'use client';

import React, { use, useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Select } from 'react-select-virtualized';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

import { KEY_LOCALSTORAGE } from '@/utils';
import '@/styles/components/modals/create-class-modal.scss';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import courseService from '@/services/courseService';
import { API_URL } from '@/constants/endpoints';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';
import { ApiResponse, IUser } from '@/types';
import { CoursesContext } from '@/contexts/CoursesContext';

import CreateSubjectModal from './CreateSubjectModal';

const CreateCourseModal = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const { subjects } = useContext(CreateSubjectContext);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCreatedCourses, createdCourses } = useContext(CoursesContext);
  const [isSourceCourse, setIsSourceCourse] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Tên lớp học là trường bắt buộc.',
    }),
    subjectId: z
      .object({ label: z.string(), value: z.string() })
      .refine((data) => (data && data.label && data.value) || isSourceCourse, {
        message: 'Mã học phần là bắt buộc',
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
    semester: z
      .string()
      .min(1, { message: 'Niên khóa là trường bắt buộc.' })
      .regex(new RegExp(`^HK[1-3] \\| ${currentYear} - ${nextYear}$`), {
        message: `Niên khóa phải có dạng "HK1 | ${currentYear} - ${nextYear}", "HK2 | ${currentYear} - ${nextYear}", hoặc "HK3 | ${currentYear} - ${nextYear}".`,
      }),
    sourceCourseId: z.object({ label: z.string(), value: z.string() }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subjectId: { label: '', value: '' },
      courseGroup: '',
      semester: '',
      sourceCourseId: { label: '', value: '' },
    },
  });

  const sourceCourseId = form.watch('sourceCourseId');

  useEffect(() => {
    setIsSourceCourse(!!sourceCourseId?.value);
  }, [sourceCourseId]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.sourceCourseId.value) {
      try {
        const data = {
          name: values.name,
          sourceCourseId: values.sourceCourseId.value,
          semester: values.semester,
          courseGroup: values.courseGroup,
        };
        const res = await courseService.createTemplateCourse(data);
        router.refresh();
        router.push(`${API_URL.COURSES}/${res.data.courseId}`);
        setCreatedCourses([...createdCourses, res.data]);
        setOpenModal(false);
        form.reset();
        toast.success('Sao chép lớp học thành công');
      } catch (error) {
        const axiousError = error as AxiosError;
        toast.error((axiousError.response?.data as ApiResponse<string>).message as string);
      }
      return;
    }

    try {
      const data = {
        name: values.name,
        subjectId: values.subjectId.value,
        lecturerId: user?.id,
        courseGroup: values.courseGroup,
        semester: values.semester,
      };
      const res = await courseService.createCourse(data as any);
      router.refresh();
      router.push(`${API_URL.COURSES}/${res.data.courseId}`);
      setCreatedCourses([...createdCourses, res.data]);
      setOpenModal(false);
      form.reset();
      toast.success('Tạo lớp học thành công');
    } catch (error) {
      const axiousError = error as AxiosError;
      toast.error((axiousError.response?.data as ApiResponse<string>).message as string);
    }
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="mx-auto text-xl">
              {form.formState.isSubmitting ? 'Đang tạo lớp học ...' : 'Tạo lớp học mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="className"
                            placeholder="Nhập tên lớp học ..."
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
                  name="sourceCourseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">
                        Sao chép nội dung từ lớp học đã tạo (Không bắt buộc)
                      </FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          options={createdCourses.map((course) => ({
                            label: course.name,
                            value: course.courseId,
                          }))}
                          isDisabled={form.formState.isSubmitting}
                          placeholder="Chọn lớp học nguồn ..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!sourceCourseId?.value && (
                  <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs font-bold uppercase">Học phần</FormLabel>
                        <div className="flex items-center gap-1">
                          <FormControl className="flex-1 w-full">
                            <div className="w-full">
                              <Select
                                {...field}
                                isDisabled={form.formState.isSubmitting}
                                options={subjects?.map((s) => {
                                  return {
                                    label: `${s.name}`,
                                    value: s.subjectId,
                                  };
                                })}
                              />
                              <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                            </div>
                          </FormControl>
                          <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)} type="button">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="courseGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Nhóm môn học</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            placeholder="Nhập nhóm môn học ..."
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
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Niên khóa</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            placeholder="Nhập niên khóa ..."
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
              <DialogFooter className="!justify-between">
                <Button disabled={form.formState.isSubmitting} variant="primary" type="submit">
                  {form.formState.isSubmitting && (
                    <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                  )}
                  Tạo lớp học
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <CreateSubjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default CreateCourseModal;
