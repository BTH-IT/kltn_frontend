import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IClasses } from '@/types';

import { http } from '../http';

const classRequest = {
  getList: () => http.get<ApiResponse<IClasses[]>>(`${API_URL.CLASSES}`),
  getDetail: (id: string) =>
    http.get<ApiResponse<IClasses>>(`${API_URL.CLASSES}/${id}`, {
      cache: 'no-store',
    }),
  create: (body: Omit<IClasses, 'classId' | 'students' | 'subject' | 'announcements' | 'createdAt' | 'updatedAt'>) =>
    http.post<ApiResponse<IClasses>>(`${API_URL.CLASSES}`, body),
  update: (
    id: string,
    body: Omit<IClasses, 'classId' | 'students' | 'subject' | 'announcements' | 'createdAt' | 'updatedAt'>,
  ) => http.patch<ApiResponse<IClasses>>(`${API_URL.CLASSES}/${id}`, body),
  delete: (id: string) => http.delete<ApiResponse<boolean>>(`${API_URL.CLASSES}/${id}`),
};

export default classRequest;
