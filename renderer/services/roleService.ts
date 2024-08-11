import { ApiResponse, IRole } from '@/types';
import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const roleService = {
  getRoles(): Promise<ApiResponse<IRole[]>> {
    return configService.get(`${API_URL.ROLES}`);
  },

  getRoleById(roleId: string): Promise<ApiResponse<IRole>> {
    return configService.get(`${API_URL.ROLES}/${roleId}`);
  },

  createRole(
    role: Omit<IRole, 'roleId' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<boolean>> {
    return configService.post(`${API_URL.ROLES}`, role);
  },

  updateRole(
    roleId: string,
    role: Omit<IRole, 'roleId' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<boolean>> {
    return configService.patch(`${API_URL.ROLES}/${roleId}`, role);
  },

  deleteRole(roleId: string): Promise<ApiResponse<boolean>> {
    return configService.delete(`${API_URL.ROLES}/${roleId}`);
  },
};

export default roleService;
