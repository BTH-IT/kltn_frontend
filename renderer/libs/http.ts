import { fetcher } from '@/actions';

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface CustomOptions {
  body?: any;
}

export const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return fetcher<Response>(url, 'GET', options);
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return fetcher<Response>(url, 'POST', { ...options, body });
  },
  patch<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return fetcher<Response>(url, 'PATCH', { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return fetcher<Response>(url, 'DELETE', options);
  },
};
