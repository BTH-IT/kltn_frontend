import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IBrief } from '@/types';

import configService from './configService';

const briefService = {
  getBriefs(groupId: string): Promise<ApiResponse<IBrief[]>> {
    return configService.get(`${API_URL.BRIEFS}/${groupId}/brief`);
  },

  createBrief(groupId: string, briefData: Partial<IBrief>): Promise<ApiResponse<IBrief>> {
    return configService.post(`${API_URL.BRIEFS}/${groupId}/brief`, briefData);
  },

  updateBrief(groupId: string, briefId: string, briefData: Partial<IBrief>): Promise<ApiResponse<IBrief>> {
    return configService.patch(`${API_URL.BRIEFS}/${groupId}/brief/${briefId}`, briefData);
  },

  deleteBrief(groupId: string, briefId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.BRIEFS}/${groupId}/brief/${briefId}`);
  },
};

export default briefService;
