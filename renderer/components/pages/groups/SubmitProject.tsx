/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { FileText, SendHorizontal, EllipsisVertical, User, PlusIcon, GraduationCap } from 'lucide-react';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import EditAssignmentHmWorkModal from '@/components/modals/EditAssigmentHmWorkModal';
import { API_URL } from '@/constants/endpoints';
import SubmitAssignmentModal from '@/components/modals/SubmitAssignmentModal';
import ViewSubmissionModal from '@/components/modals/ViewSubmissionModal';
import submissionService from '@/services/submissionService';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { logError } from '@/libs/utils';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function SubmitProject({ group, data }: { group: IGroup; data: IAssignment }) {
  const { setItems } = useContext(BreadcrumbContext);

  const [assignment, setAssignment] = useState<IAssignment>(data);

  useEffect(() => {
    if (!group.course) return;

    const breadcrumbLabel1 = group.course.name;
    const breadcrumbLabel2 = group.groupName;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${group.course.courseId}` },
      {
        label: 'Đồ án / Tiểu luận',
        href: `/courses/${group.course.courseId}/projects`,
      },
      {
        label: breadcrumbLabel2,
        href: `/groups/${group.course.courseId}/${group.groupId}`,
      },
      { label: 'Nộp bài' },
    ]);
  }, [group, setItems]);

  const [comments, setComments] = useState<IComment[]>([]);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const router = useRouter();
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false);
  const [isDeleteSubmissionModalOpen, setIsDeleteSubmissionModalOpen] = useState(false);
  const [isSubmissionDeletable, setIsSubmissionDeletable] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const commentInputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commentInputRef.current && !commentInputRef.current.contains(event.target as Node)) {
        setIsFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
      setUser(user ? JSON.parse(user) : null);
    }
  }, []);

  useEffect(() => {
    if (assignment) {
      setComments(assignment.comments);

      const isSubmissionDeletable = () => {
        if (!currentUser || !assignment.submission) return false;

        const isCreator = assignment.submission.createUser.id === currentUser.id;
        const isLecturer = currentUser.id === group.course.lecturerId;
        const isOverdue = assignment.dueDate ? new Date(assignment.dueDate) < new Date() : false;
        return isLecturer || (isCreator && !isOverdue);
      };

      if (isSubmissionDeletable()) {
        setIsSubmissionDeletable(true);
      }
    }
  }, [group, assignment, currentUser]);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id || !assignment) return;

    const trimmedContent = data.content?.replace(/<\/?[^>]+(>|$)/g, '').trim();

    if (!trimmedContent) {
      toast.error('Nội dung không được để trống hoặc chỉ chứa khoảng trắng!');
      return;
    }

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: assignment.assignmentId,
      });

      reset();
      setIsFocus(false);

      setComments((prev) => [res.data, ...prev]);
      toast.success('Bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  const handleRemoveComment = async (id: string) => {
    if (!assignment) return;
    try {
      await commentService.deleteComment(assignment.assignmentId, id);

      setComments(comments.filter((c) => c.commentId !== id));
      toast.success('Xóa bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    if (!assignment) return;

    const trimmedContent = data.content?.replace(/<\/?[^>]+(>|$)/g, '').trim();

    if (!trimmedContent) {
      toast.error('Nội dung không được để trống hoặc chỉ chứa khoảng trắng!');
      return;
    }

    try {
      const res = await commentService.updateComment(assignment.assignmentId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
      toast.success('Sửa bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!assignment) return;

    try {
      const res = await submissionService.deleteSubmission(
        assignment.assignmentId,
        assignment.submission?.submissionId ?? '',
      );

      if (res) {
        toast.success('Đã xóa bài tập thành công');
        router.refresh();
      }
    } catch (error) {
      logError(error);
    }
  };

  const categorizeStatus = (submission: ISubmission | null) => {
    const now = new Date();

    const dueDate = new Date(assignment?.dueDate || '');

    if (!submission) {
      if (assignment?.dueDate === null) return 'Đã giao';

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
            currentUser?.id === assignment?.createUser?.id && 'col-span-12'
          }`}
        >
          <CardHeader className="rounded-t-lg bg-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">{assignment?.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {assignment?.createUser?.fullName || 'Anonymous'} • {moment(assignment?.createdAt).fromNow()}{' '}
                    {assignment?.updatedAt ? `(Đã chỉnh sửa lúc ${moment(assignment?.updatedAt).fromNow()})` : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">Bài tập cho cột điểm: Cuối kỳ - 50%</p>
                </div>
              </div>

              <div>
                <TooltipProvider>
                  <Link
                    href={`${API_URL.COURSES}/${assignment?.courseId}${API_URL.ASSIGNMENTS}/${assignment?.assignmentId}/submits`}
                  >
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <GraduationCap className="w-6 h-6 mr-2" />
                        </TooltipTrigger>
                        <TooltipContent>Xem và chấm bài</TooltipContent>
                      </Tooltip>
                    </Button>
                  </Link>
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="rounded-full">
                  {assignment?.createUser?.id === currentUser?.id ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="cursor-pointer">
                        <EllipsisVertical className="w-6 h-6 mr-2" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto" align="end">
                        <DropdownMenuGroup>
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
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: assignment?.content || '',
              }}
              className="pb-4 border-b markdown ql-editor"
            />
            <AnnouncementAttachList links={assignment?.attachedLinks || []} files={assignment?.attachments || []} />
            <CommentList
              comments={comments}
              handleRemoveComment={handleRemoveComment}
              handleUpdateComment={handleUpdateComment}
            />
          </CardContent>
          <CardFooter className="border-t rounded-b-lg bg-muted/50">
            <form
              ref={commentInputRef}
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
                  />
                )}
              />
              <button disabled={formState.isSubmitting}>
                <SendHorizontal />
              </button>
            </form>
          </CardFooter>
        </Card>
        <div className={`col-span-3 ${currentUser?.id === assignment?.createUser?.id && 'col-span-12'}`}>
          {currentUser?.id !== assignment?.createUser?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bài tập của bạn</CardTitle>
                <span className="text-sm text-green-600">{categorizeStatus(assignment?.submission || null)}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment?.submission ? (
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
                    {categorizeStatus(assignment?.submission || null) === 'Trễ hạn' ? 'Hết hạn nộp bài' : 'Nộp bài'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {assignment && (
        <>
          <EditAssignmentHmWorkModal onOpenModal={isEdit} setOnOpenModal={setIsEdit} assignment={assignment} isFinal />
          <SubmitAssignmentModal
            onOpenModal={isSubmit}
            setOnOpenModal={setIsSubmit}
            course={group.course}
            assignment={assignment}
            setAssignment={setAssignment}
          />
          <ViewSubmissionModal
            onOpenModal={isViewSubmissionModalOpen}
            setOnOpenModal={setIsViewSubmissionModalOpen}
            course={group.course}
            assignment={assignment}
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
