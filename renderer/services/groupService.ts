import { ApiResponse } from '@/types';
import { API_URL } from '@/constants/endpoints';
import { IGroup, IRequest } from '@/types/group';

import configService from './configService';

const groupService = {
  getGroupById(groupId: string): Promise<ApiResponse<IGroup[]>> {
    return configService.get(`${API_URL.GROUPS}/${groupId}`);
  },
  getGroupsByCourseId(courseId: string): Promise<ApiResponse<IGroup[]>> {
    return configService.get(`${API_URL.COURSES}/${courseId}${API_URL.GROUPS}`);
  },
  createGroup(groupData: Partial<IGroup>): Promise<ApiResponse<IGroup>> {
    return configService.post(`${API_URL.GROUPS}`, groupData);
  },

  updateGroup(groupId: string, groupData: Partial<IGroup>): Promise<ApiResponse<IGroup>> {
    return configService.patch(`${API_URL.GROUPS}/${groupId}`, groupData);
  },

  deleteGroup(groupId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.GROUPS}/${groupId}`);
  },

  addMember(groupId: string, memberData: any): Promise<ApiResponse<any>> {
    return configService.post(`${API_URL.GROUPS}/${groupId}/members`, memberData);
  },

  deleteMember(groupId: string, memberId: any): Promise<ApiResponse<any>> {
    return configService.delete(`${API_URL.GROUPS}/${groupId}/members`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(memberId),
    });
  },
  setLeader(groupId: string, data: any): Promise<ApiResponse<any>> {
    return configService.post(`${API_URL.GROUPS}/${groupId}/leader`, data);
  },
  makeRequest(groupId: string): Promise<ApiResponse<IRequest>> {
    return configService.post(`${API_URL.REQUESTS}/${groupId}/make-request`);
  },
  aceptRequest(requestId: string): Promise<ApiResponse<IRequest>> {
    return configService.post(`${API_URL.REQUESTS}/${requestId}/accept-request`);
  },
  removeRequest(requestId: string): Promise<ApiResponse<IRequest>> {
    return configService.delete(`${API_URL.REQUESTS}/${requestId}/remove-request`);
  },
};

export default groupService;
