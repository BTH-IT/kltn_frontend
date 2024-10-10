import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IBrief } from '@/types';

import configService from './configService';

const briefService = {
  getBriefs(groupId: string): Promise<ApiResponse<IBrief[]>> {
    return configService.get(`${API_URL.SUBMISSIONS}/${groupId}`);
  },

  getBriefById(groupId: string, briefId: string): Promise<ApiResponse<IBrief>> {
    return configService.get(`${API_URL.SUBMISSIONS}/${groupId}${API_URL.SUBMISSIONS}/${briefId}`);
  },

  createBrief(groupId: string, briefData: Partial<IBrief>): Promise<ApiResponse<IBrief>> {
    return configService.post(`${API_URL.SUBMISSIONS}/${groupId}${API_URL.SUBMISSIONS}`, briefData);
  },

  updateBrief(groupId: string, briefId: string, briefData: Partial<IBrief>): Promise<ApiResponse<IBrief>> {
    return configService.patch(`${API_URL.SUBMISSIONS}/${groupId}${API_URL.SUBMISSIONS}/${briefId}`, briefData);
  },

  deleteBrief(groupId: string, briefId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.SUBMISSIONS}/${groupId}${API_URL.SUBMISSIONS}/${briefId}`);
  },
};

export default briefService;
