/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent2, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ICourse } from '@/types';
import courseService from '@/services/courseService';

import { MultiValueInput } from '../common/MultiValueInput';

const InviteStudentModal = ({
  isOpen,
  setIsOpen,
  course,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: ICourse;
}) => {
  const router = useRouter();
  const FormSchema = z.object({
    emails: z.array(z.string().email({ message: 'Địa chỉ email không hợp lệ' })).min(1, {
      message: 'Ít nhất một email phải được nhập',
    }),
  });

  const formMethods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emails: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      console.log(values.emails);
      await courseService.addStudents(course.courseId, values.emails);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent2 className="max-w-[455px] max-h-[500px] gap-0 duration-0 transition-all p-5 text-gray-700 font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg">Mời sinh viên</DialogTitle>
        </DialogHeader>
        <div className="mt-6 text-sm">
          <div className="font-bold">Đường liên kết mời</div>
          <div className="flex items-center translate-y-[-10px]">
            <div className="w-full line-clamp-1">{`${process.env.NEXT_PUBLIC_URL}/courses/invite/${course.inviteCode}`}</div>
            <Button
              variant="secondary3"
              className="rounded-full border-none flex justify-center items-center !w-[52px] !h-[50px] !p-1"
            >
              <Copy className="" width={20} height={20} />
            </Button>
          </div>
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={formMethods.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <MultiValueInput
                      name={field.name}
                      placeholder="Nhập email, phân tách bằng dấu phẩy..."
                      regex={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
                      className="max-w-[500px]"
                    />
                    {field.value.length <= 0 && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
            <div className="!mt-0">
              <DialogFooter>
                <Button variant={'secondary3'} onClick={() => setIsOpen(false)} className="w-20 h-8">
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={formMethods.formState.isSubmitting}
                  className="w-20 h-8"
                  variant="primaryGhost"
                >
                  {formMethods.formState.isSubmitting && (
                    <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                  )}
                  Mời
                </Button>
              </DialogFooter>
            </div>
          </form>
        </FormProvider>
      </DialogContent2>
    </Dialog>
  );
};

export default InviteStudentModal;
