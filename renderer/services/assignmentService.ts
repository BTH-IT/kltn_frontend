import { IAssignment, ApiResponse } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const assignmentService = {
  getAssignments(classId: string): Promise<ApiResponse<IAssignment[]>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${classId}`);
  },

  getAssignmentById(classId: string, assignmentId: string): Promise<ApiResponse<IAssignment>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${classId}/${assignmentId}`);
  },

  createAssignment(
    assignmentData: Omit<IAssignment, 'assignmentId' | 'classes' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAssignment>> {
    return configService.post(`${API_URL.ASSIGNMENTS}`, assignmentData);
  },

  updateAssignment(
    classId: string,
    assignmentId: string,
    assignmentData: Omit<IAssignment, 'assignmentId' | 'classes' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAssignment>> {
    return configService.patch(`${API_URL.ASSIGNMENTS}/${classId}/${assignmentId}`, assignmentData);
  },

  deleteAssignment(classId: string, assignmentId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.ASSIGNMENTS}/${classId}/${assignmentId}`);
  },

  getAssignmentsByUserId(classId: string, userId: string): Promise<ApiResponse<IAssignment[] | null>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${classId}/user/${userId}`);
  },
};

export default assignmentService;
