import { API_URL } from '@/constants/endpoints';

import configService from './configService';
import { ApiResponse } from '@/types';
import { ISemester } from '@/types/semester';

const semesterService = {
  getSemesters(): Promise<ApiResponse<ISemester[]>> {
    return configService.get(`${API_URL.SEMESTERS}`);
  },

  getSemesterById(semesterId: string): Promise<ApiResponse<ISemester>> {
    return configService.get(`${API_URL.SEMESTERS}/${semesterId}`);
  },

  createSemester(
    semesterData: Omit<ISemester, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<ISemester>> {
    return configService.post(`${API_URL.SEMESTERS}`, semesterData);
  },

  updateSemester(
    semesterId: string,
    semesterData: Omit<ISemester, 'semesterId' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<ISemester>> {
    return configService.patch(`${API_URL.SEMESTERS}/${semesterId}`, semesterData);
  },
  updateSemesterNew(
    semesterId: string,
    semesterData: Omit<ISemester, 'semesterId' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<ISemester>> {
    return configService.put(`${API_URL.SEMESTERS}/${semesterId}`, semesterData);
  },
  deleteSemester(semesterId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.SEMESTERS}/${semesterId}`);
  },
};

export default semesterService;
