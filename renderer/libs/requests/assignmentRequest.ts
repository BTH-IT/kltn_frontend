import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IAssignment } from '@/types';

import { http } from '../http';

const assignmentRequest = {
  getList: () => http.get<ApiResponse<IAssignment[]>>(`${API_URL.ASSIGNMENTS}`),
  getDetail: (classid: string, assignmentId: string) =>
    http.get<ApiResponse<IAssignment>>(`${API_URL.ASSIGNMENTS}/${classid}/${assignmentId}`, {
      cache: 'no-store',
    }),
  create: (body: Omit<IAssignment, 'assignmentId' | 'classes' | 'createdAt' | 'updatedAt'>) =>
    http.post<ApiResponse<IAssignment>>(`${API_URL.ASSIGNMENTS}`, body),
  update: (
    classid: string,
    assignmentId: string,
    body: Omit<IAssignment, 'assignmentId' | 'classes' | 'createdAt' | 'updatedAt'>,
  ) => http.patch<ApiResponse<IAssignment>>(`${API_URL.ASSIGNMENTS}/${classid}/${assignmentId}`, body),
  delete: (classid: string, assignmentId: string) =>
    http.delete<ApiResponse<boolean>>(`${API_URL.ASSIGNMENTS}/${classid}/${assignmentId}`),
};

export default assignmentRequest;
