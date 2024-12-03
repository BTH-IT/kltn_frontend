/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { YoutubeCardProps } from '@/components/common/YoutubeCard';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/libs/utils';
import { getYoutubeDataById, getYoutubeDatabySearch as getYoutubeDataBySearch } from '@/actions/youtubeAction';

interface YoutubeSearchFormProps {
  isQueryUrl: boolean;
  isQueryText: boolean;
  setIsQueryUrl: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQueryText: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchData: React.Dispatch<React.SetStateAction<YoutubeCardProps[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<YoutubeCardProps | null>>;
}

const YoutubeSearchForm = ({
  isQueryUrl,
  isQueryText,
  setIsQueryUrl,
  setIsQueryText,
  setSearchData,
  setIsLoading,
  setSelectedVideo,
}: YoutubeSearchFormProps) => {
  const FormSchema = z.object({
    query: z.string().min(1, {
      message: 'Vui lòng nhập từ khóa tìm kiếm',
    }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: '',
    },
  });

  const isValidYoutubeUrl = (url: string) => {
    if (url.includes('youtu.be')) return true;
    // check if value is a valid youtube video link: e.g: https://www.youtube.com/watch?v=Zzn9-ATB9aU
    const pattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch.+$/;
    return pattern.test(url);
  };

  const searchYoutubeData = async (query: string) => {
    setIsLoading(true);
    const data = await getYoutubeDataBySearch(query);
    setIsLoading(false);
    setSearchData(data);
  };

  const selectUrl = async (query: string) => {
    setIsLoading(true);
    const data = await getYoutubeDataById(query.split('v=')[1]);
    setIsLoading(false);
    setSearchData([]);
    setSelectedVideo(data);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const link = new URL(values.query);

      if (isValidYoutubeUrl(link.href)) {
        setIsQueryUrl(true);
        await selectUrl(values.query);
      } else {
        setIsQueryText(true);
        await searchYoutubeData(values.query);
      }
    } catch (_) {
      setIsQueryText(true);
      searchYoutubeData(values.query);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col items-center px-6 pb-6', isQueryUrl || isQueryText ? 'hidden' : '')}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Image
          src="https://www.gstatic.com/newt/images/newt_uploadvideo@1x.gif"
          alt="Youtube GIF"
          width={355}
          height={235}
        />
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex w-[500px] rounded-md items-center border-[1px] border-gray-600 hover:border-black">
                  <Input
                    className="text-lg text-black h-14"
                    type="search"
                    placeholder="Tìm trên Youtube hoặc dán URL"
                    {...field}
                  />
                  <Button
                    type="submit"
                    variant="secondary3"
                    className="h-14 rounded-s-none border-[1px] border-s-gray-300"
                  >
                    <Search width={20} height={20} className="text-gray-500" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default YoutubeSearchForm;
