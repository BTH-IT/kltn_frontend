'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { IReport, IUser } from '@/types';
import commentService from '@/services/commentService';
import { logError } from '@/libs/utils';

import CommentList from './CommentList';
import CommentInput from './CommentInput';

const ReportCommentList = ({ report, currentUser }: { report: IReport; currentUser: IUser | null }) => {
  const [comments, setComments] = React.useState(report.comments);

  useEffect(() => {
    setComments(report.comments);
  }, [report]);

  const handleRemoveComment = async (id: string) => {
    if (!report) return;
    try {
      await commentService.deleteComment(report.reportId, id);

      setComments(comments.filter((c) => c.commentId !== id));
      toast.success('Xóa bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  const handleUpdateComment = async (id: string, data: any) => {
    if (!report) return;
    try {
      const trimmedContent = data.content?.replace(/<\/?[^>]+(>|$)/g, '').trim();

      if (!trimmedContent) {
        toast.error('Nội dung không được để trống hoặc chỉ chứa khoảng trắng!');
        return;
      }

      const res = await commentService.updateComment(report.reportId, id, data);

      const updatedComments = comments.map((a) => (a.commentId === res.data.commentId ? { ...a, ...res.data } : a));

      setComments(updatedComments);
      toast.success('Sửa bình luận thành công');
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <CommentList
        title="báo cáo"
        comments={comments}
        handleRemoveComment={handleRemoveComment}
        handleUpdateComment={handleUpdateComment}
      />
      <CommentInput
        currentUser={currentUser}
        comments={comments}
        setComments={setComments}
        commentableId={report.reportId}
      />
    </>
  );
};

export default ReportCommentList;
