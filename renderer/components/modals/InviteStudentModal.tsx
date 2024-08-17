/* eslint-disable no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent2, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ICourse } from '@/types';

const InviteStudentModal = ({
  isOpen,
  setIsOpen,
  classes,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classes: ICourse;
}) => {
  const [canSubmit, setCanSubmit] = useState(false);

  const FormSchema = z.object({
    link: z.string().url({
      message: 'Đường liên kết không hợp lệ',
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: '',
    },
  });

  const inputChangeHandler = async (value: string) => {
    try {
      new URL(value);
      setCanSubmit(true);
    } catch (_) {
      setCanSubmit(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent2 className="max-w-[455px] max-h-[500px] gap-0 duration-0 transition-all p-5 text-gray-700 font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg">Mời học viên</DialogTitle>
        </DialogHeader>
        <div className="mt-6 text-sm">
          <div className="font-bold">Đường liên kết mời</div>
          <div className="flex items-center translate-y-[-10px]">
            <div className="line-clamp-1 w-full">{`${process.env.NEXT_PUBLIC_URL}/classes/invite/${classes.inviteCode}`}</div>
            <Button
              variant="secondary3"
              className="rounded-full border-none flex justify-center items-center !w-[52px] !h-[50px] !p-1"
            >
              <Copy className="" width={20} height={20} />
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormControl></FormControl>
                    <FormMessage />
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
                  disabled={!canSubmit || form.formState.isSubmitting}
                  className="w-20 h-8"
                  variant="primaryGhost"
                >
                  {form.formState.isSubmitting && (
                    <div className="mr-1 w-4 h-4 rounded-full border border-black border-solid animate-spin border-t-transparent"></div>
                  )}
                  Mời
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent2>
    </Dialog>
  );
};

export default InviteStudentModal;
