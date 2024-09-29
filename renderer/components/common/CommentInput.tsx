'use client';

import { SendHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import commentService from '@/services/commentService';
import { IComment, IUser } from '@/types';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CommentInput = ({
  currentUser,
  commentableId,
  setComments,
  comments,
}: {
  currentUser: IUser | null;
  commentableId: string;
  comments: IComment[];
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}) => {
  const [isFocus, setIsFocus] = React.useState(false);
  const { control, handleSubmit, reset, formState } = useForm();

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  const onSubmit = async (data: any) => {
    if (!currentUser?.id) return;

    try {
      const res = await commentService.createComment({
        content: data.content,
        commentableId: commentableId,
      });

      reset();
      setIsFocus(false);

      setComments((prev) => [res.data, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex gap-3 items-center p-4 comment ${isFocus ? 'active' : ''}`}
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
            className="flex-1 !rounded-full"
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
  );
};

export default CommentInput;
