import { API_URL } from '@/constants/endpoints';
import { IAssignment } from '@/types/assignment';
import { ApiResponse, ISubmissionList } from '@/types';

import configService from './configService';

const assignmentService = {
  getAssignments(courseId: string): Promise<ApiResponse<IAssignment[]>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${courseId}`);
  },

  getAssignmentById(courseId: string, assignmentId: string): Promise<ApiResponse<IAssignment>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${courseId}/${assignmentId}`);
  },

  getAssignment(assignmentId: string): Promise<ApiResponse<IAssignment>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${assignmentId}`);
  },

  getSubmissionsById(assignmentId: string): Promise<ApiResponse<ISubmissionList[]>> {
    return configService.get(`${API_URL.ASSIGNMENTS}/${assignmentId}${API_URL.SUBMISSIONS}`);
  },

  createAssignment(assignmentData: Partial<IAssignment>): Promise<ApiResponse<IAssignment>> {
    return configService.post(`${API_URL.ASSIGNMENTS}`, assignmentData);
  },

  updateAssignment(assignmentId: string, assignmentData: Partial<IAssignment>): Promise<ApiResponse<IAssignment>> {
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
