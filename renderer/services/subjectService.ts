import { ApiResponse, ISubject } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const subjectService = {
  getSubjects(): Promise<ApiResponse<ISubject[]>> {
    return configService.get(`${API_URL.SUBJECTS}`);
  },

  getSubjectById(subjectId: string): Promise<ApiResponse<ISubject>> {
    return configService.get(`${API_URL.SUBJECTS}/${subjectId}`);
  },

  createSubject(subjectData: Omit<ISubject, 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ISubject>> {
    return configService.post(`${API_URL.SUBJECTS}`, subjectData);
  },

  updateSubject(
    subjectId: string,
    subjectData: Omit<ISubject, 'subjectId' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<ISubject>> {
    return configService.patch(`${API_URL.SUBJECTS}/${subjectId}`, subjectData);
  },

  deleteSubject(subjectId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.SUBJECTS}/${subjectId}`);
  },
};

export default subjectService;
