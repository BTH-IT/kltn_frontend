/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { FileText, SendHorizontal, EllipsisVertical, User, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import CommentList from '@/components/common/CommentList';
import { IAssignment, IComment, IGroup, ISubmission, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import commentService from '@/services/commentService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommonModal from '@/components/modals/CommonModal';
import assignmentService from '@/services/assignmentService';
import EditAssignmentHmWorkModal from '@/components/modals/EditAssigmentHmWorkModal';
import { API_URL } from '@/constants/endpoints';
import SubmitAssignmentModal from '@/components/modals/SubmitAssignmentModal';
import ViewSubmissionModal from '@/components/modals/ViewSubmissionModal';
import submissionService from '@/services/submissionService';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function SubmitProject({ group, data }: { group: IGroup; data: IAssignment }) {
  const { setItems } = useContext(BreadcrumbContext);

  const [assignment, setAssignment] = useState<IAssignment[]>([data]);

  useEffect(() => {
    if (!group.course) return;

    const breadcrumbLabel1 = group.course.name;
    const breadcrumbLabel2 = group.groupName;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${group.course.courseId}` },
      { label: 'Đồ án / Tiểu luận', href: `/courses/${group.course.courseId}/projects` },
      { label: breadcrumbLabel2, href: `/groups/${group.course.courseId}/${group.groupId}` },
      { label: 'Nộp bài' },
    ]);
  }, [group, setItems]);

  const [comments, setComments] = useState<IComment[]>([]);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false);
  const [isDeleteSubmissionModalOpen, setIsDeleteSubmissionModalOpen] = useState(false);
  const [isSubmissionDeletable, setIsSubmissionDeletable] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
      setUser(user ? JSON.parse(user) : null);
    }
  }, []);

  useEffect(() => {
    if (assignment) {
      setComments(assignment[0].comments);

      const isSubmissionDeletable = () => {
        if (!currentUser || !assignment[0].submission) return false;

        const isCreator = assignment[0].submission.createUser.id === currentUser.id;
        const isLecturer = currentUser.id === group.course.lecturerId;
        const isOverdue = assignment[0].dueDate ? new Date(assignment[0].dueDate) < new Date() : false;

        return isLecturer || (isCreator && !isOverdue);
      };

      if (isSubmissionDeletable()) {
        setIsSubmissionDeletable(true);
      }
    }
  }, [group, assignment, currentUser]);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id || !assignment) return;

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: assignment[0].assignmentId,
      });

      reset();
      setIsFocus(false);

      setComments((prev) => [res.data, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveComment = async (id: string) => {
    if (!assignment) return;
    try {
      await commentService.deleteComment(assignment[0].assignmentId, id);

      setComments(comments.filter((c) => c.commentId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    if (!assignment) return;
    try {
      const res = await assignmentService.deleteAssignment(assignment[0].assignmentId);
      if (res) {
        router.refresh();
        router.push(`/courses/${assignment[0].courseId}/assignments`);
        toast.success('Đã xoá bài tập thành công');
      }
    } catch (err) {
      console.error('Failed to delete assignment: ', err);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    if (!assignment) return;
    try {
      const res = await commentService.updateComment(assignment[0].assignmentId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!assignment) return;

    try {
      const res = await submissionService.deleteSubmission(
        assignment[0].assignmentId,
        assignment[0].submission?.submissionId ?? '',
      );

      if (res) {
        toast.success('Đã xóa bài tập thành công');
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating assignments:', error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const categorizeStatus = (submission: ISubmission | null) => {
    const now = new Date();

    const dueDate = new Date(assignment[0]?.dueDate || '');

    if (!submission) {
      if (assignment[0]?.dueDate === null) return 'Đã giao';

      if (now <= dueDate) return 'Chưa nộp bài';

      return 'Trễ hạn';
    }

    return 'Đã nộp bài';
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-8">
        <Card
          className={`col-span-9 border-none shadow-lg ${
            currentUser?.id === assignment[0]?.createUser?.id && 'col-span-12'
          }`}
        >
          <CardHeader className="rounded-t-lg bg-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">{assignment[0]?.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {assignment[0]?.createUser?.fullName || 'Anonymous'} • {moment(assignment[0]?.createdAt).fromNow()}{' '}
                    {assignment[0]?.updatedAt ? `(Đã chỉnh sửa lúc ${moment(assignment[0]?.updatedAt).fromNow()})` : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">Bài tập cho cột điểm: Cuối kỳ - 50%</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                {assignment[0]?.createUser?.id === currentUser?.id ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `${API_URL.COURSES}/${assignment[0]?.courseId}${API_URL.ASSIGNMENTS}/${assignment[0]?.assignmentId}/submits`,
                            )
                          }
                        >
                          Xem danh sách nộp bài
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            setIsEdit(true);
                            e.stopPropagation();
                          }}
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <></>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: assignment[0]?.content || '',
              }}
              className="pb-4 border-b markdown ql-editor"
            />
            <AnnouncementAttachList
              links={assignment[0]?.attachedLinks || []}
              files={assignment[0]?.attachments || []}
            />
            <CommentList
              comments={comments}
              handleRemoveComment={handleRemoveComment}
              handleUpdateComment={handleUpdateComment}
            />
          </CardContent>
          <CardFooter className="border-t rounded-b-lg bg-muted/50">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`flex gap-3 items-center pt-6 comment w-full ${isFocus ? 'active' : ''}`}
            >
              <Image
                src={currentUser?.avatar || '/images/avt.png'}
                height={3000}
                width={3000}
                alt="avatar"
                className="w-[35px] h-[35px] rounded-full flex-shrink-0"
              />

              <Controller
                name="content"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                    className="flex-1 !rounded-full w-full"
                    value={field.value}
                    onChange={field.onChange}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                  />
                )}
              />
              <button disabled={formState.isSubmitting}>
                <SendHorizontal />
              </button>
            </form>
          </CardFooter>
        </Card>
        <div className={`col-span-3 ${currentUser?.id === assignment[0]?.createUser?.id && 'col-span-12'}`}>
          {currentUser?.id !== assignment[0]?.createUser?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bài tập của bạn</CardTitle>
                <span className="text-sm text-green-600">{categorizeStatus(assignment[0]?.submission || null)}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment[0]?.submission ? (
                  <>
                    <Button
                      onClick={() => setIsViewSubmissionModalOpen(true)}
                      variant="outline"
                      className="justify-center w-full"
                    >
                      Xem bài đã nộp
                    </Button>
                    <Button
                      onClick={() => setIsDeleteSubmissionModalOpen(true)}
                      disabled={!isSubmissionDeletable}
                      variant="destructive"
                      className="justify-center w-full"
                    >
                      Hủy nộp bài
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="justify-start w-full" onClick={() => setIsSubmit(true)}>
                    {categorizeStatus(assignment[0]?.submission || null) === 'Trễ hạn' ? 'Hết hạn nộp bài' : 'Nộp bài'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {assignment && (
        <>
          <EditAssignmentHmWorkModal
            onOpenModal={isEdit}
            setOnOpenModal={setIsEdit}
            assignment={assignment[0]}
            setAssignments={setAssignment}
            isFinal
          />
          <SubmitAssignmentModal
            onOpenModal={isSubmit}
            setOnOpenModal={setIsSubmit}
            course={group.course}
            assignment={assignment[0]}
          />
          <ViewSubmissionModal
            onOpenModal={isViewSubmissionModalOpen}
            setOnOpenModal={setIsViewSubmissionModalOpen}
            course={group.course}
            assignment={assignment[0]}
            user={currentUser}
          />
        </>
      )}
      <CommonModal
        isOpen={isDeleteSubmissionModalOpen}
        setIsOpen={setIsDeleteSubmissionModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn hủy bài đã nộp không?"
        acceptTitle="Hủy"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleDeleteSubmission();
          setIsDeleteSubmissionModalOpen(false);
        }}
      />
    </>
  );
}
