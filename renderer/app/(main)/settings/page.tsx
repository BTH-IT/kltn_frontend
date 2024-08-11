'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import withPermission from '@/libs/hoc/withPermission';
import { USER_SETTINGS } from '@/constants/common';
import { IUser, SettingsSchema } from '@/types';
import Loading from '@/components/loading/loading';
import userService from '@/services/userService';

const settingsSchema: SettingsSchema = USER_SETTINGS.reduce((schema, setting) => {
  schema[setting.name] = z.boolean().default(false).optional().nullish();
  return schema;
}, {} as SettingsSchema);

const FormSchema = z.object(settingsSchema);

const SettingPage = withPermission(() => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {}, // Set default values initially
  });

  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUser(userId: string) {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const res = await userService.getUserById(userId);

        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (currentUser.userId) {
      fetchUser(currentUser.userId);
    }
  }, [currentUser.userId]);

  useEffect(() => {
    if (user) {
      // Set the form's default values based on fetched user data
      form.reset({
        isNoticeEmail: user.isNoticeEmail,
        isCommentOnPost: user.isCommentOnPost,
        isNoticeMention: user.isNoticeMention,
        isPrivateComment: user.isPrivateComment,
        isNoticeAssignment: user.isNoticeAssignment,
        isReturnedAssignment: user.isReturnedAssignment,
        iscClassInvite: user.iscClassInvite,
        isReminder: user.isReminder,
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentUser?.userId) return;

    try {
      await userService.updateUser(currentUser.userId, data as IUser);

      toast({
        title: 'Update your settings was successfully',
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      toast({
        title: 'Update your settings was failure',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-[600px] w-full mx-auto my-[40px] p-10 border rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Thông báo</h3>
            <div className="space-y-4">
              {USER_SETTINGS.map((item, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{item.title}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting} className="flex items-center gap-3">
            {form.formState.isSubmitting && (
              <div className="w-4 h-4 mr-1 border border-white border-solid rounded-full animate-spin border-t-transparent"></div>
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
});

export default SettingPage;
