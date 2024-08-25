import { ApiResponse, IComment } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const commentService = {
  getComments(announcementId: string): Promise<ApiResponse<IComment[]>> {
    return configService.get(`${API_URL.COMMENTS}/${announcementId}`);
  },

  getCommentById(announcementId: string, commentId: string): Promise<ApiResponse<IComment>> {
    return configService.get(`${API_URL.COMMENTS}/${announcementId}/${commentId}`);
  },

  createComment(
    commentData: Omit<IComment, 'commentId' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<IComment>> {
    return configService.post(`${API_URL.COMMENTS}`, commentData);
  },

  updateComment(
    announcementId: string,
    commentId: string,
    commentData: Omit<IComment, 'commentId' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<IComment>> {
    return configService.patch(`${API_URL.COMMENTS}/${announcementId}/${commentId}`, commentData);
  },

  deleteComment(announcementId: string, commentId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.COMMENTS}/${announcementId}/${commentId}`);
  },
};

export default commentService;
