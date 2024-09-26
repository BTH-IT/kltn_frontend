import { ApiResponse, IComment } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const commentService = {
  getComments(commentableId: string): Promise<ApiResponse<IComment[]>> {
    return configService.get(`/comment/${commentableId}${API_URL.COMMENTS}/${commentableId}`);
  },

  getCommentById(commentableId: string, commentId: string): Promise<ApiResponse<IComment>> {
    return configService.get(`/comment/${commentableId}${API_URL.COMMENTS}/${commentId}`);
  },

  createComment(commentData: Partial<IComment>): Promise<ApiResponse<IComment>> {
    return configService.post(`/comment/${commentData.commentableId}${API_URL.COMMENTS}`, commentData);
  },

  updateComment(
    commentableId: string,
    commentId: string,
    commentData: Partial<IComment>,
  ): Promise<ApiResponse<IComment>> {
    return configService.patch(`/comment/${commentableId}${API_URL.COMMENTS}/${commentId}`, commentData);
  },

  deleteComment(commentableId: string, commentId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`/comment/${commentableId}${API_URL.COMMENTS}/${commentId}`);
  },
};

export default commentService;
