import { API_URL } from '@/constants/endpoints';
import { ApiResponse } from '@/types';
import { IProject } from '@/types/project';

import configService from './configService';

const projectService = {
  getProjects(): Promise<ApiResponse<IProject[]>> {
    return configService.get(`${API_URL.PROJECTS}`);
  },

  getProjectById(projectId: string): Promise<ApiResponse<IProject>> {
    return configService.get(`${API_URL.PROJECTS}/${projectId}`);
  },

  createProject(
    projectData: Omit<IProject, 'projectId' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ApiResponse<IProject>> {
    return configService.post(`${API_URL.PROJECTS}`, projectData);
  },

  getProjectByCourseId(courseId: string): Promise<ApiResponse<IProject[]>> {
    return configService.get(`${API_URL.COURSES}/${courseId}${API_URL.PROJECTS}`);
  },

  updateProject(projectId: string, projectData: Partial<IProject>): Promise<ApiResponse<IProject>> {
    return configService.patch(`${API_URL.PROJECTS}/${projectId}`, projectData);
  },
  deleteProject(projectId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.PROJECTS}/${projectId}`);
  },
};

export default projectService;
