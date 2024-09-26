/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import assignmentService from '@/services/assignmentService';
import uploadService from '@/services/uploadService';
import { ICourse, MetaLinkData } from '@/types';
import { IAssignment } from '@/types/assignment';
import { formatDuration } from '@/utils';

import { DateTimePicker } from '../common/DatetimePicker';
import AssignmentForm from '../forms/AssignmentForm';
import { YoutubeCardProps } from '../common/YoutubeCard';

import AddLinkModal from './AddLinkModal';
import AddYoutubeLinkModal from './AddYoutubeLinkModal';

const FormSchema = z.object({
  title: z.string().min(1, {
    message: 'Tiêu đề không hợp lệ',
  }),
  content: z.string(),
});

const EditAssignmentHmWorkModal = ({
  course,
  onOpenModal,
  setOnOpenModal,
  assignment,
}: {
  course: ICourse | null;
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: IAssignment;
}) => {
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const [scoreCols, setScoreCols] = useState<any[]>([]);
  const [scoreSelectedOption, setScoreSelectedOption] = useState<any>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (course) {
      // const scoreCols = JSON.parse(course?.scoreStructure)
      //   .filter(
      //     (item: any) =>
      //       !(item.divideColumnFirst && item.divideColumnFirst.length > 0)
      //   )
      //   .sort((a: any, b: any) => a.columnName.localeCompare(b.columnName));
      // setScoreCols(scoreCols);
    }
  }, [course]);

  useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment?.title || '',
        content: assignment?.content || '',
      });

      setDueDate(assignment.dueDate ? new Date(assignment.dueDate) : undefined);

      setFiles(assignment.attachments || []);

      setLinks(assignment.attachedLinks || []);
    }
  }, [assignment, course, form]);

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
    const resAttachments = files.length > 0 ? await uploadService.uploadMultipleFileWithAWS3(files) : [];

    const formattedDueDate = dueDate?.toISOString() ?? null;

    const data = {
      title: values.title,
      content: values.content,
      dueDate: formattedDueDate,
      attachedLinks: links,
      attachments: resAttachments,
    };

    return await assignmentService.updateAssignment(assignment.assignmentId, data);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      await submitForm(values);

      toast.success('Đã chỉnh sửa bài tập thành công');

      setOnOpenModal(false);
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
                    Bài tập
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
                  <div className="grid h-full grid-cols-12">
                    <div className="col-span-9 bg-[#F8F9FA]">
                      <AssignmentForm
                        form={form}
                        files={files}
                        setFiles={setFiles}
                        links={links}
                        setLinks={setLinks}
                        setIsOpenSelectLinkModal={setIsOpenSelectLinkModal}
                        setIsOpenSelectYoutubeModal={setIsOpenSelectYoutubeModal}
                      />
                    </div>
                    <div className="flex flex-col col-span-3 gap-5 p-5 border-l">
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Hạn nộp</div>
                        <DateTimePicker date={dueDate} setDate={setDueDate} />
                      </div>
                      {/* <div className='flex flex-col gap-4 px-3'>
                        <div className='font-medium'>
                          Bài tập ứng với cột điểm
                        </div>
                        <CreatableSelect
                          isClearable
                          options={scoreCols.map((item) => {
                            return {
                              value: item.id,
                              label: `${item.columnName} - ${item.percent}%`,
                            };
                          })}
                          onChange={(selectedOption) => {
                            setScoreSelectedOption(selectedOption);
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
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

export default EditAssignmentHmWorkModal;
