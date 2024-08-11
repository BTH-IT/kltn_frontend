'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CustomOptions, Method } from '@/libs/http';

export const fetcher = async <Response>(url: string, method?: Method, options?: CustomOptions) => {
  const sessionCookie = cookies().get('__session');
  if (!sessionCookie) {
    throw new Error('Session cookie not found');
  }
  const token = sessionCookie.value;

  let baseOptions: any = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  if (options?.body) {
    baseOptions = {
      ...baseOptions,
      body: options?.body ? JSON.stringify(options.body) : null,
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api${url}`, baseOptions);

  if (res.status === 401) {
    redirect('/login');
  }

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  return (await res.json()) as Promise<Response>;
};
