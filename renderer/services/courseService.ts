import { ApiResponse, IAssignment, ICourse, ISetting } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const courseService = {
  getCourses(): Promise<ApiResponse<ICourse[]>> {
    return configService.get(`${API_URL.COURSES}`);
  },

  getStats(courseId: string): Promise<ApiResponse<any>> {
    return configService.get(`${API_URL.COURSES}/${courseId}/statistic`);
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

  deleteStudentOfCourse(courseId: string, userId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.COURSES}/${courseId}/students`, {
      data: { studentId: userId },
    });
  },

  addStudents(courseId: string, emails: string[]): Promise<ApiResponse<boolean>> {
    return configService.post(`${API_URL.COURSES}/${courseId}/students`, {
      emails,
    });
  },

  deleteStudentsOfCourse(courseId: string, userIds: string[]): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.COURSES}/${courseId}/students/multiple`, {
      data: userIds,
    });
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

  changeSetting(courseId: string, data: Partial<ISetting>): Promise<ApiResponse<ISetting>> {
    return configService.post(`${API_URL.SETTINGS}/${courseId}/settings`, data);
  },
  getEndTerm(courseId: string): Promise<ApiResponse<IAssignment>> {
    return configService.get(`${API_URL.COURSES}/${courseId}/end-term`);
  },
};

export default courseService;
