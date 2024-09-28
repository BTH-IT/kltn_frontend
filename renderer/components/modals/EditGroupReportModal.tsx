'use client';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Link2, Upload } from 'lucide-react';

import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { MetaLinkData } from '@/types';
import { formatDuration } from '@/utils';

import AnnouncementFileList from '../pages/courses/AnnoucementFileList';
import AnnouncementLinkList from '../pages/courses/AnnouncementLinkList';
import { YoutubeCardProps } from '../common/YoutubeCard';

import AddYoutubeLinkModal from './AddYoutubeLinkModal';
import AddLinkModal from './AddLinkModal';

const EditGroupReportModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const existingFiles = files;

    const updatedFiles = [...existingFiles, ...newFiles].reduce((acc: File[], fl) => {
      if (!acc.find((f) => f.name === fl.name)) {
        acc.push(fl);
      }
      return acc;
    }, []);

    setFiles(updatedFiles);
  };

  const FormSchema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống'),
    content: z.string().min(1, 'Nội dung không được để trống'),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: 'current title',
      content: 'current content',
    },
  });

  const handleAddYoutubeLink = (selectedVideo: YoutubeCardProps | null) => {
    if (selectedVideo) {
      setLinks((prev) => [
        ...prev,
        {
          title: selectedVideo.title,
          description: `Video trên Youtube • ${formatDuration(selectedVideo.duration)}`,
          image: selectedVideo.thumbnail,
          url: `https://www.youtube.com/watch?v=${selectedVideo.videoId}`,
        },
      ]);
      setIsOpenSelectYoutubeModal(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      // const data = {
      // };
      // const res = await groupService.addMember(group.groupId, data);
      // if (res.data) {
      //   toast.success('Thêm thành viên thành công');
      //   const sortedGroupMembers = [...res.data].sort((a) => (a.isLeader ? -1 : 1));
      //   setMembers(sortedGroupMembers);
      //   onClose();
      // } else {
      //   toast.error(res.message);
      // }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const onClose = () => {
    form.reset();
    setFiles([]);
    setLinks([]);
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[95vh]">
        <DialogHeader className="h-fit">
          <DialogTitle>Chỉnh sửa mục mới</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin ở đây.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 pb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Tiêu đề</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          {...field}
                          className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500"
                          placeholder="Nhập tiêu đề"
                        />
                        <Skeleton className={cn('h-10 w-full', !form.formState.isSubmitting && 'hidden')} />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">Nội dung</FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        placeholder="Nội dung"
                        className="flex-1 rounded-md h-[150px]"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col w-[750px] h-[280px] gap-5 p-4 mt-4 bg-white border rounded-xl">
                <div className="flex justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-semibold">Đính kèm</h2>
                    <div className="flex h-full items-center gap-5">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Button
                          onClick={() => {
                            setIsOpenSelectYoutubeModal(true);
                          }}
                          className="w-12 h-12 rounded-full p-0 border-[1px]"
                          variant="secondary3"
                          type="button"
                        >
                          <FontAwesomeIcon size="xl" icon={faYoutube} />
                        </Button>
                        <p>Youtube</p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Button
                          className="w-12 h-12 rounded-full p-0 border-[1px]"
                          variant="secondary3"
                          type="button"
                          onClick={() => {
                            if (fileRef?.current) {
                              fileRef.current.click();
                            }
                          }}
                        >
                          <Upload width={20} height={20} />
                        </Button>
                        <input
                          id="fileInput"
                          ref={fileRef}
                          type="file"
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <p>Tải lên</p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Button
                          onClick={() => setIsOpenSelectLinkModal(true)}
                          className="w-12 h-12 rounded-full p-0 border-[1px]"
                          variant="secondary3"
                          type="button"
                        >
                          <Link2 width={20} height={20} />
                        </Button>
                        <p>Liên kết</p>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[230px] overflow-y-scroll">
                    <AnnouncementFileList files={files} setFiles={setFiles} />
                    <AnnouncementLinkList links={links} setLinks={setLinks} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="!mt-0 flex !justify-center">
              <Button disabled={form.formState.isSubmitting} variant="primary" type="submit">
                {form.formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Chỉnh sửa
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <AddLinkModal isOpen={isOpenSelectLinkModal} setIsOpen={setIsOpenSelectLinkModal} setLinks={setLinks} />
        <AddYoutubeLinkModal
          isOpen={isOpenSelectYoutubeModal}
          setIsOpen={setIsOpenSelectYoutubeModal}
          handleAddYoutubeLink={handleAddYoutubeLink}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupReportModal;
