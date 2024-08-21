/* eslint-disable no-undef */
import { redirect } from 'next/navigation';

import request from './actions';

export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options);
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options });
  },
};

export const handleRefreshToken = async (token: string | undefined, refreshToken: string | undefined) => {
  try {
    const res = await fetch('http://localhost:8888/api/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ token, refreshToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    if (!data.success) {
      redirect('/login');
    }

    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    redirect('/login');
  }
};

export default http;
