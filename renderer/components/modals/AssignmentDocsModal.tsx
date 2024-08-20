/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookText, X } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CourseContext } from '@/contexts/CourseContext';
import { CoursesContext } from '@/contexts/CoursesContext';
import assignmentService from '@/services/assignmentService';
import uploadService from '@/services/uploadService';
import { IAssignment, ICourse, MetaLinkData } from '@/types';
import { cn } from '@/libs/utils';

import { DateTimePicker } from '../common/DatetimePicker';
import MultiSelectClassroom from '../common/MultiSelectClassroom';
import MultiSelectPeople, { Option } from '../common/MultiSelectPeople';
import AssignmentForm from '../forms/AssignmentForm';

const AssignmentDocsModal = ({
  course,
  onOpenModal,
  setOnOpenModal,
  setAssignments,
}: {
  course: ICourse | null;
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignments: React.Dispatch<React.SetStateAction<IAssignment[]>>;
}) => {
  const { toast } = useToast();

  const { createdCourses } = useContext(CoursesContext);

  const [canSubmit, setCanSubmit] = useState(false);
  const [studentSelected, setStudentSelected] = useState<Option[] | null>(null);
  const [classOptionSelected, setClassOptionSelected] = useState<Option[] | null>();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (course) {
      setClassOptionSelected([
        {
          label: course?.name ?? '',
          value: course?.classId ?? '',
          default: true,
        },
      ]);
    }
  }, [course]);

  const [links, setLinks] = useState<MetaLinkData[]>([]);

  const studentHandleChange = useCallback((selected: Option[]) => {
    setStudentSelected(selected);
  }, []);

  const classHandleChange = useCallback(
    (selected: Option[]) => {
      if (!selected.some((opt) => opt.default === true)) {
        setClassOptionSelected([
          {
            label: course?.name ?? '',
            value: course?.classId ?? '',
            default: true,
          },
          ...selected,
        ]);
      } else setClassOptionSelected(selected);
      if (selected.length > 1) {
        setStudentSelected(null);
      }
    },
    [course],
  );

  const generateStudentOptions = useCallback(() => {
    return course?.students.map((student) => {
      return {
        image: student.avatarUrl,
        value: student.userId,
        label: student.name,
      };
    });
  }, [course]);

  const generateClassOptions = useCallback(() => {
    return createdCourses
      ?.map((c) => {
        return {
          label: c.name,
          value: c.classId,
          default: c.classId === course?.classId,
        };
      })
      .sort((a, b) => {
        if (a.default) return -1;
        if (b.default) return 1;
        return 0;
      });
  }, [createdCourses, course]);

  const FormSchema = z.object({
    title: z.string().min(1, {
      message: 'Tiêu đề không hợp lệ',
    }),
    content: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const resetForm = () => {
    form.reset();
    setCanSubmit(false);
    setStudentSelected([]);
    setFiles([]);
    setLinks([]);
  };

  const submitForm = async (values: z.infer<typeof FormSchema>, classId: string) => {
    const resAttachments = files.length > 0 ? await uploadService.uploadMultipleFileWithAWS3(files) : [];

    const studentAssigned = studentSelected?.map((student) => {
      return student.value.toString();
    }) ?? ['all'];

    const data = {
      classId,
      title: values.title,
      content: values.content,
      attachedLinks: JSON.stringify(links),
      attachments: JSON.stringify(resAttachments),
      studentAssigned,
    };

    return await assignmentService.createAssignment(data);
  };

  const createAssignment = async (values: z.infer<typeof FormSchema>, classId: string) => {
    try {
      const response = await submitForm(values, classId);
      return response.data;
    } catch (error) {
      console.error(`Error creating assignment for class ${classId}:`, error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      const mainClassId = course.classId;
      let assignmentCount = 0;

      const createAssignmentsForcourse = async () => {
        const classIds = classOptionSelected?.map((opt) => opt.value.toString()) || [];
        const uniqueClassIds = new Set([mainClassId, ...classIds]);

        await Promise.all(
          Array.from(uniqueClassIds).map(async (classId) => {
            const data = await createAssignment(values, classId);
            if (data) {
              assignmentCount++;
              if (classId === mainClassId) {
                setAssignments((prevAssignments) => [data, ...prevAssignments]);
              }
            }
          }),
        );
      };

      await createAssignmentsForcourse();

      toast({
        title: `Đã đăng (${assignmentCount}) tài liệu thành công`,
        variant: 'done',
        duration: 2000,
      });

      resetForm();
      setOnOpenModal(false);
      setCanSubmit(false);
    } catch (error) {
      console.error('Error creating assignments:', error);
      toast({
        title: 'Có lỗi khi đăng tài liệu',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const onCloseModal = () => {
    resetForm();
    setOnOpenModal(false);
  };

  const isTitleEmpty = form.getValues('title').length === 0;
  const isClassOptionInvalid = !(
    classOptionSelected &&
    (classOptionSelected.length > 1 || (studentSelected && studentSelected.length > 1))
  );

  const isFormSubmitting = form.formState.isSubmitting;

  const isDisabled = isTitleEmpty || isClassOptionInvalid || isFormSubmitting;

  return (
    <>
      <Dialog open={onOpenModal} onOpenChange={onCloseModal}>
        <DialogContent2 className="p-0 w-screen h-screen max-h-screen font-sans text-gray-700">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex justify-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="items-center space-y-8 w-full h-fit">
                <div className="flex sticky top-0 right-0 left-0 justify-between items-center px-5 py-3 w-full bg-white border-b-2">
                  <div className="flex gap-3 items-center font-semibold text-md">
                    <BookText />
                    Tài liệu
                  </div>
                  <div className="flex gap-7 items-center">
                    <Button type="submit" disabled={isDisabled} className="w-20" variant="primary">
                      {form.formState.isSubmitting && (
                        <div className="mr-1 w-4 h-4 rounded-full border border-black border-solid animate-spin border-t-transparent"></div>
                      )}
                      Tạo
                    </Button>
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                </div>
                <div className="!my-0 overflow-auto w-full h-[92vh]">
                  <div className="grid grid-cols-12 h-full">
                    <div className="col-span-9 bg-[#F8F9FA]">
                      <AssignmentForm form={form} files={files} setFiles={setFiles} links={links} setLinks={setLinks} />
                    </div>
                    <div className="flex flex-col col-span-3 gap-5 p-5 border-l">
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Đăng trong</div>
                        <MultiSelectClassroom
                          options={generateClassOptions()}
                          onChange={classHandleChange}
                          value={classOptionSelected}
                          isSelectAll={true}
                          menuPlacement={'bottom'}
                          className="w-[300px]"
                        />
                      </div>
                      <div
                        className={cn(
                          'flex flex-col gap-4 px-3',
                          classOptionSelected && classOptionSelected?.length > 1 && 'hidden',
                        )}
                      >
                        <div className="font-medium">Dành cho</div>
                        <MultiSelectPeople
                          options={generateStudentOptions()}
                          onChange={studentHandleChange}
                          value={studentSelected}
                          isSelectAll={true}
                          menuPlacement={'bottom'}
                        />
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

export default AssignmentDocsModal;
