import { ApiResponse, IComment } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const commentService = {
  getComments(announcementId: string): Promise<ApiResponse<IComment[]>> {
    return configService.get(`/comment/${announcementId}${API_URL.COMMENTS}/${announcementId}`);
  },

  getCommentById(announcementId: string, commentId: string): Promise<ApiResponse<IComment>> {
    return configService.get(`/comment/${announcementId}${API_URL.COMMENTS}/${commentId}`);
  },

  createComment(
    commentData: Omit<IComment, 'commentId' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<IComment>> {
    return configService.post(`/comment/${commentData.announcementId}${API_URL.COMMENTS}`, commentData);
  },

  updateComment(
    announcementId: string,
    commentId: string,
    commentData: Omit<IComment, 'commentId' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<IComment>> {
    return configService.patch(`/comment/${announcementId}${API_URL.COMMENTS}/${commentId}`, commentData);
  },

  deleteComment(announcementId: string, commentId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`/comment/${announcementId}${API_URL.COMMENTS}/${commentId}`);
  },
};

export default commentService;
