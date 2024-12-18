/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { NotebookText, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import { CourseContext } from '@/contexts/CourseContext';
import assignmentService from '@/services/assignmentService';
import uploadService from '@/services/uploadService';
import { MetaLinkData } from '@/types';
import { IAssignment } from '@/types/assignment';
import { formatDuration, getLeafColumns } from '@/utils';

import { DateTimePicker } from '../common/DatetimePicker';
import { YoutubeCardProps } from '../common/YoutubeCard';
import AssignmentForm from '../forms/AssignmentForm';

import AddLinkModal from './AddLinkModal';
import AddYoutubeLinkModal from './AddYoutubeLinkModal';

const FormSchema = z.object({
  title: z.string().min(1, {
    message: 'Tiêu đề không hợp lệ',
  }),
  content: z.string(),
});

const EditAssignmentHmWorkModal = ({
  onOpenModal,
  setOnOpenModal,
  assignment,
  setAssignments,
  isFinal = false,
}: {
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: IAssignment;
  setAssignments?: React.Dispatch<React.SetStateAction<IAssignment[]>>;
  isFinal?: boolean;
}) => {
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const [scoreCols, setScoreCols] = useState<any[]>([]);
  const [scoreSelectedOption, setScoreSelectedOption] = useState<any>([]);
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const [dueDate, setDueDate] = useState<Date | undefined | null>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);

  const { course } = useContext(CourseContext);
  const { setAssignment } = useContext(AssignmentContext);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (course) {
      const scoreCols = getLeafColumns(course.scoreStructure);
      setScoreCols(scoreCols);
    }
  }, [course]);

  useEffect(() => {
    if (assignment) {
      form.setValue('title', assignment.title);
      form.setValue('content', assignment.content);

      setDueDate(assignment.dueDate ? new Date(assignment.dueDate) : undefined);
      setFiles(assignment.attachments || []);
      setLinks(assignment.attachedLinks || []);
      assignment.scoreStructureId !== null &&
        setSelectedScore({
          value: assignment.scoreStructureId,
          label: `${assignment.scoreStructure?.columnName} - ${assignment.scoreStructure?.percent}%`,
        });
    }
  }, [assignment, onOpenModal, course, form]);

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

    const formattedDueDate = dueDate ? new Date(dueDate) : null;

    const data = {
      title: values.title,
      courseId: course?.courseId,
      content: values.content,
      dueDate: formattedDueDate,
      attachedLinks: links,
      attachments: resAttachments,
      scoreStructureId: scoreSelectedOption.value,
      type: assignment.type,
    };

    return await assignmentService.updateAssignment(assignment.assignmentId, data);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;

    try {
      const res = await submitForm(values);

      if (!res) throw new Error('Failed to update assignment');

      toast.success('Đã chỉnh sửa bài tập thành công');

      if (setAssignments) {
        setAssignments((prev) => {
          const newAssignments = prev.map((item) => {
            if (item.assignmentId === assignment.assignmentId) {
              return {
                ...item,
                ...res.data,
              };
            }
            return item;
          });
          return newAssignments;
        });
      } else {
        setAssignment(res.data);
      }

      setOnOpenModal(false);
    } catch (error) {
      console.error('Error creating assignments:', error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const onCloseModal = () => {
    setOnOpenModal(false);
    form.reset();
    setScoreSelectedOption(false);
    setSelectedScore(null);
    setDueDate(undefined);
    setFiles([]);
    setLinks([]);
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
                    Sửa bài tập
                  </div>
                  <div className="flex items-center gap-7">
                    <Button type="submit" className="w-20" variant="primary">
                      {form.formState.isSubmitting && (
                        <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                      )}
                      Sửa
                    </Button>
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                </div>
                <div className="!my-0 overflow-auto w-full h-[92vh]">
                  <div className="grid h-full grid-cols-12">
                    <div className="col-span-6 md:col-span-9 bg-[#F8F9FA]">
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
                    <div className="flex flex-col col-span-6 gap-5 p-5 border-l md:col-span-3">
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Hạn nộp</div>
                        <DateTimePicker
                          date={typeof dueDate === 'string' ? new Date(dueDate) : dueDate}
                          setDate={setDueDate}
                        />
                      </div>
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Ứng với cột điểm</div>
                        <CreatableSelect
                          isClearable
                          defaultValue={selectedScore}
                          options={scoreCols
                            .filter((item) => item.columnName !== 'Cuối kì')
                            .map((item) => {
                              return {
                                value: item.id,
                                label: `${item.columnName} - ${item.percent}%`,
                              };
                            })}
                          onChange={(selectedOption) => {
                            setScoreSelectedOption(selectedOption);
                          }}
                          isDisabled={isFinal}
                        />
                      </div>
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
