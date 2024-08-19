import { redirect } from 'next/navigation';
/* eslint-disable no-undef */
import { cookies } from 'next/headers';

import { KEY_LOCALSTORAGE } from '@/utils';
import { ApiResponse } from '@/types';

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined;
};

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error');
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined,
): Promise<{ status: number; payload: ApiResponse<Response> }> => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const cookieStore = cookies();

  const baseHeaders: { [key: string]: string } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        };

  const accessToken = cookieStore.get(KEY_LOCALSTORAGE.ACCESS_TOKEN)?.value;
  if (accessToken) {
    baseHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const baseUrl = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL;

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  let res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  let payload: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      payload = await res.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Failed to parse JSON response');
    }
  }

  let data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        },
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      await handleRefreshToken(cookieStore.get(KEY_LOCALSTORAGE.REFRESH_TOKEN)?.value);

      // Retry original request after refreshing token
      res = await fetch(fullUrl, {
        ...options,
        headers: {
          ...baseHeaders,
          ...options?.headers,
        } as any,
        body,
        method,
      });

      payload = await res.json();
      data = {
        status: res.status,
        payload,
      };

      if (!res.ok) {
        throw new HttpError(data);
      }

      return data;
    } else {
      throw new HttpError(data);
    }
  }

  return data;
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

const handleRefreshToken = async (refreshToken: string | undefined) => {
  try {
    const res = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
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
