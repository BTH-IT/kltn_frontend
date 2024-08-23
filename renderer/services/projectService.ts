import { API_URL } from '@/constants/endpoints';
import { ApiResponse } from '@/types';
import { IProject } from '@/types/project';

import configService from './configService';

const projectService = {
  getProjects(): Promise<ApiResponse<IProject[]>> {
    return configService.get(`${API_URL.SEMESTERS}`);
  },

  getProjectById(projectId: string): Promise<ApiResponse<IProject>> {
    return configService.get(`${API_URL.SEMESTERS}/${projectId}`);
  },

  createProject(
    projectData: Omit<
      IProject,
      'projectId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createUserId' | 'isApproved' | 'subjectId'
    >,
  ): Promise<ApiResponse<IProject>> {
    return configService.post(`${API_URL.SEMESTERS}`, projectData);
  },

  updateProject(
    projectId: string,
    projectData: Omit<IProject, 'projectId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createUserId'>,
  ): Promise<ApiResponse<IProject>> {
    return configService.patch(`${API_URL.SEMESTERS}/${projectId}`, projectData);
  },
  updateProjectNew(
    projectId: string,
    projectData: Omit<
      IProject,
      'projectId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createUserId' | 'isApproved' | 'subjectId'
    >,
  ): Promise<ApiResponse<IProject>> {
    return configService.put(`${API_URL.SEMESTERS}/${projectId}`, projectData);
  },
  deleteProject(projectId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.SEMESTERS}/${projectId}`);
  },
};

export default projectService;
