import axiosClient from './configService';

const PREFIX = '/accounts';

const authService = {
  login(data: any) {
    const url = `${PREFIX}/login`;
    return axiosClient.post(url, data);
  },
  register(data: any) {
    const url = `${PREFIX}/register`;
    return axiosClient.post(url, data);
  },
  changePassword(data: { email: string; oldPassword: string; newPassword: string }) {
    const url = `${PREFIX}/change-password`;

    return axiosClient.post(url, data);
  },
  getProfile() {
    const url = `${PREFIX}/profile`;
    return axiosClient.get(url);
  },
  refresh(data: any) {
    const url = `${PREFIX}/refresh-token`;
    return axiosClient.post(url, data);
  },
};

export default authService;
