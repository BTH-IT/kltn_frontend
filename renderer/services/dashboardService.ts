import axiosClient from './configService';

const PREFIX = '/dashboards';

const dashboardService = {
  static() {
    const url = `${PREFIX}/static`;
    return axiosClient.get(url);
  },
};

export default dashboardService;
