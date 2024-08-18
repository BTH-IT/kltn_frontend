import axios from 'axios';

import { BE_URL, KEY_LOCALSTORAGE } from '@/utils';

import authService from './authService';

const configService = axios.create({
  baseURL: BE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
configService.interceptors.request.use(
  function (config) {
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(KEY_LOCALSTORAGE.ACCESS_TOKEN) || ' '}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
configService.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const data = {
        token: localStorage.getItem(KEY_LOCALSTORAGE.ACCESS_TOKEN),
        refreshToken: localStorage.getItem(KEY_LOCALSTORAGE.REFRESH_TOKEN),
      };
      const res = await authService.refresh(data);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
      return configService(originalRequest);
    } else {
      if (error.response.status === 401) {
        localStorage.removeItem(KEY_LOCALSTORAGE.ACCESS_TOKEN);
        localStorage.removeItem(KEY_LOCALSTORAGE.REFRESH_TOKEN);
        localStorage.removeItem(KEY_LOCALSTORAGE.CURRENT_USER);
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default configService;
