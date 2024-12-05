/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookText, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import submissionService from '@/services/submissionService';
import uploadService from '@/services/uploadService';
import { ICourse, MetaLinkData } from '@/types';
import { IAssignment } from '@/types/assignment';
import { formatDuration } from '@/utils';

import { YoutubeCardProps } from '../common/YoutubeCard';
import SubmitAssignmentForm from '../forms/SubmitAssignmentForm';

import AddLinkModal from './AddLinkModal';
import AddYoutubeLinkModal from './AddYoutubeLinkModal';

const FormSchema = z.object({
  description: z.string(),
});

const SubmitAssignmentModal = ({
  course,
  onOpenModal,
  setOnOpenModal,
  assignment,
  setAssignment,
}: {
  course: ICourse | null;
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: IAssignment;
  setAssignment: any;
}) => {
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
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

  const submitForm = async (values: z.infer<typeof FormSchema>) => {
    if (files.length <= 0 && links.length <= 0) {
      toast.error('Bắt buộc ít nhất 1 tệp tin hoặc 1 liên kết');
      return;
    }

    const resAttachments = files.length > 0 ? await uploadService.uploadMultipleFileWithAWS3(files) : [];

    const data = {
      description: values.description,
      attachedLinks: links,
      attachments: resAttachments,
    };

    return await submissionService.createSubmission(assignment.assignmentId, data);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      const res = await submitForm(values);

      if (!res) return;

      toast.success('Đã nộp bài tập thành công');
      setAssignment({ ...assignment, submission: res.data });

      setOnOpenModal(false);

      router.refresh();
    } catch (error) {
      console.error('Error creating assignments:', error);
      toast.error('Có lỗi khi đăng bài tập');
    }
  };

  const onCloseModal = () => {
    setOnOpenModal(false);
  };

  return (
    <>
      <Dialog open={onOpenModal} onOpenChange={onCloseModal}>
        <DialogContent2 className="w-screen h-screen max-h-screen p-0 font-sans text-gray-700">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex justify-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="items-center w-full space-y-8 h-fit">
                <div className="sticky top-0 left-0 right-0 flex items-center justify-between w-full px-5 py-3 bg-white border-b-2">
                  <div className="flex items-center gap-3 font-semibold text-md">
                    <NotebookText />
                    Nộp bài tập
                  </div>
                  <div className="flex items-center gap-7">
                    <Button type="submit" className="w-20" variant="primary">
                      {form.formState.isSubmitting && (
                        <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
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
                  <SubmitAssignmentForm
                    form={form}
                    files={files}
                    setFiles={setFiles}
                    links={links}
                    setLinks={setLinks}
                    setIsOpenSelectLinkModal={setIsOpenSelectLinkModal}
                    setIsOpenSelectYoutubeModal={setIsOpenSelectYoutubeModal}
                  />
                </div>
              </form>
            </Form>
            <AddLinkModal isOpen={isOpenSelectLinkModal} setIsOpen={setIsOpenSelectLinkModal} setLinks={setLinks} />
            <AddYoutubeLinkModal
              isOpen={isOpenSelectYoutubeModal}
              setIsOpen={setIsOpenSelectYoutubeModal}
              handleAddYoutubeLink={handleAddYoutubeLink}
            />
          </div>
        </DialogContent2>
      </Dialog>
    </>
  );
};

export default SubmitAssignmentModal;
