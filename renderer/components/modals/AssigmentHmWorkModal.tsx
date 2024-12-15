/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { NotebookText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { getLeafColumns, logError } from '@/libs/utils';
import assignmentService from '@/services/assignmentService';
import uploadService from '@/services/uploadService';
import { ICourse, MetaLinkData } from '@/types';
import { IAssignment } from '@/types/assignment';
import { formatDuration } from '@/utils';

import { DateTimePicker } from '../common/DatetimePicker';
import { YoutubeCardProps } from '../common/YoutubeCard';
import AssignmentForm from '../forms/AssignmentForm';

import AddLinkModal from './AddLinkModal';
import AddYoutubeLinkModal from './AddYoutubeLinkModal';

const AssignmentHmWorkModal = ({
  course,
  onOpenModal,
  setOnOpenModal,
  setAssignments,
}: {
  course: ICourse | null;
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignments: React.Dispatch<React.SetStateAction<IAssignment[]>>;
}) => {
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const [scoreCols, setScoreCols] = useState<any[]>([]);
  const [type, setType] = useState<any>(null);
  const [scoreSelectedOption, setScoreSelectedOption] = useState<any>(null);
  const [isChooseGroup, setIsChooseGroup] = useState<boolean>(false);
  const [useFinalGroup, setUseFinalGroup] = useState<boolean>(false);
  const [isInvidual, setIsInvidual] = useState<boolean>(false);
  const [autoGenerateCount, setAutoGenerateCount] = useState('1');
  const [dueDate, setDueDate] = useState<Date | undefined | null>(undefined);
  const [registerExpiryDate, setRegisterExpiryDate] = useState<Date | undefined | null>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);

  useEffect(() => {
    if (course) {
      const scoreCols = getLeafColumns(course.scoreStructure);
      setScoreCols(scoreCols);
    }
  }, [course]);

  const FormSchema = z.object({
    title: z.string().min(1, {
      message: 'Tiêu đề không hợp lệ',
    }),
    content: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const resetForm = () => {
    form.reset();
    setScoreSelectedOption(false);
    setType(null);
    setIsChooseGroup(false);
    setUseFinalGroup(false);
    setIsInvidual(false);
    setAutoGenerateCount('1');
    setDueDate(undefined);
    setRegisterExpiryDate(undefined);
    setFiles([]);
    setLinks([]);
  };

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

  const submitForm = async (values: z.infer<typeof FormSchema>, courseId: string) => {
    const resAttachments = files.length > 0 ? await uploadService.uploadMultipleFileWithAWS3(files) : [];

    if (!type.value) {
      toast.error('Vui lòng chọn loại bài tập');
      return;
    }

    const formattedDueDate = dueDate
      ? (() => {
          const newDate = new Date(dueDate);
          newDate.setHours(newDate.getHours() + 7);
          return newDate.toISOString().split('.')[0] + 'Z';
        })()
      : null;

    let assignmentOptions = {};

    if (isChooseGroup) {
      assignmentOptions = useFinalGroup ? { useFinalGroup } : { autoGenerateCount };
    }

    const data = {
      courseId,
      title: values.title,
      content: values.content,
      scoreStructureId: scoreSelectedOption?.value,
      type: type.value,
      isGroupAssigned: isChooseGroup,
      IsIndividualSubmissionRequired: isInvidual,
      dueDate: formattedDueDate,
      attachedLinks: links,
      attachments: resAttachments,
      assignmentOptions,
    };

    return await assignmentService.createAssignment(data);
  };

  const createAssignment = async (values: z.infer<typeof FormSchema>, courseId: string) => {
    try {
      const response = await submitForm(values, courseId);
      return response?.data;
    } catch (error) {
      console.error(`Error creating assignment for class ${courseId}:`, error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!course) return;
    if (!type) {
      toast.error('Vui lòng chọn loại bài tập');
      return;
    }

    if (isChooseGroup && !useFinalGroup && (!autoGenerateCount || parseInt(autoGenerateCount) < 1)) {
      toast.error('Vui lòng điền số lượng nhóm cần tạo');
      return;
    }

    try {
      const data = await createAssignment(values, course.courseId);

      if (!data) return;

      console.log(data);

      setAssignments((prev) => [...prev, data]);

      toast.success('Đã đăng bài tập thành công');

      resetForm();
      setOnOpenModal(false);
    } catch (error) {
      logError(error);
    }
  };

  const onCloseModal = () => {
    resetForm();
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
                    <div className="flex flex-col col-span-6 p-5 border-l md:col-span-3 gap-7">
                      <div className="grid grid-cols-12 px-3 gap-y-7">
                        <div className="col-span-8 font-medium">Áp dụng cho nhóm?</div>
                        <Switch
                          className="col-span-4"
                          checked={isChooseGroup}
                          onCheckedChange={(value) => setIsChooseGroup(value)}
                        />
                        {isChooseGroup && (
                          <>
                            {course?.setting.hasFinalScore &&
                              course?.setting.dueDateToJoinGroup &&
                              course?.setting.dueDateToJoinGroup < new Date() && (
                                <>
                                  <div className="col-span-8 font-medium">Sử dụng lại nhóm đồ án?</div>
                                  <Switch
                                    className="col-span-4"
                                    checked={useFinalGroup}
                                    onCheckedChange={(value) => setUseFinalGroup(value)}
                                  />
                                </>
                              )}
                            <div className="col-span-8 font-medium">Chấm điểm cá nhân?</div>
                            <Switch
                              className="col-span-4"
                              checked={isInvidual}
                              onCheckedChange={(value) => setIsInvidual(value)}
                            />
                          </>
                        )}
                      </div>
                      {isChooseGroup && !useFinalGroup && (
                        <div className="flex flex-col gap-4 px-3">
                          <div className="font-medium ">Số lượng nhóm cần tạo:</div>
                          <Input
                            type="number"
                            value={autoGenerateCount}
                            onChange={(e) => setAutoGenerateCount(e.target.value)}
                            min={1}
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Loại bài tập</div>
                        <CreatableSelect
                          isClearable
                          options={[
                            {
                              value: 'homework',
                              label: 'Bài tập về nhà',
                            },
                            {
                              value: 'classwork',
                              label: 'Bài tập tại lớp',
                            },
                          ]}
                          onChange={(value) => {
                            setType(value);
                          }}
                        />
                      </div>
                      {isChooseGroup && course?.setting.hasFinalScore && (
                        <div className="flex flex-col gap-4 px-3">
                          <div className="font-medium">Hạn đăng kí nhóm</div>
                          <DateTimePicker
                            date={
                              typeof registerExpiryDate === 'string' ? new Date(registerExpiryDate) : registerExpiryDate
                            }
                            setDate={setRegisterExpiryDate}
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Hạn nộp</div>
                        <DateTimePicker
                          date={typeof dueDate === 'string' ? new Date(dueDate) : dueDate}
                          setDate={setDueDate}
                          minDate={new Date()}
                        />
                      </div>
                      <div className="flex flex-col gap-4 px-3">
                        <div className="font-medium">Ứng với cột điểm</div>
                        <CreatableSelect
                          isClearable
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

export default AssignmentHmWorkModal;
