/* eslint-disable no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent2, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MetaLinkData } from '@/types';
import { logError } from '@/libs/utils';

const AddLinkModal = ({
  isOpen,
  setIsOpen,
  setLinks,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLinks: React.Dispatch<React.SetStateAction<MetaLinkData[]>>;
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
      const res = await axios.get(`/api/url?url=${values.link}`);

      setLinks((prev) => [...prev, res.data]);

      setIsOpen(false);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent2
        className="w-[300px] !z-50 gap-0 duration-0 transition-all p-5 text-gray-700 font-sans"
        classOverlay="!z-50"
      >
        <DialogHeader>
          <DialogTitle className="text-md">Thêm đường liên kết</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase">Đường liên kết</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          disabled={form.formState.isSubmitting}
                          className="text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          onChangeCapture={(event) => {
                            inputChangeHandler(event.currentTarget.value);
                          }}
                          id="link"
                          {...field}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="!mt-0">
              <DialogFooter>
                <Button type="button" variant={'secondary3'} onClick={() => setIsOpen(false)} className="w-20 h-8">
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || form.formState.isSubmitting}
                  className="w-20 h-8"
                  variant="primaryGhost"
                >
                  {form.formState.isSubmitting && (
                    <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                  )}
                  Lưu
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent2>
    </Dialog>
  );
};

export default AddLinkModal;
