import { API_URL } from '@/constants/endpoints';
import { IAssignment } from '@/types/assignment';
import { ApiResponse } from '@/types';

import configService from './configService';

const assignmentService = {
  getAssignments(classId: string): Promise<ApiResponse<IAssignment[]>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${classId}`);
  },

  getAssignmentById(classId: string, assignmentId: string): Promise<ApiResponse<IAssignment>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${classId}/${assignmentId}`);
  },

  createAssignment(
    assignmentData: Omit<IAssignment, 'assignmentId' | 'course' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAssignment>> {
    return configService.post(`${API_URL.ASSIGNMENTS}`, assignmentData);
  },

  updateAssignment(
    assignmentId: string,
    assignmentData: Omit<IAssignment, 'assignmentId' | 'course' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAssignment>> {
    return configService.patch(`${API_URL.ASSIGNMENTS}/${assignmentId}`, assignmentData);
  },

  deleteAssignment(assignmentId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.ASSIGNMENTS}/${assignmentId}`);
  },

  getAssignmentsByUserId(courseId: string, userId: string): Promise<ApiResponse<IAssignment[] | null>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${courseId}/user/${userId}`);
  },
};

export default assignmentService;
