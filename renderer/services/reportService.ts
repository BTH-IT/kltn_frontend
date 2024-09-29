import { IReport, ApiResponse } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const reportService = {
  getReports(groupId: string): Promise<ApiResponse<IReport[]>> {
    return configService.get(`${API_URL.GROUPS}/${groupId}/report`);
  },

  getReportById(groupId: string, reportId: string): Promise<ApiResponse<IReport>> {
    return configService.get(`${API_URL.REPORTS}/${groupId}/report/${reportId}`);
  },

  createReport(groupId: string, reportData: Partial<IReport>): Promise<ApiResponse<IReport>> {
    return configService.post(`${API_URL.REPORTS}/${groupId}/report`, reportData);
  },

  updateReport(groupId: string, reportId: string, reportData: Partial<IReport>): Promise<ApiResponse<IReport>> {
    return configService.patch(`${API_URL.REPORTS}/${groupId}/report/${reportId}`, reportData);
  },

  deleteReport(groupId: string, reportId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.REPORTS}/${groupId}/report/${reportId}`);
  },
};

export default reportService;
