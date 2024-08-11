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
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ClassesContext } from '@/contexts/ClassesContext';
import { cn } from '@/libs/utils';
import classService from '@/services/classService';
import { ClassContext } from '@/contexts/ClassContext';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';

import ShowCodeModal from './ShowCodeModal';

const ClassOptionModal = ({
  onOpenModal,
  setOnOpenModal,
}: {
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { classes } = useContext(ClassContext);

  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { classesCreated, setClassesCreated } = useContext(ClassesContext);
  const { subjects } = useContext(CreateSubjectContext);

  const FormSchema = z.object({
    name: z.string().min(1, {
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
      name: '',
      subjectId: { label: '', value: '' },
      enableInvite: 'true',
    },
  });

  useEffect(() => {
    if (classes && classes.subject) {
      form.setValue('name', classes.name);
      form.setValue('subjectId', {
        label: `${classes.subjectId} - ${classes.subject.name}`,
        value: classes.subjectId,
      });
      form.setValue('enableInvite', String(classes.enableInvite));
    }
  }, [classes, form]);

  const isLoading = hasSubmitted;

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!classes) return;

    try {
      setHasSubmitted(true);

      const data = {
        ...classes,
        name: values.name,
        subjectId: values.subjectId.value,
        enableInvite: values.enableInvite === 'true',
      };

      const res = await classService.updateClass(classes.classId, data);

      classesCreated.forEach((c, index) => {
        if (c.classId === classes.classId) {
          classesCreated[index] = res.data;
          setClassesCreated([...classesCreated]);
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
      setSubmitError(true);
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
    if (!classes) return;

    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/classes/invite/${classes.inviteCode}`);
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
        <DialogContent2 className="p-0 w-screen h-screen max-h-screen font-sans text-gray-700">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex justify-center">
            <Form {...form}>
              <form
                onChange={() => onChangeForm()}
                onSubmit={form.handleSubmit(onSubmit)}
                className="items-center space-y-8 w-full h-fit"
              >
                <div className="flex sticky top-0 right-0 left-0 justify-between items-center px-5 py-3 w-full bg-white border-b-2">
                  <div className="font-semibold text-md">Cài đặt lớp học</div>
                  <div className="flex gap-7 items-center">
                    <Button type="submit" disabled={!canSubmit || hasSubmitted} className="w-20" variant="primary">
                      {hasSubmitted && (
                        <div className="mr-1 w-4 h-4 rounded-full border border-black border-solid animate-spin border-t-transparent"></div>
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
                    <div className="my-2 text-2xl">Mã mời</div>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="enableInvite"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">Quản lý mã mời</div>
                                <div className="text-xs">
                                  Chế độ cài đặt áp dụng cho cả mã lớp học và đường liên kết mời
                                </div>
                              </div>
                              <FormControl>
                                <ShadSelect defaultValue={field.value}>
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="true">Bật</SelectItem>
                                      <SelectItem value="false">Tắt</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </ShadSelect>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Đường liên kết mời</div>
                        <div className="flex gap-1 items-center">
                          <div className="text-sm">{`${process.env.NEXT_PUBLIC_URL}/classes/invite/${classes?.inviteCode}`}</div>
                          <div
                            onClick={() => handleCopyInvLinkClick()}
                            className="flex justify-center items-center p-0 w-12 h-12 rounded-full cursor-pointer hover:bg-gray-100/60"
                          >
                            <Copy width={20} height={20} />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Mã lớp</div>
                        <div className="pr-4">{classes?.inviteCode}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Chế độ xem lớp học</div>
                        <ShowCodeModal invCode={classes?.inviteCode || ''} classesName={classes?.name || ''}>
                          <div className="flex gap-2 justify-center items-center px-3 py-1 font-semibold text-blue-500 rounded-md cursor-pointer hover:bg-blue-100/30 hover:text-blue-800">
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

export default ClassOptionModal;
