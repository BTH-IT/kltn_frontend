import { ApiResponse, IUser } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const userService = {
  getUsers(): Promise<ApiResponse<IUser[]>> {
    return configService.get(`${API_URL.USERS}`);
  },

  getUserById(userId: string): Promise<ApiResponse<IUser>> {
    return configService.get(`${API_URL.USERS}/${userId}`);
  },

  createUser(userData: Omit<IUser, 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<boolean>> {
    return configService.post(`${API_URL.USERS}`, userData);
  },

  updateUser(userId: string, userData: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return configService.patch(`${API_URL.USERS}/${userId}`, userData);
  },

  deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.USERS}/${userId}`);
  },

  getCurrentUserToken(): Promise<ApiResponse<{ token: string }>> {
    return configService.get(`${API_URL.USERS}/token`);
  },
  changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    return configService.patch(`${API_URL.USERS}/${userId}/change-password`, data);
  },
};

export default userService;
