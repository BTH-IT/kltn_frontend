/* eslint-disable no-undef */
import { redirect } from 'next/navigation';

import request from './actions';

export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, {
      ...options,
      next: { revalidate: 10 },
    });
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, {
      ...options,
      body,
      next: { revalidate: 10 },
    });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, {
      ...options,
      body,
      next: { revalidate: 10 },
    });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, {
      ...options,
      next: { revalidate: 10 },
    });
  },
};

export const handleRefreshToken = async (token: string | undefined, refreshToken: string | undefined) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/refresh-token`, {
      method: 'POST',
      body: JSON.stringify({ token, refreshToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Token refresh failed with status: ${res.status}`);
      console.error(`Response text: ${await res.text()}`);
      throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    if (!data.success) {
      console.error('Token refresh unsuccessful:', data.message);
      redirect('/login');
    }

    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    redirect('/login');
  }
};

export default http;
