import { ApiResponse, ICourse } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const courseService = {
  getCourses(): Promise<ApiResponse<ICourse[]>> {
    return configService.get(`${API_URL.COURSES}`);
  },

  getCourseById(courseId: string): Promise<ApiResponse<ICourse>> {
    return configService.get(`${API_URL.COURSES}/${courseId}`);
  },

  getCoursesByUser(): Promise<
    ApiResponse<{
      [key: string]: ICourse[];
    }>
  > {
    return configService.get(`${API_URL.ACCOUNTS}${API_URL.COURSES}`);
  },

  getCoursesByUserAndInviteCode(userId: string, inviteCode: string): Promise<ApiResponse<ICourse | null>> {
    return configService.get(`${API_URL.COURSES}/user/${userId}/${inviteCode}`);
  },

  createCourse(courseData: Partial<ICourse>): Promise<ApiResponse<ICourse>> {
    return configService.post(`${API_URL.COURSES}`, courseData);
  },

  updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ApiResponse<ICourse>> {
    return configService.patch(`${API_URL.COURSES}/${courseId}`, courseData);
  },

  updateCourseInviteCode(courseId: string): Promise<ApiResponse<string>> {
    return configService.get(`${API_URL.COURSES}/${courseId}/regeneratecode`);
  },

  deleteCourse(courseId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.COURSES}/${courseId}`);
  },

  addStudentToCourse(courseId: string, userId: string): Promise<ApiResponse<boolean>> {
    return configService.post(`${API_URL.COURSES}/${courseId}/student`, {
      userId,
    });
  },

  deleteStudentOfCourse(courseId: string, userId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.COURSES}/${courseId}/student/${userId}`);
  },

  addStudentToCourseByInviteCode(inviteCode: string): Promise<ApiResponse<ICourse | null>> {
    return configService.post(`${API_URL.COURSES}/invite/${inviteCode}`);
  },

  getCourseByInviteCode(inviteCode: string): Promise<ApiResponse<ICourse | null>> {
    return configService.get(`${API_URL.COURSES}/invite/${inviteCode}`);
  },

  getTeacherId(courseId: string): Promise<ApiResponse<string>> {
    return configService.get(`${API_URL.COURSES}/${courseId}/teacher`);
  },
};

export default courseService;
