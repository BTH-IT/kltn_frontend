import { IAnnouncement, ApiResponse } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const announcementService = {
  getAnnouncements(classId: string): Promise<ApiResponse<IAnnouncement[]>> {
    return configService.get(`${API_URL.ANNOUNCEMENTS}/${classId}`);
  },

  getAnnouncementById(classId: string, announcementId: string): Promise<ApiResponse<IAnnouncement>> {
    return configService.get(`${API_URL.ANNOUNCEMENTS}/${classId}/${announcementId}`);
  },

  createAnnouncement(
    announcementData: Omit<IAnnouncement, 'announcementId' | 'pin' | 'user' | 'comments' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAnnouncement>> {
    return configService.post(`${API_URL.ANNOUNCEMENTS}`, announcementData);
  },

  updateAnnouncement(
    classId: string,
    announcementId: string,
    announcementData: Omit<IAnnouncement, 'announcementId' | 'user' | 'comments' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IAnnouncement>> {
    return configService.patch(`${API_URL.ANNOUNCEMENTS}/${classId}/${announcementId}`, announcementData);
  },

  deleteAnnouncement(classId: string, announcementId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.ANNOUNCEMENTS}/${classId}/${announcementId}`);
  },
};

export default announcementService;
