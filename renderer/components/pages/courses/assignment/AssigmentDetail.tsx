/* eslint-disable no-unused-vars */
'use client';

import { useContext, useEffect, useState } from 'react';
import { FileText, MoreVertical, Image as ImageIcon, SendHorizontal, EllipsisVertical } from 'lucide-react';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import ReactQuill from 'react-quill';

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

export default function AssignmentDetail() {
  const { assignment } = useContext(AssignmentContext);

  const [comments, setComments] = useState<IComment[]>([]);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    if (assignment) {
      setComments(assignment.comments);
    }
  }, [assignment]);

  useEffect(() => {
    const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
    setUser(user ? JSON.parse(user) : null);
  }, []);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id || !assignment) return;

    try {
      const res = await commentService.createComment({
        content: data.content,
        userId: currentUser.id,
        announcementId: assignment.assignmentId,
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

  const handleRemove = async (id: string) => {
    if (!assignment) return;
    try {
      await commentService.deleteComment(assignment.assignmentId, id);

      setComments(comments.filter((c) => c.commentId !== id));
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
    <Card className="border-none shadow-lg">
      <CardHeader className="rounded-t-lg bg-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">{assignment?.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Biện Thành Hưng • {moment(assignment?.createdAt).fromNow()}{' '}
                {assignment?.updatedAt ? `(Đã chỉnh sửa lúc ${moment(assignment?.updatedAt).fromNow()})` : ''}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            {assignment?.user?.id === currentUser?.id ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto" align="end">
                  <DropdownMenuGroup>
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
      <CardContent className="pt-6">
        <div
          dangerouslySetInnerHTML={{
            __html: assignment?.content || '',
          }}
        />
      </CardContent>
      <CardFooter className="border-t rounded-b-lg bg-muted/50">
        <CommentList
          comments={comments}
          handleRemoveComment={handleRemoveComment}
          handleUpdateComment={handleUpdateComment}
        />
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
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có muốn xoá thông báo này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemove(assignment?.assignmentId || '');
          setIsDeleteModalOpen(false);
        }}
      />
    </Card>
  );
}
