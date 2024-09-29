/* eslint-disable no-unused-vars */
import { Users } from 'lucide-react';
import React from 'react';

import { IComment } from '@/types';

import CommentItem from './CommentItem';

const CommentList = ({
  comments,
  title = 'lớp học',
  handleRemoveComment,
  handleUpdateComment,
}: {
  title?: string;
  comments: IComment[];
  handleRemoveComment: (id: string) => void;
  handleUpdateComment: (id: string, data: any) => void;
}) => {
  return comments?.length > 0 ? (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-2 items-center text-[#5F6368] ml-1">
        <Users className="w-[22px] h-[22px]" />
        <span className="text-sm font-semibold">
          {comments.length} nhận xét về {title.toLocaleLowerCase()}
        </span>
      </div>
      {comments.map((c, idx) => (
        <CommentItem
          key={idx}
          comment={c}
          handleRemoveComment={handleRemoveComment}
          handleUpdateComment={handleUpdateComment}
        />
      ))}
    </div>
  ) : (
    <></>
  );
};

export default CommentList;
