/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import submissionService from '@/services/submissionService';
import uploadService from '@/services/uploadService';
import { ICourse, IUser, MetaLinkData } from '@/types';
import { IAssignment } from '@/types/assignment';
import { formatDuration } from '@/utils';

import { YoutubeCardProps } from '../common/YoutubeCard';
import SubmitAssignmentForm from '../forms/SubmitAssignmentForm';

import AddLinkModal from './AddLinkModal';
import AddYoutubeLinkModal from './AddYoutubeLinkModal';

const FormSchema = z.object({
  description: z.string(),
});

const ViewSubmissionModal = ({
  course,
  onOpenModal,
  setOnOpenModal,
  assignment,
  user,
}: {
  course: ICourse | null;
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: IAssignment;
  user: IUser | null;
}) => {
  const [submitable, setSubmitable] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
    },
  });

  useEffect(() => {
    if (assignment) {
      form.setValue('description', assignment.content);

      const isSubmissionDeletable = () => {
        if (!user || !assignment.submission) return false;

        const isCreator = assignment.submission.createUser.id === user.id;
        const isLecturer = user.id === assignment.course.lecturerId;
        const isOverdue = assignment.dueDate ? new Date(assignment.dueDate) < new Date() : false;

        return isLecturer || (isCreator && !isOverdue);
      };

      if (isSubmissionDeletable()) {
        setSubmitable(true);
      }
    }
  }, [assignment, user, form, onOpenModal]);

  const onSubmit = async (values: z.infer<typeof FormSchema>): Promise<void> => {
    if (!assignment) return;

    try {
      const res = await submissionService.deleteSubmission(
        assignment.assignmentId,
        assignment.submission?.submissionId ?? '',
      );

      if (res) {
        toast.success('Đã xóa bài tập thành công');
        onCloseModal();
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
                    Xem bài tập
                  </div>
                  <div className="flex items-center gap-7">
                    <Button disabled={!submitable} type="submit" className="w-20" variant="destructive">
                      {form.formState.isSubmitting && (
                        <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                      )}
                      Hủy nộp
                    </Button>
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                </div>
                <div className="!my-0 overflow-auto w-full h-[92vh]">
                  <SubmitAssignmentForm form={form} assignment={assignment} readOnly />
                </div>
              </form>
            </Form>
          </div>
        </DialogContent2>
      </Dialog>
    </>
  );
};

export default ViewSubmissionModal;
