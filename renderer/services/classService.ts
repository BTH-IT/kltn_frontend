import { ApiResponse, IClasses } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const classService = {
  getClasses(): Promise<ApiResponse<IClasses[]>> {
    return configService.get(`${API_URL.CLASSES}`);
  },

  getClassById(classId: string): Promise<ApiResponse<IClasses>> {
    return configService.get(`${API_URL.CLASSES}/${classId}`);
  },

  getClassesByUser(userId: string): Promise<
    ApiResponse<{
      [key: string]: IClasses[];
    }>
  > {
    return configService.get(`${API_URL.CLASSES}/user/${userId}`);
  },

  getClassesByUserAndInviteCode(userId: string, inviteCode: string): Promise<ApiResponse<IClasses | null>> {
    return configService.get(`${API_URL.CLASSES}/user/${userId}/${inviteCode}`);
  },

  createClass(
    classData: Omit<
      IClasses,
      'classId' | 'students' | 'subject' | 'scoreStructure' | 'announcements' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<ApiResponse<IClasses>> {
    return configService.post(`${API_URL.CLASSES}`, classData);
  },

  updateClass(classId: string, classData: Partial<IClasses>): Promise<ApiResponse<IClasses>> {
    return configService.patch(`${API_URL.CLASSES}/${classId}`, classData);
  },

  updateClassInviteCode(inviteCode: string): Promise<ApiResponse<{ inviteCode: string }>> {
    return configService.patch(`${API_URL.CLASSES}/invite/${inviteCode}`);
  },

  deleteClass(classId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.CLASSES}/${classId}`);
  },

  addStudentToClass(classId: string, userId: string): Promise<ApiResponse<boolean>> {
    return configService.post(`${API_URL.CLASSES}/${classId}/student`, {
      userId,
    });
  },

  deleteStudentOfClass(classId: string, userId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.CLASSES}/${classId}/student/${userId}`);
  },

  addStudentToClassByInviteCode(inviteCode: string): Promise<ApiResponse<IClasses | null>> {
    return configService.post(`${API_URL.CLASSES}/invite/${inviteCode}`);
  },

  getClassByInviteCode(inviteCode: string): Promise<ApiResponse<IClasses | null>> {
    return configService.get(`${API_URL.CLASSES}/invite/${inviteCode}`);
  },

  getTeacherId(classId: string): Promise<ApiResponse<string>> {
    return configService.get(`${API_URL.CLASSES}/${classId}/teacher`);
  },
};

export default classService;
