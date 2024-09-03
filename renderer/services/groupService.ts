import { ApiResponse } from '@/types';
import { API_URL } from '@/constants/endpoints';
import { IGroup } from '@/types/group';

import configService from './configService';

const groupService = {
  getGroupById(groupId: string): Promise<ApiResponse<IGroup[]>> {
    return configService.get(`${API_URL.GROUPS}/${groupId}`);
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
};
export default groupService;
