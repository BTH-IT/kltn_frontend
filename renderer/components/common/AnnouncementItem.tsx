/* eslint-disable no-unused-vars */
'use client';

import { EllipsisVertical, SendHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import CommonModal from '@/components/modals/CommonModal';
import EditAnnoucementModal from '@/components/modals/EditAnnoucementModal';
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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AnnouncementItem = ({
  course,
  announcement,
  handlePin,
  handleRemove,
  setAnnouncements,
}: {
  course: ICourse | null;
  announcement: IAnnouncement;
  handlePin: (announcement: IAnnouncement) => void;
  handleRemove: (id: string) => void;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const currentUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;

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

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: announcement.announcementId,
      });

      reset();
      setIsFocus(false);

      setComments((prev) => [res.data, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveComment = async (id: string) => {
    try {
      await commentService.deleteComment(announcement.announcementId, id);

      setComments(comments.filter((c) => c.commentableId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    try {
      const res = await commentService.updateComment(announcement.announcementId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white border rounded-lg">
      <div className="flex flex-col gap-2 p-4">
        <AvatarHeader
          imageUrl={announcement?.createUser?.avatar || ''}
          name={announcement?.createUser?.fullName || announcement?.createUser?.userName || 'anonymous'}
          timestamp={announcement.createdAt}
          mentions={announcement.mentions || []}
          students={course?.students}
          dropdownMenu={
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto" align="end">
                <DropdownMenuGroup>
                  {announcement.userId === currentUser?.id && (
                    <>
                      <DropdownMenuItem onClick={() => handlePin(announcement)}>Chuyển lên đầu</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>Xóa</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>Sao chép liên kết</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  onBlur={() => setIsFocus(false)}
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
    </div>
  );
};

export default AnnouncementItem;
