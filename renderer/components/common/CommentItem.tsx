/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { IComment, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { logError } from '@/libs/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import CommonModal from '../modals/CommonModal';

import AvatarHeader from './AvatarHeader';
import Button from './Button';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const CommentItem = ({
  comment,
  handleRemoveComment,
  handleUpdateComment,
}: {
  comment: IComment;
  handleRemoveComment: (id: string) => void;
  handleUpdateComment: (id: string, data: any) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const trimmedContent = values.content?.replace(/<\/?[^>]+(>|$)/g, '').trim();

      if (!trimmedContent) {
        toast.error('Nội dung không được để trống hoặc chỉ chứa khoảng trắng!');
        return;
      }

      await handleUpdateComment(comment.commentId, values);

      reset();
      setIsEdit(false);
      toast.success('Sửa bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <AvatarHeader
        imageUrl={comment.user?.avatar || ''}
        name={comment.user?.fullName || comment.user?.userName || 'anonymous'}
        timestamp={comment.createdAt}
        type="comment"
        dropdownMenu={
          user?.id === comment.userId ? (
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
          )
        }
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 py-4">
            <Controller
              name="content"
              control={control}
              defaultValue={comment.content}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                />
              )}
            />
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={() => {
                  setIsEdit(false);
                  reset();
                }}
                disabled={formState.isSubmitting}
              >
                Hủy
              </Button>
              <Button
                buttonType="primary"
                type="submit"
                disabled={formState.isSubmitting}
                className="flex items-center gap-3"
              >
                {formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Lưu
              </Button>
            </div>
          </form>
        ) : (
          <div className="markdown ql-editor" dangerouslySetInnerHTML={{ __html: comment.content }} />
        )}
      </AvatarHeader>
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có muốn xoá thông báo này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemoveComment(comment.commentId);
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default CommentItem;
