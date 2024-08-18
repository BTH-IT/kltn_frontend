/* eslint-disable no-undef */
import { KEY_LOCALSTORAGE } from '@/utils';
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

export const isClient = () => typeof window !== 'undefined';

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined,
): Promise<{ status: number; payload: Response }> => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: { [key: string]: string } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        };

  const accessToken = isClient() ? localStorage.getItem(KEY_LOCALSTORAGE.ACCESS_TOKEN) : null;
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

  let payload: Response = await res.json();
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
    } else if (res.status === AUTHENTICATION_ERROR_STATUS && isClient()) {
      const refreshToken = localStorage.getItem(KEY_LOCALSTORAGE.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/refresh-token`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (refreshResponse.ok) {
            const { token: newAccessToken } = await refreshResponse.json();

            // Update local storage with new tokens
            localStorage.setItem(KEY_LOCALSTORAGE.ACCESS_TOKEN, newAccessToken);

            // Retry the original request with the new access token
            baseHeaders.Authorization = `Bearer ${newAccessToken}`;
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
            throw new Error('Failed to refresh token');
          }
        } catch (error) {
          console.log('Error when refreshing token', error);
          localStorage.removeItem(KEY_LOCALSTORAGE.ACCESS_TOKEN);
          localStorage.removeItem(KEY_LOCALSTORAGE.REFRESH_TOKEN);
          localStorage.removeItem(KEY_LOCALSTORAGE.CURRENT_USER);
          location.href = '/login';
        }
      } else {
        throw new HttpError(data);
      }
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

export default http;
