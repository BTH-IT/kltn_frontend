'use client';
import groupService from '@/services/groupService';
import { IGroup } from '@/types/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export const CreateGroupModal = ({
  isOpen,
  setIsOpen,
  setGroupCreated,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGroupCreated: React.Dispatch<React.SetStateAction<IGroup | null>>;
}) => {
  const params = useParams();

  const FormSchema = z.object({
    groupName: z.string().min(1, { message: 'Tên nhóm là trường bắt buộc.' }),
    numberOfMembers: z.coerce.number(),
  });
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: '',
      numberOfMembers: 2,
    },
  });
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const res = await groupService.createGroup({
        ...values,
        courseId: params.courseId as string,
        //isApproved: true,
      });
      if (res.data) {
        //setProjects([...projects, res.data]);
        setGroupCreated(res.data);
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const onClose = () => {
    form.reset();
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mx-auto">
              {form.formState.isSubmitting ? 'Đang xử lý ...' : 'Tạo đề tài mới'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Tên nhóm</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              'focus-visible:ring-0 text-black focus-visible:ring-offset-0',
                              form.formState.isSubmitting && 'hidden',
                            )}
                            id="groupName"
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
                  name="numberOfMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase">Số lượng</FormLabel>
                      <FormControl>
                        <>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Số lượng thành viên tối đa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button disabled={form.formState.isSubmitting} className="px-3 py-2" variant="primary" type="submit">
                  {form.formState.isSubmitting && (
                    <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                  )}
                  Tạo nhóm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
