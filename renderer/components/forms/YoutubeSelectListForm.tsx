/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import YoutubeCard, { YoutubeCardProps } from '@/components/common/YoutubeCard';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { isValidYoutubeUrl } from '@/utils';
import { getYoutubeDatabySearch } from '@/actions/youtubeAction';

interface YoutubeSelectListFormProps {
  setIsQueryUrl: React.Dispatch<React.SetStateAction<boolean>>;
  searchData: YoutubeCardProps[];
  setSelectedVideo: React.Dispatch<React.SetStateAction<YoutubeCardProps | null>>;
  isLoading: boolean;
  isQueryText: boolean;
  selectedVideo: YoutubeCardProps | null;
}

const FormSchema = z.object({
  query: z.string().min(1, {
    message: 'Vui lòng nhập từ khóa tìm kiếm',
  }),
});

const YoutubeSelectListForm = ({
  setIsQueryUrl,
  searchData,
  setSelectedVideo,
  isLoading,
  isQueryText,
  selectedVideo,
}: YoutubeSelectListFormProps) => {
  const [data, setData] = useState<YoutubeCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: '',
    },
  });

  useEffect(() => {
    setData(searchData);
  }, [searchData]);

  const searchYoutubeData = async (query: string, nextPageToken = '') => {
    const data = await getYoutubeDatabySearch(query, nextPageToken);
    return data;
  };

  const handleFormSubmit = async (query: string) => {
    try {
      const link = new URL(query);
      if (isValidYoutubeUrl(link.href)) {
        setIsQueryUrl(true);
      } else {
        const data = await searchYoutubeData(query);
        setData(data);
      }
    } catch (_) {
      const data = await searchYoutubeData(query);
      setData(data);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    handleFormSubmit(values.query);
  };

  const fetchMoreData = async () => {
    setLoading(true);
    const data = await searchYoutubeData(form.getValues('query'), searchData[searchData.length - 1].nextPageToken);
    setData((prevData) => [...prevData, ...data]);
    setLoading(false);
  };

  return (
    <div className={`${!isLoading && isQueryText && !selectedVideo ? '' : 'hidden'} overflow-y-auto`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex p-6">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex w-[500px] rounded-md items-center border-[1px] border-gray-600 hover:border-black">
                    <Input
                      disabled={form.formState.isSubmitting}
                      className="text-lg text-black h-14"
                      type="search"
                      placeholder="Tìm trên Youtube hoặc dán URL"
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
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
      <div className="overflow-y-auto">
        <div className="grid grid-cols-12 gap-5 p-5">
          {data.length > 0 &&
            data.map((item: any) => <YoutubeCard setSelectedVideo={setSelectedVideo} key={item.videoId} {...item} />)}
        </div>
      </div>
      <div className="pb-6 pl-6">
        <Button
          disabled={loading}
          type="button"
          onClick={() => {
            fetchMoreData();
          }}
          variant="primaryReverge"
        >
          {loading ? 'Đang tải...' : 'Xem thêm'}
        </Button>
      </div>
    </div>
  );
};

export default YoutubeSelectListForm;
