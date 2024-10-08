import { API_URL } from '@/constants/endpoints';
import { ApiResponse, ISubmission } from '@/types';

import configService from './configService';

const submissionService = {
  getSubmissions(assignmentId: string): Promise<ApiResponse<ISubmission[]>> {
    return configService.get(`${API_URL.SUBMISSIONS}/${assignmentId}`);
  },

  getSubmissionById(assignmentId: string, submissionId: string): Promise<ApiResponse<ISubmission>> {
    return configService.get(`${API_URL.SUBMISSIONS}/${assignmentId}${API_URL.SUBMISSIONS}/${submissionId}`);
  },

  createSubmission(assignmentId: string, submissionData: Partial<ISubmission>): Promise<ApiResponse<ISubmission>> {
    return configService.post(`${API_URL.SUBMISSIONS}/${assignmentId}${API_URL.SUBMISSIONS}`, submissionData);
  },

  updateSubmission(
    assignmentId: string,
    submissionId: string,
    submissionData: Partial<ISubmission>,
  ): Promise<ApiResponse<ISubmission>> {
    return configService.patch(
      `${API_URL.SUBMISSIONS}/${assignmentId}${API_URL.SUBMISSIONS}/${submissionId}`,
      submissionData,
    );
  },

  deleteSubmission(assignmentId: string, submissionId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.SUBMISSIONS}/${assignmentId}${API_URL.SUBMISSIONS}/${submissionId}`);
  },
};

export default submissionService;
