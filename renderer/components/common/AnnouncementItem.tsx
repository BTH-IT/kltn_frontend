/* eslint-disable no-unused-vars */
'use client';

import { EllipsisVertical, FileText, SendHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import moment from 'moment';
import Link from 'next/link';

import CommonModal from '@/components/modals/CommonModal';
import EditAnnoucementModal from '@/components/modals/EditAnnoucementModal';
import { logError } from '@/libs/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import commentService from '@/services/commentService';
import { IAnnouncement, ICourse, IComment, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

import AvatarHeader from './AvatarHeader';
import CommentList from './CommentList';
import AnnouncementAttachList from './AnnouncementAttachList';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AnnouncementItem = ({
  course,
  announcement,
  handleRemove,
  setAnnouncements,
}: {
  course: ICourse | null;
  announcement: IAnnouncement;
  handleRemove: (id: string) => void;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const currentUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null') as IUser;
  const commentInputRef = useRef<HTMLFormElement>(null);

  const [isFocus, setIsFocus] = useState(false);

  const [comments, setComments] = useState<IComment[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    setComments(announcement.comments);
  }, [announcement.comments]);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id) return;

    const trimmedContent = data.content?.replace(/<\/?[^>]+(>|$)/g, '').trim();

    if (!trimmedContent) {
      toast.error('Nội dung không được để trống hoặc chỉ chứa khoảng trắng!');
      return;
    }

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: announcement.announcementId,
      });

      reset();
      setIsFocus(false);

      setComments((prev) => [res.data, ...prev]);
      toast.success('Bình luận thành công!');
    } catch (error) {
      logError(error);
    }
  };

  const handleRemoveComment = async (id: string) => {
    try {
      await commentService.deleteComment(announcement.announcementId, id);

      setComments(comments.filter((c) => c.commentableId !== id));
    } catch (error) {
      logError(error);
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    try {
      const res = await commentService.updateComment(announcement.announcementId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
      toast.success('Sửa bình luận thành công!');
    } catch (error) {
      logError(error);
    }
  };

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

  return (
    <div className="flex flex-col gap-3 bg-white border rounded-lg">
      {announcement.type === 'assignment' ? (
        <>
          <Link
            href={announcement.url || ''}
            className="flex items-center gap-3 p-4 transition-colors duration-200 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border rounded-full">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{announcement.title}</p>
              <p className="mt-1 text-sm text-gray-500">
                {moment(announcement.createdAt).format('DD/MM/YYYY')}{' '}
                {announcement.updatedAt ? `- ${moment(announcement.updatedAt).format('DD/MM/YYYY')}` : ''}
              </p>
            </div>
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2 p-4">
            <AvatarHeader
              imageUrl={announcement?.createUser?.avatar || ''}
              name={announcement?.createUser?.fullName || announcement?.createUser?.userName || 'anonymous'}
              timestamp={announcement.createdAt}
              mentions={announcement.mentions || []}
              students={course?.students}
              dropdownMenu={
                announcement.userId === currentUser?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>Xóa</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
            />
            <div className="markdown ql-editor" dangerouslySetInnerHTML={{ __html: announcement.content }} />
            <AnnouncementAttachList links={announcement.attachedLinks || []} files={announcement.attachments || []} />
          </div>
          <div className="border-t">
            <CommentList
              comments={comments}
              handleRemoveComment={handleRemoveComment}
              handleUpdateComment={handleUpdateComment}
            />
            <form
              ref={commentInputRef}
              onSubmit={handleSubmit(onSubmit)}
              className={`flex gap-3 items-end pt-5 comment w-full px-4 pb-4 ${isFocus ? 'active' : ''}`}
            >
              <div className="flex items-start flex-1 gap-3">
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
              </div>
              <button disabled={formState.isSubmitting} className="mb-1">
                <SendHorizontal />
              </button>
            </form>
          </div>
          <CommonModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            width={400}
            height={150}
            title="Bạn có muốn xoá thông báo này không?"
            acceptTitle="Xoá"
            acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
            ocClickAccept={async () => {
              await handleRemove(announcement.announcementId);
              setIsDeleteModalOpen(false);
            }}
          />
          <EditAnnoucementModal
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
            course={course}
            announcement={announcement}
            setAnnouncements={setAnnouncements}
          />
        </>
      )}
    </div>
  );
};

export default AnnouncementItem;
