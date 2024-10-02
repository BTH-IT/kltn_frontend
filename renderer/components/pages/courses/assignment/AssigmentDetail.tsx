/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { FileText, SendHorizontal, EllipsisVertical, User, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import CommentList from '@/components/common/CommentList';
import { IComment, IUser } from '@/types';
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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AssignmentDetail() {
  const { assignment } = useContext(AssignmentContext);

  const [comments, setComments] = useState<IComment[]>([]);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    if (assignment) {
      setComments(assignment.comments);
    }
  }, [assignment]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
      setUser(user ? JSON.parse(user) : null);
    }
  }, []);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id || !assignment) return;

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: assignment.assignmentId,
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
      await commentService.deleteComment(assignment.assignmentId, id);

      setComments(comments.filter((c) => c.commentId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    if (!assignment) return;
    try {
      await assignmentService.deleteAssignment(assignment.assignmentId);

      router.push(`/courses/${assignment.courseId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    if (!assignment) return;
    try {
      const res = await commentService.updateComment(assignment.assignmentId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-8">
        <Card className="col-span-9 border-none shadow-lg">
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
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                {assignment?.createUser?.id === currentUser?.id ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `${API_URL.COURSES}/${assignment?.courseId}${API_URL.ASSIGNMENTS}/${assignment?.assignmentId}/submits`,
                            )
                          }
                        >
                          Xem danh sách nộp bài
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsEdit(true)}>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>Xóa</DropdownMenuItem>
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
                __html: assignment?.content || '',
              }}
              className="pb-4 border-b"
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
        <div className="col-span-3">
          {currentUser?.id === assignment?.createUser?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bài tập của bạn</CardTitle>
                <span className="text-sm text-green-600">Đã giao</span>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="justify-start w-full" onClick={() => setIsSubmit(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm bài tập vào đây
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {assignment && (
        <EditAssignmentHmWorkModal
          onOpenModal={isEdit}
          setOnOpenModal={setIsEdit}
          course={assignment.course}
          assignment={assignment}
        />
      )}
      {assignment && (
        <SubmitAssignmentModal
          onOpenModal={isSubmit}
          setOnOpenModal={setIsSubmit}
          course={assignment.course}
          assignment={assignment}
        />
      )}
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có chắc muốn xoá bài tập này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemove();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
}
